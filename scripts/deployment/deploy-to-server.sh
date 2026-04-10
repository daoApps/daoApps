#!/bin/bash
set -euo pipefail

# File Transfer and Deployment Script for DAO Apps
# Transports the build bundle to target server and deploys it

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info() { echo -e "${YELLOW}==> $*${NC}"; }
success() { echo -e "${GREEN}==> $*${NC}"; }
error() { echo -e "${RED}==> ERROR: $*${NC}" >&2; exit 1; }

# Load environment configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Get project root (3 levels up from this script)
PROJECT_ROOT="${SCRIPT_DIR%%/scripts/deployment*}"

ENV_FILE="${PROJECT_ROOT}/deploy/.env.production"
ENV_LOCAL="${PROJECT_ROOT}/deploy/.env.production.local"

if [[ -f "$ENV_LOCAL" ]]; then
    info "Loading local configuration from $ENV_LOCAL"
    source "$ENV_LOCAL"
elif [[ -f "$ENV_FILE" ]]; then
    info "Loading default configuration from $ENV_FILE"
    source "$ENV_FILE"
else
    error "No environment file found at $ENV_FILE"
fi

# Validate required configuration
required_vars=(
    "SERVER_HOST" "SERVER_USER" "SERVER_PORT" "APP_WORKDIR" "BUILD_BUNDLE"
)
for var in "${required_vars[@]}"; do
    if [[ -z "${!var:-}" ]]; then
        error "Required variable $var is not set in environment file"
    fi
done

BUILD_BUNDLE="${PROJECT_ROOT}/${BUILD_BUNDLE}"

# Check if bundle exists
if [[ ! -f "$BUILD_BUNDLE" ]]; then
    error "Build bundle not found at $BUILD_BUNDLE\nRun ./scripts/deployment/build-app.sh first"
fi

# Get timestamp for this deployment
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RELEASE_NAME="release_${TIMESTAMP}"
REMOTE_BUNDLE_PATH="/tmp/${BUILD_BUNDLE##*/}"

info "Starting deployment to $SERVER_USER@$SERVER_HOST:$SERVER_PORT"
info "Release name: $RELEASE_NAME"

# Choose transport method
TRANSPORT_METHOD="scp"
if command -v rsync &> /dev/null; then
    TRANSPORT_METHOD="rsync"
fi

# Allow override from command line
if [[ $# -ge 1 ]]; then
    TRANSPORT_METHOD="$1"
fi

info "Using transport method: $TRANSPORT_METHOD"

# SSH options
SSH_OPTS=(-p "$SERVER_PORT" -o StrictHostKeyChecking=no -o ConnectTimeout=30)
if [[ -n "${SERVER_SSH_KEY:-}" ]]; then
    SSH_OPTS+=(-i "$SERVER_SSH_KEY")
fi

# Transfer the file
info "Transferring build bundle..."
case $TRANSPORT_METHOD in
    scp)
        scp "${SSH_OPTS[@]}" "$BUILD_BUNDLE" "$SERVER_USER@$SERVER_HOST:$REMOTE_BUNDLE_PATH"
        ;;
    sftp)
        sftp "${SSH_OPTS[@]}" "$SERVER_USER@$SERVER_HOST" <<EOF
put $BUILD_BUNDLE $REMOTE_BUNDLE_PATH
EOF
        ;;
    rsync)
        rsync -avz -e "ssh ${SSH_OPTS[*]}" "$BUILD_BUNDLE" "$SERVER_USER@$SERVER_HOST:$REMOTE_BUNDLE_PATH"
        ;;
    *)
        error "Unknown transport method: $TRANSPORT_METHOD\nAvailable: scp, sftp, rsync"
        ;;
esac

success "Bundle transferred successfully"

# Deploy on remote server
info "Running deployment on remote server..."

ssh "${SSH_OPTS[@]}" "$SERVER_USER@$SERVER_HOST" bash -s << 'EOF'
set -e

# Load variables from parent
APP_WORKDIR=$1
BACKUP_ROOT=$2
RELEASE_NAME=$3
REMOTE_BUNDLE_PATH=$4
APP_USER=$5

echo "==> Creating release directory: $APP_WORKDIR/releases/$RELEASE_NAME"
mkdir -p "$APP_WORKDIR/releases/$RELEASE_NAME"

echo "==> Extracting bundle..."
tar -xzf "$REMOTE_BUNDLE_PATH" -C "$APP_WORKDIR/releases/$RELEASE_NAME"

echo "==> Creating backup of current release..."
if [[ -d "$APP_WORKDIR/current" ]]; then
    BACKUP_NAME="backup_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_ROOT/backups"
    cp -R "$APP_WORKDIR/current" "$BACKUP_ROOT/backups/$BACKUP_NAME"
    echo "Backup created: $BACKUP_ROOT/backups/$BACKUP_NAME"
fi

echo "==> Updating symlink to point to new release..."
ln -sfn "$APP_WORKDIR/releases/$RELEASE_NAME/daoapps" "$APP_WORKDIR/current"

echo "==> Setting correct permissions..."
chown -R $APP_USER:$APP_USER "$APP_WORKDIR/releases/$RELEASE_NAME"
chown -R $APP_USER:$APP_USER "$APP_WORKDIR/current"

echo "==> Cleaning up temporary file..."
rm -f "$REMOTE_BUNDLE_PATH"

# Keep only last 5 releases
echo "==> Cleaning up old releases (keeping last 5)..."
cd "$APP_WORKDIR/releases"
ls -t | tail -n +6 | xargs rm -rf --

echo "Deployment unpacked successfully"
EOF

# Pass variables to remote script
ssh "${SSH_OPTS[@]}" "$SERVER_USER@$SERVER_HOST" bash -s \
    "$APP_WORKDIR" \
    "/var/backups/daoapps" \
    "$RELEASE_NAME" \
    "$REMOTE_BUNDLE_PATH" \
    "daoapps"

success "File deployment completed!"
success "Next step: Run ./scripts/deployment/configure-services.sh to configure Nginx and systemd"

exit 0
