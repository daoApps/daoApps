#!/bin/bash
set -euo pipefail

# One-click Deployment Script for DAO Apps
# This script runs the complete deployment process end-to-end

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

info() { echo -e "${YELLOW}==> $*${NC}"; }
success() { echo -e "${GREEN}==> $*${NC}"; }
blue() { echo -e "${BLUE}==> $*${NC}"; }
error() { echo -e "${RED}==> ERROR: $*${NC}" >&2; exit 1; }

# Display help
show_help() {
cat << EOF
DAO Apps Full Deployment Script
Usage: ./deploy.sh [OPTIONS]

Options:
    -h, --help              Show this help message
    -e, --env FILE          Use specified environment file
    -s, --skip-build        Skip build step (use existing bundle)
    -t, --transport METHOD  Transport method: scp, sftp, rsync (default: auto)
    -n, --no-verify         Skip verification after deployment
    -r, --rollback          Rollback instead of deploying new version
    -s, --steps N           Number of steps to roll back (default: 1)

Examples:
    ./deploy.sh                                    Full interactive deployment
    ./deploy.sh --env production.local             Use custom env file
    ./deploy.sh --skip-build                       Deploy already built bundle
    ./deploy.sh --rollback --steps 1              Rollback one version
EOF
}

# Parse command line arguments
SKIP_BUILD=false
SKIP_VERIFY=false
DO_ROLLBACK=false
ROLLBACK_STEPS=1
TRANSPORT_METHOD=""
ENV_FILE=""

while [[ $# -ge 1 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -e|--env)
            ENV_FILE="$2"
            shift 2
            ;;
        -s|--skip-build)
            SKIP_BUILD=true
            shift
            ;;
        -t|--transport)
            TRANSPORT_METHOD="$2"
            shift 2
            ;;
        -n|--no-verify)
            SKIP_VERIFY=true
            shift
            ;;
        -r|--rollback)
            DO_ROLLBACK=true
            shift
            ;;
        --steps)
            ROLLBACK_STEPS="$2"
            shift 2
            ;;
        *)
            error "Unknown option: $1"
            ;;
    esac
done

# Get script directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPTS_DIR="${SCRIPT_DIR}/scripts/deployment"

# Handle rollback
if [[ "$DO_ROLLBACK" == "true" ]]; then
    info "Starting rollback..."
    exec "${SCRIPTS_DIR}/rollback.sh" "$ROLLBACK_STEPS"
    exit 0
fi

# Load environment
if [[ -n "$ENV_FILE" ]]; then
    if [[ -f "$ENV_FILE" ]]; then
        info "Loading environment from $ENV_FILE"
        source "$ENV_FILE"
    else
        error "Environment file not found: $ENV_FILE"
    fi
elif [[ -f "${SCRIPT_DIR}/deploy/.env.production.local" ]]; then
    info "Loading local environment from .env.production.local"
    source "${SCRIPT_DIR}/deploy/.env.production.local"
elif [[ -f "${SCRIPT_DIR}/deploy/.env.production" ]]; then
    info "Loading default environment from .env.production"
    source "${SCRIPT_DIR}/deploy/.env.production"
else
    error "No environment file found\nCreate deploy/.env.production.local with your configuration"
fi

# Check required variables
required_vars=("SERVER_HOST" "SERVER_USER" "APP_DOMAIN" "APP_PORT")
for var in "${required_vars[@]}"; do
    if [[ -z "${!var:-}" ]]; then
        error "Required variable $var is not set in environment file"
    fi
done

# Welcome message
clear
blue "╔════════════════════════════════════════════════════════════╗"
blue "║       DAO Apps - Full Automated Deployment Process         ║"
blue "╚════════════════════════════════════════════════════════════╝"
echo
info "Target Server: $SERVER_USER@$SERVER_HOST"
info "Domain: $APP_DOMAIN"
info "Port: $APP_PORT"
echo

# Confirm before proceeding
read -p "Continue with deployment? [y/N] " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    info "Deployment cancelled"
    exit 0
fi

START_TIME=$(date +%s)

# Step 1: Build the application
if [[ "$SKIP_BUILD" == "false" ]]; then
    echo
    info "Step 1/5: Building application..."
    if ! "${SCRIPTS_DIR}/build-app.sh"; then
        error "Build failed. Deployment aborted."
    fi
    success "Build completed"
else
    echo
    info "Step 1/5: Skipping build (using existing bundle)"
fi

# Step 2: Deploy to server
echo
info "Step 2/5: Deploying to server..."
if [[ -n "$TRANSPORT_METHOD" ]]; then
    if ! "${SCRIPTS_DIR}/deploy-to-server.sh" "$TRANSPORT_METHOD"; then
        error "Deployment transfer failed."
    fi
else
    if ! "${SCRIPTS_DIR}/deploy-to-server.sh"; then
        error "Deployment transfer failed."
    fi
fi
success "Deployment transfer completed"

# Step 3: Configure services
echo
info "Step 3/5: Configuring Nginx and systemd..."
if ! "${SCRIPTS_DIR}/configure-services.sh"; then
    error "Service configuration failed."
fi
success "Service configuration completed"

# Step 4: Setup monitoring
echo
info "Step 4/5: Setting up monitoring and logging..."
if ! command -v "${SCRIPTS_DIR}/setup-monitoring.sh" &> /dev/null; then
    "${SCRIPTS_DIR}/setup-monitoring.sh"
    success "Monitoring setup completed"
else
    info "Monitoring script not found, skipping..."
fi

# Step 5: Verify deployment
if [[ "$SKIP_VERIFY" == "false" ]]; then
    echo
    info "Step 5/5: Verifying deployment..."
    if ! "${SCRIPTS_DIR}/verify-deployment.sh"; then
        echo
        error "Verification failed! Attempting automatic rollback..."
        "${SCRIPTS_DIR}/rollback.sh" 1
        exit 1
    fi
    success "Verification completed"
else
    echo
    info "Step 5/5: Skipping verification"
fi

# Calculate duration
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
DURATION_MIN=$((DURATION / 60))
DURATION_SEC=$((DURATION % 60))

echo
success "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
success "=================================================="
success "Application URL: $(if [[ "$SSL_ENABLED" == "true" ]]; then echo "https://$APP_DOMAIN"; else echo "http://$APP_DOMAIN"; fi)"
success "Health check: $HEALTH_CHECK_URL"
success "Duration: ${DURATION_MIN}m ${DURATION_SEC}s"
success "=================================================="
echo
info "Useful commands:"
echo "  Check logs: ssh $SERVER_USER@$SERVER_HOST 'journalctl -u daoapps -f'"
echo "  Restart service: ssh $SERVER_USER@$SERVER_HOST 'systemctl restart daoapps'"
echo "  Rollback: ./deploy.sh --rollback"
echo

exit 0
