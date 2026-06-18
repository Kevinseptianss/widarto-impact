param(
    [string]$Message = "",
    [switch]$SkipCommit,
    [switch]$SkipPush,
    [switch]$SkipDeploy
)

$ErrorActionPreference = "Stop"

# ── Server config (edit here if needed) ──────────────────────────────────────
$SshTarget = "root@187.124.233.178"
$RemotePath = "/var/www/widarto-impact-landingpage"
$Branch = "main"
$DockerCompose = "docker compose"
# ─────────────────────────────────────────────────────────────────────────────

function Write-Step([string]$Text) {
    Write-Host ""
    Write-Host "==> $Text" -ForegroundColor Cyan
}

function Write-Ok([string]$Text) {
    Write-Host "    $Text" -ForegroundColor Green
}

function Write-Warn([string]$Text) {
    Write-Host "    $Text" -ForegroundColor Yellow
}

function Write-Fail([string]$Text) {
    Write-Host "    $Text" -ForegroundColor Red
}

$RepoRoot = $PSScriptRoot
Set-Location $RepoRoot

Write-Step "Widarto Impact deploy"
Write-Host "    Repo:   $RepoRoot"
Write-Host "    Branch: $Branch"
Write-Host "    Server: ${SshTarget}:${RemotePath}"

if (-not $SkipCommit) {
    Write-Step "Commit local changes"

    $status = git status --porcelain
    if (-not $status) {
        Write-Warn "No local changes to commit."
    } else {
        if (-not $Message) {
            $Message = "Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
        }

        git add -A
        git reset HEAD -- .env .env.local .env.production .env.development 2>$null | Out-Null
        git reset HEAD -- .next out node_modules 2>$null | Out-Null

        $staged = git diff --cached --name-only
        if (-not $staged) {
            Write-Warn "Nothing staged after excluding env/build files."
        } else {
            git commit -m $Message
            Write-Ok "Committed: $Message"
        }
    }
}

if (-not $SkipPush) {
    Write-Step "Push to origin/$Branch"
    git push origin $Branch
    Write-Ok "Push complete."
}

if (-not $SkipDeploy) {
    Write-Step "Deploy on server via SSH"

    $remoteCmd = "cd '$RemotePath' && git fetch origin && git checkout '$Branch' && git pull origin '$Branch' && $DockerCompose up -d --build --remove-orphans && $DockerCompose ps"

    ssh $SshTarget $remoteCmd
    if ($LASTEXITCODE -ne 0) {
        Write-Fail "Remote deployment failed."
        exit $LASTEXITCODE
    }

    Write-Ok "Server is running the latest build."
}

Write-Step "Done"
