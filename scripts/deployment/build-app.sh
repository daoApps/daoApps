#!/bin/bash
set -euo pipefail

# Application Build Script for DAO Apps
# Builds the application for production deployment

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

BUILD_DIR=${BUILD_DIR:-dist}
BUILD_BUNDLE=${BUILD_BUNDLE:-daoapps-build.tar.gz}

info "Starting production build for DAO Apps..."
info "Project root: $PROJECT_ROOT"

# Check Node.js version
NODE_REQUIRED="20"
NODE_CURRENT=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [[ $NODE_CURRENT -lt $NODE_REQUIRED ]]; then
    error "Node.js version >= $NODE_REQUIRED is required. Current version: $NODE_CURRENT"
fi

# Clean previous build
info "Cleaning previous build..."
rm -rf "$PROJECT_ROOT/$BUILD_DIR"
rm -f "$PROJECT_ROOT/$BUILD_BUNDLE"

# Install dependencies
info "Installing dependencies..."

# Check for lock files and use appropriate install method
if [[ -f "$PROJECT_ROOT/pnpm-lock.yaml" ]]; then
    info "Using pnpm for package installation"
    pnpm install
elif [[ -f "$PROJECT_ROOT/yarn.lock" ]]; then
    info "Using yarn for package installation"
    yarn install
elif [[ -f "$PROJECT_ROOT/package-lock.json" ]]; then
    info "Using npm for package installation"
    npm ci
else
    info "No lock file found, using npm install"
    npm install
fi

# Check if this is a monorepo and build all apps
if [[ -f "$PROJECT_ROOT/pnpm-workspace.yaml" ]] || [[ -d "$PROJECT_ROOT/apps" ]]; then
    info "Detected monorepo structure, building all applications..."

    # Check if there's a root build script
    if grep -q '"build"' "$PROJECT_ROOT/package.json"; then
        info "Running root build script..."
        npm run build
    else
        # Build each app in apps directory
        for app_dir in "$PROJECT_ROOT/apps"/*; do
            if [[ -d "$app_dir" ]]; then
                app_name=$(basename "$app_dir")
                if [[ -f "$app_dir/package.json" ]]; then
                    info "Building application: $app_name"
                    cd "$app_dir"
                    if grep -q '"build"' "package.json"; then
                        if [[ -f "$app_dir/pnpm-lock.yaml" ]]; then
                            pnpm install
                            pnpm run build
                        elif [[ -f "$app_dir/yarn.lock" ]]; then
                            yarn install
                            yarn run build
                        else
                            npm install
                            npm run build
                        fi
                    else
                        info "No build script found for $app_name, skipping..."
                    fi
                fi
            fi
        done
    fi
else
    # Single repository build
    info "Building application..."
    npm run build
fi

cd "$PROJECT_ROOT"

# Verify build output
info "Verifying build output..."
if [[ ! -d "$BUILD_DIR" ]]; then
    # Look for build output in apps/AgentPit/dist
    if [[ -d "$PROJECT_ROOT/apps/AgentPit/$BUILD_DIR" ]]; then
        info "Build output found in apps/AgentPit/$BUILD_DIR"
        cp -r "$PROJECT_ROOT/apps/AgentPit/$BUILD_DIR" .
    else
        error "Build directory $BUILD_DIR not found after build"
    fi
fi

# Collect necessary files for deployment
info "Preparing deployment bundle..."
TEMP_DIR=$(mktemp -d)
mkdir -p "$TEMP_DIR/daoapps"

# Copy build output
cp -r "$BUILD_DIR" "$TEMP_DIR/daoapps/"

# Copy package.json and lock file
cp package.json "$TEMP_DIR/daoapps/"
if [[ -f package-lock.json ]]; then
    cp package-lock.json "$TEMP_DIR/daoapps/"
fi
if [[ -f pnpm-lock.yaml ]]; then
    cp pnpm-lock.yaml "$TEMP_DIR/daoapps/"
fi
if [[ -f yarn.lock ]]; then
    cp yarn.lock "$TEMP_DIR/daoapps/"
fi

# Copy environment and configuration
if [[ -f "$ENV_LOCAL" ]]; then
    cp "$ENV_LOCAL" "$TEMP_DIR/daoapps/.env.production"
else
    cp "$ENV_FILE" "$TEMP_DIR/daoapps/.env.production"
fi

# Copy any additional configuration files
if [[ -f "$PROJECT_ROOT/ecosystem.config.js" ]]; then
    cp "$PROJECT_ROOT/ecosystem.config.js" "$TEMP_DIR/daoapps/"
fi

# Create the compressed bundle
info "Creating compressed archive: $BUILD_BUNDLE"
cd "$TEMP_DIR"
tar -czf "$PROJECT_ROOT/$BUILD_BUNDLE" daoapps/

# Cleanup temp directory
rm -rf "$TEMP_DIR"

# Show bundle information
BUNDLE_SIZE=$(du -h "$PROJECT_ROOT/$BUILD_BUNDLE" | cut -f1)
success "Build completed successfully!"
success "Bundle created: $PROJECT_ROOT/$BUILD_BUNDLE ($BUNDLE_SIZE)"
success "Next step: Run ./scripts/deployment/deploy-to-server.sh to deploy"

exit 0
