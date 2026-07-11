[CmdletBinding()]
param(
    [ValidateSet('win-x64', 'win-arm64')]
    [string]$Runtime = 'win-x64',

    [string]$OutputRoot = (Join-Path $env:USERPROFILE 'Downloads'),

    [switch]$NoZip
)

Set-StrictMode -Version 2.0
$ErrorActionPreference = 'Stop'

function Resolve-ChildPath {
    param(
        [Parameter(Mandatory)]
        [string]$Parent,

        [Parameter(Mandatory)]
        [string]$Child
    )

    $parentPath = [System.IO.Path]::GetFullPath($Parent)
    $childPath = [System.IO.Path]::GetFullPath((Join-Path $parentPath $Child))

    if (-not $childPath.StartsWith($parentPath, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Resolved path '$childPath' is outside '$parentPath'."
    }

    return $childPath
}

$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$projectPath = Join-Path $repoRoot 'packaging\StarCitizenGuide.App\StarCitizenGuide.App.csproj'
$programPath = Join-Path $repoRoot 'packaging\StarCitizenGuide.App\Program.cs'
$outputRootPath = [System.IO.Path]::GetFullPath($OutputRoot)
$packageDir = Resolve-ChildPath -Parent $outputRootPath -Child 'DiamondK9CockpitGuide'
$zipPath = Resolve-ChildPath -Parent $outputRootPath -Child 'DiamondK9CockpitGuide.zip'

foreach ($requiredPath in @(
    (Join-Path $repoRoot 'index.html'),
    (Join-Path $repoRoot 'app.js'),
    (Join-Path $repoRoot 'styles.css'),
    (Join-Path $repoRoot 'data\ships.js'),
    (Join-Path $repoRoot 'assets')
)) {
    if (-not (Test-Path -LiteralPath $requiredPath)) {
        throw "Required app file or folder missing: $requiredPath"
    }
}

New-Item -ItemType Directory -Force -Path $outputRootPath | Out-Null

if (Test-Path -LiteralPath $packageDir) {
    Remove-Item -LiteralPath $packageDir -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $packageDir | Out-Null

if ((Test-Path -LiteralPath $zipPath) -and -not $NoZip) {
    Remove-Item -LiteralPath $zipPath -Force
}

function Test-DotNetSdkAvailable {
    $dotnet = Get-Command dotnet -ErrorAction SilentlyContinue
    if (-not $dotnet) {
        return $false
    }

    $sdks = & $dotnet.Source --list-sdks
    return ($LASTEXITCODE -eq 0 -and $sdks)
}

function Get-CSharpCompilerPath {
    $candidates = @(
        (Join-Path $env:WINDIR 'Microsoft.NET\Framework64\v4.0.30319\csc.exe'),
        (Join-Path $env:WINDIR 'Microsoft.NET\Framework\v4.0.30319\csc.exe')
    )

    foreach ($candidate in $candidates) {
        if (Test-Path -LiteralPath $candidate) {
            return $candidate
        }
    }

    throw 'No .NET SDK or Windows .NET Framework C# compiler was found.'
}

function New-ResourceFile {
    param(
        [Parameter(Mandatory)]
        [string]$FullName,

        [Parameter(Mandatory)]
        [string]$LogicalName
    )

    [pscustomobject]@{
        FullName = $FullName
        LogicalName = $LogicalName
    }
}

function Get-OrgImageResourceFiles {
    $downloads = Join-Path $env:USERPROFILE 'Downloads'
    $orgImages = @(
        @{ File = 'DiamondK9-Cockpit-Guide-Mark.png'; LogicalName = 'site/assets/org/diamond-k9-mark.png' }
    )

    foreach ($image in $orgImages) {
        $path = Join-Path $downloads $image.File
        if (Test-Path -LiteralPath $path) {
            New-ResourceFile -FullName $path -LogicalName $image.LogicalName
        }
        else {
            Write-Warning "Optional organization image missing: $path"
        }
    }
}

function Get-SiteResourceFiles {
    $directFiles = @(
        'index.html',
        'app.js',
        'styles.css',
        'manifest.webmanifest'
    ) | ForEach-Object {
        $path = Join-Path $repoRoot $_
        New-ResourceFile -FullName $path -LogicalName ("site/{0}" -f $_.Replace('\', '/'))
    }

    $nestedFiles = Get-ChildItem -LiteralPath (Join-Path $repoRoot 'data'), (Join-Path $repoRoot 'assets') -File -Recurse |
        ForEach-Object {
            $relativePath = $_.FullName.Substring($repoRoot.Length).TrimStart('\', '/').Replace('\', '/')
            New-ResourceFile -FullName $_.FullName -LogicalName "site/$relativePath"
        }

    return @($directFiles + $nestedFiles + (Get-OrgImageResourceFiles))
}

if (Test-DotNetSdkAvailable) {
    dotnet publish $projectPath `
        --configuration Release `
        --runtime $Runtime `
        --self-contained true `
        -p:PublishSingleFile=true `
        -p:EnableCompressionInSingleFile=true `
        -p:DebugType=None `
        -p:DebugSymbols=false `
        -p:InvariantGlobalization=true `
        --output $packageDir

    if ($LASTEXITCODE -ne 0) {
        throw "dotnet publish failed with exit code $LASTEXITCODE."
    }
}
else {
    $csc = Get-CSharpCompilerPath
    $compileRoot = Join-Path $env:TEMP 'StarCitizenGuideBuild'

    if (Test-Path -LiteralPath $compileRoot) {
        Remove-Item -LiteralPath $compileRoot -Recurse -Force
    }

    New-Item -ItemType Directory -Force -Path $compileRoot | Out-Null

    $exePath = Join-Path $compileRoot 'DiamondK9CockpitGuide.exe'
    $responsePath = Join-Path $compileRoot 'StarCitizenGuide-csc.rsp'
    $responseLines = @(
        '/nologo',
        '/target:exe',
        '/optimize+',
        '/nowin32manifest',
        ('/out:"{0}"' -f $exePath),
        ('"{0}"' -f $programPath)
    )

    foreach ($resource in Get-SiteResourceFiles) {
        $fullPath = [System.IO.Path]::GetFullPath($resource.FullName)
        $logicalName = $resource.LogicalName
        $responseLines += ('/resource:"{0}",{1}' -f $fullPath, $logicalName)
    }

    Set-Content -LiteralPath $responsePath -Value $responseLines -Encoding ASCII
    & $csc "@$responsePath"

    if ($LASTEXITCODE -ne 0) {
        throw "csc.exe failed with exit code $LASTEXITCODE."
    }

    New-Item -ItemType Directory -Force -Path $packageDir | Out-Null
    Copy-Item -LiteralPath $exePath -Destination (Join-Path $packageDir 'DiamondK9CockpitGuide.exe') -Force
}

New-Item -ItemType Directory -Force -Path $packageDir | Out-Null
$readmePath = Join-Path $packageDir 'README-DiamondK9.txt'
@'
Diamond K9 Cockpit Guide
========================

How to run:
1. Double-click DiamondK9CockpitGuide.exe.
2. Your browser opens the local guide automatically.
3. Keep the small console window open while using the guide.
4. Close the console window, press Enter, or press Ctrl+C to stop it.

Notes:
- No Star Citizen files are changed.
- No install is required.
- The app only serves itself on 127.0.0.1 on your own PC.
- The Skibsguides section contains the individual ship keybind and function guides.
- The Skibskøb section shows in-game UEC prices and buy locations, sourced from UEX.
- The Loadouts section shows buyable component and weapon shortlists with UEX/Erkul live links.
- If Windows SmartScreen asks, choose More info -> Run anyway if you trust the sender.

Troubleshooting:
- If the browser does not open, copy the URL shown in the console window.
- If port 8787 is busy, the app automatically uses the next free local port.
'@ | Set-Content -LiteralPath $readmePath -Encoding UTF8

if (-not $NoZip) {
    Compress-Archive -LiteralPath $packageDir -DestinationPath $zipPath -Force
}

Write-Host "Portable package created:"
Write-Host "  Folder: $packageDir"
if (-not $NoZip) {
    Write-Host "  ZIP:    $zipPath"
}
