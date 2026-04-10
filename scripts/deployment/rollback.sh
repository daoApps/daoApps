#!/bin/bash
set -euo pipefail

# Rollback Script for DAO Apps
# Rolls back to previous working deployment if current deployment fails

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

# Get number of releases to roll back (default 1)
ROLLBACK_STEPS=${1:-1}

# SSH options
SSH_OPTS=(-p "$SERVER_PORT" -o StrictHostKeyChecking=no -o ConnectTimeout=30)
if [[ -n "${SERVER_SSH_KEY:-}" ]]; then
    SSH_OPTS+=(-i "$SERVER_SSH_KEY")
fi

info "Starting rollback..."
info "Rolling back $ROLLBACK_STEPS step(s) on $SERVER_USER@$SERVER_HOST"

# List releases on remote and find previous release
info "Finding previous release..."

RELEAVES_LIST=$(ssh "${SSH_OPTS[@]}" "$SERVER_USER@$SERVER_HOST" "ls -t $APP_WORKDIR/releases/")

if [[ -z "$RELEAVES_LIST" ]]; then
    error "No releases found in $APP_WORKDIR/releases/"
fi

# Get the Nth release (skip first one which is current)
TARGET_RELEASE=$(echo "$RELEAVES_LIST" | sed -n "${ROLLBACK_STEPS}p")

if [[ -z "$TARGET_RELEASE" ]]; then
    error "Cannot roll back $ROLLBACK_STEPS steps: no previous release found"
fi

info "Target release: $TARGET_RELEASE"

# Perform rollback on remote
ssh "${SSH_OPTS[@]}" "$SERVER_USER@$SERVER_HOST" bash -s << EOF
set -e

APP_WORKDIR=$1
TARGET_RELEASE=$2
BACKUP_ROOT=$3

echo "==> Creating backup of current release before rollback..."
if [[ -d "$APP_WORKDIR/current" ]]; then
    BACKUP_NAME="pre_rollback_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_ROOT/backups"
    cp -R "$APP_WORKDIR/current" "$BACKUP_ROOT/backups/$BACKUP_NAME"
    echo "Current release backed up to: $BACKUP_ROOT/backups/$BACKUP_NAME"
fi

echo "==> Rolling back to: $TARGET_RELEASE..."
RELEASE_PATH="$APP_WORKDIR/releases/$TARGET_RELEASE"

if [[ ! -d "$RELEASE_PATH" ]]; then
    echo "ERROR: Release directory $RELEASE_PATH does not exist"
    exit 1
fi

ln -sfn "$RELEASE_PATH/daoapps" "$APP_WORKDIR/current"

echo "==> Setting correct permissions..."
chown -R daoapps:daoapps "$RELEASE_PATH"

echo "==> Restarting daoapps service..."
systemctl restart daoapps

echo "Rollback completed"
EOF

# Pass variables to remote script
ssh "${SSH_OPTS[@]}" "$SERVER_USER@$SERVER_HOST" bash -s \
    "$APP_WORKDIR" \
    "$TARGET_RELEASE" \
    "/var/backups/daoapps"

info "Waiting for service to restart..."
sleep 5

# Verify rollback
info "Verifying rollback..."
"${SCRIPT_DIR}/verify-deployment.sh" || {
    error "Rollback verification failed!\nCheck the server manually."
    exit 1
}

success "Rollback completed successfully!"
success "Rolled back to release: $TARGET_RELEASE"
exit 0
