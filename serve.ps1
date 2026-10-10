# ==============================================================================
# GUNSHOT PORTFOLIO - LOCAL WEB SERVER (PowerShell)
# ==============================================================================
# Runs a zero-dependency local HTTP server on http://localhost:8080
# Usage: Open PowerShell in this folder and run: .\serve.ps1
# ==============================================================================

$port = 8080
$url = "http://localhost:$port/"
$root = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($url)

try {
    $listener.Start()
    Write-Host ""
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host " [GUNSHOT BROADCAST PORTFOLIO SERVER RUNNING]" -ForegroundColor Green
    Write-Host " URL: $url" -ForegroundColor Yellow
    Write-Host " Serving directory: $root" -ForegroundColor White
    Write-Host " Press Ctrl+C in this terminal to stop the server." -ForegroundColor Gray
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host ""

    # Open default browser automatically
    Start-Process $url

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        try {
            $rawPath = [System.Uri]::UnescapeDataString($request.Url.LocalPath.TrimStart('/'))
            if ([string]::IsNullOrWhiteSpace($rawPath)) {
                $rawPath = "index.html"
            }

            $filePath = Join-Path $root ($rawPath -replace '/', '\')

            # Add CORS headers
            $response.Headers.Add("Access-Control-Allow-Origin", "*")

            if (Test-Path $filePath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $mime = switch ($ext) {
                    ".html" { "text/html; charset=utf-8" }
                    ".css"  { "text/css; charset=utf-8" }
                    ".js"   { "application/javascript; charset=utf-8" }
                    ".json" { "application/json; charset=utf-8" }
                    ".png"  { "image/png" }
                    ".jpg"  { "image/jpeg" }
                    ".jpeg" { "image/jpeg" }
                    ".svg"  { "image/svg+xml" }
                    ".pdf"  { "application/pdf" }
                    ".ico"  { "image/x-icon" }
                    ".ttf"  { "font/ttf" }
                    ".otf"  { "font/otf" }
                    ".woff" { "font/woff" }
                    ".woff2"{ "font/woff2" }
                    ".mp4"  { "video/mp4" }
                    ".webm" { "video/webm" }
                    ".mov"  { "video/quicktime" }
                    ".mkv"  { "video/x-matroska" }
                    ".avi"  { "video/x-msvideo" }
                    default { "application/octet-stream" }
                }

                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentType = $mime
                $response.ContentLength64 = $bytes.Length
                $response.StatusCode = 200
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
            else {
                $response.StatusCode = 404
                $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $response.OutputStream.Write($msg, 0, $msg.Length)
            }
        }
        catch {
            Write-Warning "Error processing request: $_"
        }
        finally {
            try { $response.OutputStream.Close() } catch {}
            try { $response.Close() } catch {}
        }
    }
}
catch {
    Write-Error "Server error: $_"
}
finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    $listener.Close()
}
