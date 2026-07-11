[CmdletBinding()]
param(
    [ValidateRange(1024, 65535)]
    [int]$Port = 8787,

    [switch]$NoBrowser
)

Set-StrictMode -Version 2.0
$ErrorActionPreference = 'Stop'

function Test-PortAvailable {
    param([int]$CandidatePort)

    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $CandidatePort)
    try {
        $listener.Start()
        return $true
    }
    catch {
        return $false
    }
    finally {
        $listener.Stop()
    }
}

function Test-GuideServerAvailable {
    param([int]$CandidatePort)

    try {
        $response = Invoke-WebRequest -Uri "http://127.0.0.1:$CandidatePort/index.html" -UseBasicParsing -TimeoutSec 2
        return ($response.StatusCode -eq 200 -and $response.Content -like '*Star Citizen*')
    }
    catch {
        return $false
    }
}

function Test-RealPythonPath {
    param([string]$Path)

    if ([string]::IsNullOrWhiteSpace($Path) -or -not (Test-Path -LiteralPath $Path -PathType Leaf)) {
        return $false
    }

    $fullPath = [System.IO.Path]::GetFullPath($Path)
    $windowsRoot = [System.IO.Path]::GetFullPath($env:WINDIR)
    $windowsAppsRoot = Join-Path $env:LOCALAPPDATA 'Microsoft\WindowsApps'

    if ($fullPath.StartsWith($windowsRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
        return $false
    }

    if ((Test-Path -LiteralPath $windowsAppsRoot) -and $fullPath.StartsWith([System.IO.Path]::GetFullPath($windowsAppsRoot), [System.StringComparison]::OrdinalIgnoreCase)) {
        return $false
    }

    return ([System.IO.Path]::GetFileName($fullPath) -ieq 'python.exe')
}

function Test-PythonExecutable {
    param([string]$Path)

    if (-not (Test-RealPythonPath -Path $Path)) {
        return $false
    }

    try {
        & $Path -c "import sys; raise SystemExit(0 if sys.version_info.major == 3 else 1)" *> $null
        return ($LASTEXITCODE -eq 0)
    }
    catch {
        return $false
    }
}

function Resolve-PythonFromLauncher {
    $launcher = Get-Command py -ErrorAction SilentlyContinue
    if (-not $launcher) {
        return $null
    }

    try {
        $pythonPath = (& $launcher.Source -3 -c "import sys; print(sys.executable)" 2>$null | Select-Object -First 1).Trim()
        if (Test-PythonExecutable -Path $pythonPath) {
            return $pythonPath
        }
    }
    catch {
        Write-Verbose "Python launcher failed: $($_.Exception.Message)"
    }

    return $null
}

function Resolve-PythonCommand {
    $candidatePaths = @()
    $launcherPython = Resolve-PythonFromLauncher
    if ($launcherPython) {
        $candidatePaths += $launcherPython
    }

    $candidatePaths += Get-ChildItem -LiteralPath (Join-Path $env:LOCALAPPDATA 'Programs\Python') -Filter python.exe -Recurse -ErrorAction SilentlyContinue |
        Select-Object -ExpandProperty FullName

    $candidatePaths += @(
        (Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe')
    )

    foreach ($commandName in @('python', 'python3')) {
        $command = Get-Command $commandName -ErrorAction SilentlyContinue
        if ($command) {
            $candidatePaths += $command.Source
        }
    }

    foreach ($candidatePath in ($candidatePaths | Where-Object { $_ } | Select-Object -Unique)) {
        if (Test-PythonExecutable -Path $candidatePath) {
            return @{
                Source = [System.IO.Path]::GetFullPath($candidatePath)
                Prefix = @()
            }
        }
    }

    throw "Python was not found. Open index.html directly, or install Python and rerun this script."
}

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not (Test-Path (Join-Path $root 'index.html'))) {
    throw "index.html was not found in $root"
}

if (Test-GuideServerAvailable -CandidatePort $Port) {
    $url = "http://127.0.0.1:$Port/"
    Write-Host "Diamond K9 Cockpit Guide is already running."
    Write-Host "URL: $url"
    if (-not $NoBrowser) {
        Start-Process $url
    }
    return
}

$selectedPort = $Port
while (-not (Test-PortAvailable -CandidatePort $selectedPort)) {
    $selectedPort++
    if ($selectedPort -gt 65535) {
        throw "No available local TCP port found."
    }
}

$python = Resolve-PythonCommand
$url = "http://127.0.0.1:$selectedPort/"
$serverScript = Join-Path $env:TEMP 'StarCitizenGuideServer.py'
$serverCode = @'
import functools
import http.server
import os
import pathlib
import socketserver
import sys

ROOT = pathlib.Path(os.environ["SC_GUIDE_ROOT"]).resolve()


class GuideHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


class ThreadingServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True


if __name__ == "__main__":
    port = int(sys.argv[1])
    handler = functools.partial(GuideHandler, directory=str(ROOT))
    with ThreadingServer(("127.0.0.1", port), handler) as httpd:
        httpd.serve_forever()
'@

Set-Content -LiteralPath $serverScript -Value $serverCode -Encoding UTF8
$env:SC_GUIDE_ROOT = $root

Write-Host "Serving Diamond K9 Cockpit Guide from $root"
Write-Host "URL: $url"
Write-Host "Press Ctrl+C to stop."

if (-not $NoBrowser) {
    Start-Process $url
}

$arguments = @()
$arguments += $python.Prefix
$arguments += @($serverScript, [string]$selectedPort)
& $python.Source @arguments
