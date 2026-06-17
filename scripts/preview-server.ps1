param(
    [Parameter(Mandatory = $true)]
    [string]$Root,
    [int]$Port = 3005
)

$ErrorActionPreference = "Stop"

$Root = $Root.Trim().Trim('"').TrimEnd('\')
if (-not (Test-Path -LiteralPath $Root)) {
    Write-Host ""
    Write-Host " Folder not found: $Root"
    Write-Host ""
    exit 1
}

$Root = (Resolve-Path -LiteralPath $Root).Path
$PreferredPort = $Port

$MimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".mjs"  = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".webp" = "image/webp"
    ".avif" = "image/avif"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2" = "font/woff2"
    ".ttf"  = "font/ttf"
    ".otf"  = "font/otf"
    ".txt"  = "text/plain; charset=utf-8"
    ".xml"  = "application/xml"
    ".map"  = "application/json"
}

function Get-LocalFilePath([string]$RequestPath) {
    $relative = [System.Uri]::UnescapeDataString($RequestPath.TrimStart("/"))
    if ([string]::IsNullOrWhiteSpace($relative)) {
        $relative = "index.html"
    }

    $candidate = Join-Path $Root ($relative -replace "/", [IO.Path]::DirectorySeparatorChar)

    if (Test-Path $candidate -PathType Container) {
        $candidate = Join-Path $candidate "index.html"
    }

    if (-not (Test-Path $candidate -PathType Leaf)) {
        if (-not $relative.EndsWith(".html")) {
            $htmlCandidate = "$candidate.html"
            if (Test-Path $htmlCandidate -PathType Leaf) {
                return $htmlCandidate
            }
        }
        return $null
    }

    $fullRoot = [IO.Path]::GetFullPath($Root)
    $fullCandidate = [IO.Path]::GetFullPath($candidate)
    if (-not $fullCandidate.StartsWith($fullRoot, [StringComparison]::OrdinalIgnoreCase)) {
        return $null
    }

    return $fullCandidate
}

function Send-FileResponse($Context, [string]$FilePath) {
    $response = $Context.Response
    $extension = [IO.Path]::GetExtension($FilePath).ToLower()
    $contentType = $MimeTypes[$extension]
    if (-not $contentType) {
        $contentType = "application/octet-stream"
    }

    $bytes = [IO.File]::ReadAllBytes($FilePath)
    $response.StatusCode = 200
    $response.ContentType = $contentType
    $response.ContentLength64 = $bytes.Length
    $response.OutputStream.Write($bytes, 0, $bytes.Length)
    $response.OutputStream.Close()
}

function Send-NotFound($Context) {
    $response = $Context.Response
    $body = [Text.Encoding]::UTF8.GetBytes("404 - Page not found")
    $response.StatusCode = 404
    $response.ContentType = "text/plain; charset=utf-8"
    $response.ContentLength64 = $body.Length
    $response.OutputStream.Write($body, 0, $body.Length)
    $response.OutputStream.Close()
}

function Start-PreviewListener([int]$PreferredPort) {
    $lastError = $null

    for ($tryPort = $PreferredPort; $tryPort -lt ($PreferredPort + 20); $tryPort++) {
        $listener = New-Object System.Net.HttpListener
        $url = "http://127.0.0.1:$tryPort/"
        $listener.Prefixes.Add($url)

        try {
            $listener.Start()
            return @{
                Listener = $listener
                Port = $tryPort
                Url = $url
            }
        } catch {
            $lastError = $_
            $listener.Close()
        }
    }

    throw $lastError
}

$started = Start-PreviewListener -PreferredPort $Port
$listener = $started.Listener
$Url = $started.Url
$Port = $started.Port

Write-Host ""
if ($Port -ne $PreferredPort) {
    Write-Host " Port $PreferredPort was busy. Using port $Port instead."
    Write-Host ""
}
Write-Host " Website is running at $Url"
Write-Host " Keep this window open while browsing."
Write-Host " Close this window when you are done."
Write-Host ""

Start-Process $Url

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        try {
            $filePath = Get-LocalFilePath $context.Request.Url.AbsolutePath
            if ($filePath) {
                Send-FileResponse $context $filePath
            } else {
                Send-NotFound $context
            }
        } catch {
            try {
                $context.Response.StatusCode = 500
                $context.Response.Close()
            } catch {}
        }
    }
} finally {
    $listener.Stop()
}
