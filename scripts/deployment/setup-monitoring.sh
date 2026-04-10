#!/bin/bash
set -euo pipefail

# Monitoring Setup Script for DAO Apps
# Sets up log rotation and optional Prometheus monitoring

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

# SSH options
SSH_OPTS=(-p "$SERVER_PORT" -o StrictHostKeyChecking=no -o ConnectTimeout=30)
if [[ -n "${SERVER_SSH_KEY:-}" ]]; then
    SSH_OPTS+=(-i "$SERVER_SSH_KEY")
fi

info "Setting up monitoring and logging on target server..."

# Install logrotate configuration
info "Installing logrotate configuration..."
scp "${SSH_OPTS[@]}" "${PROJECT_ROOT}/deploy/daoapps.logrotate" "$SERVER_USER@$SERVER_HOST:/tmp/daoapps"

ssh "${SSH_OPTS[@]}" "$SERVER_USER@$SERVER_HOST" bash -s << 'EOF
set -e

LOG_DIR=$1

echo "==> Installing logrotate configuration..."
mkdir -p "$LOG_DIR"
cp /tmp/daoapps /etc/logrotate.d/daoapps

echo "==> Testing logrotate configuration..."
if logrotate /etc/logrotate.d/daoapps --test; then
    echo "Logrotate configuration OK"
else
    echo "Warning: Logrotate configuration test failed"
fi

echo "Logrotate setup complete"
EOF

# Pass variables
ssh "${SSH_OPTS[@]}" "$SERVER_USER@$SERVER_HOST" bash -s "$LOG_DIR"

# Ask about Prometheus setup
if [[ -z "${SETUP_PROMETHEUS:-}" ]]; then
    info "Prometheus setup is optional. Skipping..."
else
    info "Setting up Prometheus configuration..."
    scp "${SSH_OPTS[@]}" "${PROJECT_ROOT}/deploy/prometheus.yml" "$SERVER_USER@$SERVER_HOST:/tmp/prometheus.yml"

    ssh "${SSH_OPTS[@]}" "$SERVER_USER@$SERVER_HOST" bash -s << EOF
set -e
APP_PORT=$1
if [[ -d /etc/prometheus ]]; then
    sed "s/{{APP_PORT}}/$APP_PORT/g" /tmp/prometheus.yml > /etc/prometheus/prometheus.yml
    systemctl reload prometheus
    echo "Prometheus configuration updated"
else
    echo "Prometheus not installed, skipping configuration"
fi
EOF
fi

success "Monitoring and logging setup completed!"
success "Logs will be rotated daily, keeping 14 days of logs"

exit 0
