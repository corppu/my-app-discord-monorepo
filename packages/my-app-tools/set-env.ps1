# Windows PowerShell script to load environment variables from .env
# Usage: .\set-env.ps1

$envFile = Join-Path $PSScriptRoot ".env"
if (Test-Path $envFile) {
    Get-Content $envFile |
        Where-Object { $_ -and -not $_.StartsWith('#') } |
        ForEach-Object {
            $parts = $_ -split '=', 2
            if ($parts.Length -eq 2) {
                $key = $parts[0].Trim()
                $value = $parts[1].Trim(' "''')
                [System.Environment]::SetEnvironmentVariable($key, $value, 'Process')
                Write-Host "Set: $key=$value"
            }
        }
    Write-Host "✅ Environment variables loaded from .env"
} else {
    Write-Warning ".env file not found in $PSScriptRoot"
}
