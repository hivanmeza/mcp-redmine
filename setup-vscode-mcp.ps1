#!/usr/bin/env pwsh
# setup-vscode-mcp.ps1
# Copies cline_mcp_settings.json into the VS Code extension storage used by the Roo Cline extension.

$sourceFile = ".\cline_mcp_settings.json"
$targetDir = "$env:APPDATA\Code\User\globalStorage\rooveterinaryinc.roo-cline\settings"
$targetFile = "$targetDir\cline_mcp_settings.json"

Write-Host "Configuring MCP Redmine for VS Code..."

# Create directory if missing
if (!(Test-Path $targetDir)) {
    Write-Host "Creating VS Code config directory: $targetDir"
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}

# Copy config file
if (Test-Path $sourceFile) {
    Write-Host "Copying config: $sourceFile -> $targetFile"
    Copy-Item -Path $sourceFile -Destination $targetFile -Force
    Write-Host "VS Code MCP configuration applied: $targetFile"
    Write-Host "Please restart VS Code to apply changes."
} else {
    Write-Host "No configuration file found at $sourceFile"
}

Write-Host "\nVerifying global installation..."
try {
    $version = npm list -g mcp-redmine --depth=0 2>$null
    if ($version -match "mcp-redmine@") {
        Write-Host "MCP Redmine is installed globally:"
        $version -split "`n" | Where-Object { $_ -match "mcp-redmine@" } | ForEach-Object { Write-Host "  $_" }
    } else {
        Write-Host "Could not verify global installation"
    }
} catch {
    Write-Host "Error verifying installation: $($_.Exception.Message)"
}
