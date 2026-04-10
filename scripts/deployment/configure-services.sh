#!/bin/bash
set -euo pipefail

# Service Configuration Script for DAO Apps
# Configures Nginx and systemd service on target server

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
    "SERVER_HOST" "SERVER_USER" "SERVER_PORT" "APP_NAME" "APP_DOMAIN"
    "APP_PORT" "APP_WORKDIR" "BUILD_DIR" "SSL_ENABLED"
)
for var in "${required_vars[@]}"; do
    if [[ -z "${!var:-}" ]]; then
        error "Required variable $var is not set in environment file"
    fi
done

# SSH options
SSH_OPTS=(-p "$SERVER_PORT" -o StrictHostKeyChecking=no -o ConnectTimeout=30)
if [[ -n "${SERVER_SSH_KEY:-}" ]]; then
    SSH_OPTS+=(-i "$SERVER_SSH_KEY")
fi

info "Configuring services on $SERVER_USER@$SERVER_HOST..."

# Process Nginx configuration template
info "Processing Nginx configuration template..."
NGINX_TEMPLATE="${PROJECT_ROOT}/deploy/nginx.conf.template"
NGINX_PROCESSED="/tmp/${APP_NAME}_nginx.conf"

# Replace placeholders in template
sed \
    -e "s/{{APP_NAME}}/$APP_NAME/g" \
    -e "s/{{APP_DOMAIN}}/$APP_DOMAIN/g" \
    -e "s/{{APP_PORT}}/$APP_PORT/g" \
    -e "s/{{APP_WORKDIR}}/$APP_WORKDIR\/current/g" \
    -e "s/{{BUILD_DIR}}/$BUILD_DIR/g" \
    -e "s/{{SSL_CERT_PATH}}/${SSL_CERT_PATH:-\/etc\/letsencrypt\/live\/$APP_DOMAIN\/fullchain.pem}/g" \
    -e "s/{{SSL_KEY_PATH}}/${SSL_KEY_PATH:-\/etc\/letsencrypt\/live\/$APP_DOMAIN\/privkey.pem}/g" \
    "$NGINX_TEMPLATE" > "$NGINX_PROCESSED"

# Remove Handlebars-style conditionals
if [[ "$SSL_ENABLED" == "true" ]]; then
    sed -i '/{{^SSL_ENABLED}}/,/{{\/SSL_ENABLED}}/d' "$NGINX_PROCESSED"
    sed -i '/{{#SSL_ENABLED}}/d' "$NGINX_PROCESSED"
    sed -i '/{{\/SSL_ENABLED}}/d' "$NGINX_PROCESSED"
else
    sed -i '/{{#SSL_ENABLED}}/,/{{\/SSL_ENABLED}}/d' "$NGINX_PROCESSED"
    sed -i '/{{^SSL_ENABLED}}/d' "$NGINX_PROCESSED"
    sed -i '/{{\/SSL_ENABLED}}/d' "$NGINX_PROCESSED"
fi

info "Transferring Nginx configuration..."
scp "${SSH_OPTS[@]}" "$NGINX_PROCESSED" "$SERVER_USER@$SERVER_HOST:/tmp/${APP_NAME}"

# Process systemd service template
info "Processing systemd service template..."
SYSTEMD_TEMPLATE="${PROJECT_ROOT}/deploy/daoapps.service"
SYSTEMD_PROCESSED="/tmp/daoapps.service"

NODE_PATH=$(which node || echo "/usr/bin/node")

sed \
    -e "s/{{APP_NAME}}/$APP_NAME/g" \
    -e "s/{{APP_PORT}}/$APP_PORT/g" \
    -e "s/{{APP_WORKDIR}}/$APP_WORKDIR\/current/g" \
    -e "s/{{APP_USER}}/daoapps/g" \
    -e "s/{{NODE_PATH}}/$NODE_PATH/g" \
    "$SYSTEMD_TEMPLATE" > "$SYSTEMD_PROCESSED"

info "Transferring systemd service..."
scp "${SSH_OPTS[@]}" "$SYSTEMD_PROCESSED" "$SERVER_USER@$SERVER_HOST:/tmp/daoapps.service"

# Cleanup local temp files
rm -f "$NGINX_PROCESSED" "$SYSTEMD_PROCESSED"

# Configure services on remote
info "Applying configuration on remote server..."

ssh "${SSH_OPTS[@]}" "$SERVER_USER@$SERVER_HOST" bash -s << 'EOF'
set -e

APP_NAME=$1
APP_DOMAIN=$2
NGINX_CONF_PATH=$3
NGINX_ENABLED_PATH=$4

echo "==> Installing Nginx configuration..."
mkdir -p "$NGINX_CONF_PATH"
mkdir -p "$NGINX_ENABLED_PATH"

cp "/tmp/$APP_NAME" "$NGINX_CONF_PATH/${APP_DOMAIN}"
ln -sf "$NGINX_CONF_PATH/${APP_DOMAIN}" "$NGINX_ENABLED_PATH/${APP_DOMAIN}"

echo "==> Installing systemd service..."
cp /tmp/daoapps.service /etc/systemd/system/daoapps.service
systemctl daemon-reload

echo "==> Testing Nginx configuration..."
if ! nginx -t; then
    echo "ERROR: Nginx configuration test failed"
    exit 1
fi

echo "==> Reloading Nginx..."
systemctl reload nginx

echo "==> Enabling and starting daoapps service..."
systemctl enable daoapps
systemctl restart daoapps

echo "==> Checking service status..."
systemctl status daoapps --no-pager

echo "Service configuration completed"
EOF

# Pass variables to remote script
ssh "${SSH_OPTS[@]}" "$SERVER_USER@$SERVER_HOST" bash -s \
    "$APP_NAME" \
    "$APP_DOMAIN" \
    "${NGINX_CONF_PATH:-/etc/nginx/sites-available}" \
    "${NGINX_ENABLED_PATH:-/etc/nginx/sites-enabled}"

# Get SSL certificate if enabled
if [[ "$SSL_ENABLED" == "true" ]]; then
    info "SSL is enabled, obtaining certificate with Certbot..."
    info "Running certbot on remote server..."

    ssh "${SSH_OPTS[@]}" "$SERVER_USER@$SERVER_HOST" sudo certbot --nginx -d "$APP_DOMAIN" -d "www.$APP_DOMAIN" --non-interactive --agree-tos -m "webmaster@$APP_DOMAIN"
fi

success "Service configuration completed!"
success "Next step: Run ./scripts/deployment/verify-deployment.sh to verify the deployment"

exit 0
