#!/bin/bash
set -euo pipefail

# Deployment Verification Script for DAO Apps
# Verifies that the deployment is working correctly

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info() { echo -e "${YELLOW}==> $*${NC}"; }
success() { echo -e "${GREEN}==> $*${NC}"; }
error() { echo -e "${RED}==> ERROR: $*${NC}" >&2; }
fail() { echo -e "${RED}==> VERIFICATION FAILED: $*${NC}" >&2; exit 1; }

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
    exit 1
fi

# SSH options
SSH_OPTS=(-p "$SERVER_PORT" -o StrictHostKeyChecking=no -o ConnectTimeout=30)
if [[ -n "${SERVER_SSH_KEY:-}" ]]; then
    SSH_OPTS+=(-i "$SERVER_SSH_KEY")
fi

# Set health check URL
if [[ -z "${HEALTH_CHECK_URL:-}" ]]; then
    if [[ "$SSL_ENABLED" == "true" ]]; then
        PROTO="https"
    else
        PROTO="http"
    fi
    HEALTH_CHECK_URL="${PROTO}://${APP_DOMAIN}/health"
fi

HEALTH_CHECK_TIMEOUT=${HEALTH_CHECK_TIMEOUT:-30}

info "Starting deployment verification..."

# Check 1: Service status on remote
info "Checking systemd service status..."
SERVICE_ACTIVE=$(ssh "${SSH_OPTS[@]}" "$SERVER_USER@$SERVER_HOST" "systemctl is-active daoapps")

if [[ "$SERVICE_ACTIVE" != "active" ]]; then
    fail "Service daoapps is not active. Status: $SERVICE_ACTIVE\nCheck logs with: ssh $SERVER_USER@$SERVER_HOST 'journalctl -u daoapps -n 50'"
fi
success "✓ Service daoapps is active"

# Check 2: Port listening
info "Checking if port $APP_PORT is listening..."
PORT_LISTENING=$(ssh "${SSH_OPTS[@]}" "$SERVER_USER@$SERVER_HOST" "netstat -tuln | grep :$APP_PORT > /dev/null && echo yes || echo no")

if [[ "$PORT_LISTENING" != "yes" ]]; then
    fail "Port $APP_PORT is not open. Application is not listening."
fi
success "✓ Port $APP_PORT is open"

# Check 3: Get primary URL status
info "Checking $APP_DOMAIN..."
if command -v curl &> /dev/null; then
    HTTP_CODE=$(curl -L -s -o /dev/null -w "%{http_code}" --connect-timeout 10 "https://$APP_DOMAIN" || curl -L -s -o /dev/null -w "%{http_code}" --connect-timeout 10 "http://$APP_DOMAIN")

    if [[ "$HTTP_CODE" =~ ^(200|201|301|302)$ ]]; then
        success "✓ $APP_DOMAIN returned HTTP $HTTP_CODE"
    else
        error "HTTP status code: $HTTP_CODE"
    fi
else
    info "curl not available, skipping HTTP check"
fi

# Check 4: Health check endpoint
info "Performing health check: $HEALTH_CHECK_URL"

HEALTH_OK=0
for i in $(seq 1 $HEALTH_CHECK_TIMEOUT); do
    if curl -f -s -m 5 "$HEALTH_CHECK_URL" > /dev/null; then
        HEALTH_OK=1
        break
    fi
    sleep 1
done

if [[ "$HEALTH_OK" -ne 1 ]]; then
    fail "Health check failed after $HEALTH_CHECK_TIMEOUT seconds\nURL: $HEALTH_CHECK_URL"
fi

success "✓ Health check passed"

# Check 5: Verify files exist on remote
info "Verifying deployment files..."
FILES_OK=$(ssh "${SSH_OPTS[@]}" "$SERVER_USER@$SERVER_HOST" "
    if [[ -d $APP_WORKDIR/current/$BUILD_DIR ]] && [[ -f $APP_WORKDIR/current/package.json ]]; then
        echo ok
    else
        echo fail
    fi
")

if [[ "$FILES_OK" != "ok" ]]; then
    fail "Deployment files missing from $APP_WORKDIR/current/"
fi
success "✓ All required deployment files present"

# Check 6: Check Nginx configuration
info "Verifying Nginx configuration..."
NGINX_OK=$(ssh "${SSH_OPTS[@]}" "$SERVER_USER@$SERVER_HOST" "
    if nginx -t 2>/dev/null; then
        echo ok
    else
        echo fail
    fi
")

if [[ "$NGINX_OK" != "ok" ]]; then
    fail "Nginx configuration test failed"
fi
success "✓ Nginx configuration is valid"

# Generate verification report
echo
info "=== Deployment Verification Report ==="
success "✅ ALL CHECKS PASSED! Deployment is working correctly."
echo
echo "Service Status: $SERVICE_ACTIVE"
echo "Application URL: $(if [[ "$SSL_ENABLED" == "true" ]]; then echo "https://$APP_DOMAIN"; else echo "http://$APP_DOMAIN"; fi)"
echo "Health Check: $HEALTH_CHECK_URL"
echo "Deployment Directory: $APP_WORKDIR/current/"
echo

exit 0
