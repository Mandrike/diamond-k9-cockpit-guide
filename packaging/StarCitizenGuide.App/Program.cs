using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Reflection;
using System.Threading;

namespace StarCitizenGuide
{
    internal static class Program
    {
        private static volatile bool stopping;

        private static int Main(string[] args)
        {
            try
            {
                Console.OutputEncoding = System.Text.Encoding.UTF8;

                var options = AppOptions.Parse(args);
                if (options.ShowHelp)
                {
                    PrintHelp();
                    return 0;
                }

                Console.CancelKeyPress += delegate(object sender, ConsoleCancelEventArgs eventArgs)
                {
                    eventArgs.Cancel = true;
                    stopping = true;
                };

                var siteFiles = SiteManifest.Load();
                var port = FindAvailablePort(options.Port);
                var prefix = "http://127.0.0.1:" + port + "/";

                using (var listener = new HttpListener())
                {
                    listener.Prefixes.Add(prefix);
                    listener.Start();

                    Console.WriteLine("Diamond K9 Cockpit Guide is running.");
                    Console.WriteLine("URL: " + prefix);
                    Console.WriteLine("Close this window, press Enter, or press Ctrl+C to stop.");

                    if (!options.NoBrowser)
                    {
                        TryOpenBrowser(prefix);
                    }

                    ThreadPool.QueueUserWorkItem(delegate { RunServer(listener, siteFiles); });

                    Console.ReadLine();
                    stopping = true;

                    if (listener.IsListening)
                    {
                        listener.Stop();
                    }
                }

                return 0;
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex.Message);
                return 1;
            }
        }

        private static void RunServer(HttpListener listener, SiteManifest siteFiles)
        {
            while (!stopping && listener.IsListening)
            {
                try
                {
                    var context = listener.GetContext();
                    ThreadPool.QueueUserWorkItem(delegate { ServeRequest(context, siteFiles); });
                }
                catch (HttpListenerException)
                {
                    break;
                }
                catch (ObjectDisposedException)
                {
                    break;
                }
            }
        }

        private static void ServeRequest(HttpListenerContext context, SiteManifest siteFiles)
        {
            try
            {
                if (!string.Equals(context.Request.HttpMethod, "GET", StringComparison.OrdinalIgnoreCase)
                    && !string.Equals(context.Request.HttpMethod, "HEAD", StringComparison.OrdinalIgnoreCase))
                {
                    context.Response.StatusCode = (int)HttpStatusCode.MethodNotAllowed;
                    return;
                }

                var path = NormalizePath(context.Request.Url == null ? "/" : context.Request.Url.AbsolutePath);
                if (path == null)
                {
                    context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return;
                }

                SiteFile file;
                if (!siteFiles.TryGet(path, out file))
                {
                    context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                    return;
                }

                context.Response.ContentType = file.ContentType;
                context.Response.Headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0";
                context.Response.Headers["Pragma"] = "no-cache";
                context.Response.Headers["Expires"] = "0";

                if (string.Equals(context.Request.HttpMethod, "HEAD", StringComparison.OrdinalIgnoreCase))
                {
                    return;
                }

                using (var resource = file.Open())
                {
                    context.Response.ContentLength64 = resource.Length;
                    resource.CopyTo(context.Response.OutputStream);
                }
            }
            finally
            {
                context.Response.OutputStream.Close();
            }
        }

        private static string NormalizePath(string absolutePath)
        {
            var decoded = WebUtility.UrlDecode(absolutePath).Replace('\\', '/');
            var trimmed = decoded.TrimStart('/');

            if (string.IsNullOrWhiteSpace(trimmed))
            {
                return "index.html";
            }

            var parts = trimmed.Split('/');
            if (parts.Any(part => part == ".." || part == "."))
            {
                return null;
            }

            return trimmed;
        }

        private static int FindAvailablePort(int preferredPort)
        {
            for (var port = preferredPort; port <= 65535; port++)
            {
                TcpListener listener = null;
                try
                {
                    listener = new TcpListener(IPAddress.Loopback, port);
                    listener.Start();
                    return port;
                }
                catch (SocketException)
                {
                }
                finally
                {
                    if (listener != null)
                    {
                        listener.Stop();
                    }
                }
            }

            throw new InvalidOperationException("No available loopback TCP port was found.");
        }

        private static void TryOpenBrowser(string url)
        {
            try
            {
                Process.Start(new ProcessStartInfo(url)
                {
                    UseShellExecute = true
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("Could not open browser automatically: " + ex.Message);
            }
        }

        private static void PrintHelp()
        {
            Console.WriteLine("DiamondK9CockpitGuide.exe [--port <port>] [--no-browser]");
            Console.WriteLine();
            Console.WriteLine("Options:");
            Console.WriteLine("  --port <port>   Preferred local port. Defaults to 8787.");
            Console.WriteLine("  --no-browser    Start the local server without opening a browser.");
            Console.WriteLine("  --help          Show this help.");
        }
    }

    internal sealed class AppOptions
    {
        public AppOptions(int port, bool noBrowser, bool showHelp)
        {
            Port = port;
            NoBrowser = noBrowser;
            ShowHelp = showHelp;
        }

        public int Port { get; private set; }

        public bool NoBrowser { get; private set; }

        public bool ShowHelp { get; private set; }

        public static AppOptions Parse(string[] args)
        {
            var port = 8787;
            var noBrowser = false;
            var showHelp = false;

            for (var index = 0; index < args.Length; index++)
            {
                var arg = args[index];
                switch (arg)
                {
                    case "--help":
                    case "-h":
                    case "/?":
                        showHelp = true;
                        break;
                    case "--no-browser":
                        noBrowser = true;
                        break;
                    case "--port":
                        if (index + 1 >= args.Length || !int.TryParse(args[index + 1], out port) || port < 1024 || port > 65535)
                        {
                            throw new ArgumentException("--port must be followed by a number from 1024 to 65535.");
                        }
                        index++;
                        break;
                    default:
                        throw new ArgumentException("Unknown argument: " + arg);
                }
            }

            return new AppOptions(port, noBrowser, showHelp);
        }
    }

    internal sealed class SiteManifest
    {
        private const string ResourcePrefix = "site/";

        private readonly IDictionary<string, SiteFile> files;

        private SiteManifest(IDictionary<string, SiteFile> files)
        {
            this.files = files;
        }

        public static SiteManifest Load()
        {
            var assembly = Assembly.GetExecutingAssembly();
            var resources = new Dictionary<string, SiteFile>(StringComparer.OrdinalIgnoreCase);

            foreach (var resourceName in assembly.GetManifestResourceNames())
            {
                if (!resourceName.StartsWith(ResourcePrefix, StringComparison.Ordinal))
                {
                    continue;
                }

                var path = resourceName.Substring(ResourcePrefix.Length).Replace('\\', '/');
                resources[path] = new SiteFile(path, resourceName, GetContentType(path), assembly);
            }

            if (!resources.ContainsKey("index.html"))
            {
                throw new InvalidOperationException("Embedded site is missing index.html.");
            }

            return new SiteManifest(resources);
        }

        public bool TryGet(string path, out SiteFile file)
        {
            return files.TryGetValue(path, out file);
        }

        private static string GetContentType(string path)
        {
            var extension = Path.GetExtension(path).ToLowerInvariant();
            switch (extension)
            {
                case ".html":
                    return "text/html; charset=utf-8";
                case ".js":
                    return "text/javascript; charset=utf-8";
                case ".css":
                    return "text/css; charset=utf-8";
                case ".svg":
                    return "image/svg+xml";
                case ".webmanifest":
                    return "application/manifest+json; charset=utf-8";
                case ".json":
                    return "application/json; charset=utf-8";
                case ".png":
                    return "image/png";
                case ".jpg":
                case ".jpeg":
                    return "image/jpeg";
                case ".ico":
                    return "image/x-icon";
                default:
                    return "application/octet-stream";
            }
        }
    }

    internal sealed class SiteFile
    {
        private readonly Assembly assembly;

        public SiteFile(string path, string resourceName, string contentType, Assembly assembly)
        {
            Path = path;
            ResourceName = resourceName;
            ContentType = contentType;
            this.assembly = assembly;
        }

        public string Path { get; private set; }

        public string ResourceName { get; private set; }

        public string ContentType { get; private set; }

        public Stream Open()
        {
            var stream = assembly.GetManifestResourceStream(ResourceName);
            if (stream == null)
            {
                throw new InvalidOperationException("Missing embedded resource: " + ResourceName);
            }

            return stream;
        }
    }
}
