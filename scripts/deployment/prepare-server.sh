#!/bin/bash
set -euo pipefail

# Server Environment Preparation Script for DAO Apps
# This script should be run ONCE on the target server to prepare the environment

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

info() { echo -e "${YELLOW}==> $*${NC}"; }
success() { echo -e "${GREEN}==> $*${NC}"; }
error() { echo -e "${RED}==> ERROR: $*${NC}" >&2; exit 1; }

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   error "This script must be run as root. Use sudo."
fi

# Get OS information
OS=""
if [[ -f /etc/os-release ]]; then
    . /etc/os-release
    OS=$ID
fi

info "Starting server environment preparation for $OS..."

# Update system packages
info "Updating system packages..."
case $OS in
    ubuntu|debian)
        apt-get update -y
        apt-get upgrade -y
        ;;
    centos|rhel|fedora)
        dnf update -y || yum update -y
        ;;
    *)
        warning "Unknown OS, skipping system update"
        ;;
esac

# Install basic dependencies
info "Installing basic dependencies..."
case $OS in
    ubuntu|debian)
        apt-get install -y curl wget git ufw nginx logrotate openssl
        ;;
    centos|rhel|fedora)
        dnf install -y curl wget git firewalld nginx logrotate openssl || yum install -y curl wget git firewalld nginx logrotate openssl
        ;;
esac

# Install Node.js 20.x (LTS)
info "Installing Node.js 20.x LTS..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    case $OS in
        ubuntu|debian)
            apt-get install -y nodejs
            ;;
        centos|rhel|fedora)
            dnf install -y nodejs || yum install -y nodejs
            ;;
    esac
else
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    info "Node.js v$NODE_VERSION already installed, skipping..."
fi

# Enable corepack for pnpm/yarn
info "Enabling corepack..."
corepack enable

# Install PM2 for process management (optional but recommended)
info "Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

# Configure firewall
info "Configuring firewall..."
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
    info "UFW configured, allowed ports: 22, 80, 443"
elif systemctl is-active --quiet firewalld; then
    firewall-cmd --permanent --add-service=http
    firewall-cmd --permanent --add-service=https
    firewall-cmd --permanent --add-service=ssh
    firewall-cmd --reload
    info "firewalld configured, allowed services: http, https, ssh"
else
    warning "No firewall detected, skipping configuration"
fi

# Start and enable Nginx
info "Starting Nginx..."
systemctl enable nginx
systemctl start nginx

# Create application user
info "Creating application user..."
if ! id -u daoapps &> /dev/null; then
    useradd -m -s /bin/bash daoapps
    info "Created user: daoapps"
else
    info "User daoapps already exists"
fi

# Create application directory structure
info "Creating directory structure..."
APP_ROOT="/var/www/daoapps"
LOG_ROOT="/var/log/daoapps"
BACKUP_ROOT="/var/backups/daoapps"

mkdir -p $APP_ROOT
mkdir -p $LOG_ROOT
mkdir -p $BACKUP_ROOT/releases
mkdir -p $BACKUP_ROOT/backups

# Set correct permissions
chown -R daoapps:daoapps $APP_ROOT
chown -R daoapps:daoapps $LOG_ROOT
chown -R daoapps:daoapps $BACKUP_ROOT

chmod 750 $APP_ROOT
chmod 750 $LOG_ROOT
chmod 750 $BACKUP_ROOT

info "Created directories:"
echo "  - $APP_ROOT"
echo "  - $LOG_ROOT"
echo "  - $BACKUP_ROOT"

# Install Certbot for SSL certificates
info "Installing Certbot for SSL certificates..."
case $OS in
    ubuntu|debian)
        apt-get install -y certbot python3-certbot-nginx
        ;;
    centos|rhel|fedora)
        dnf install -y certbot python3-certbot-nginx || yum install -y certbot python3-certbot-nginx
        ;;
esac

# Show installed versions
info "Installation complete. Installed versions:"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
if command -v pnpm &> /dev/null; then
    echo "pnpm: $(pnpm --version)"
fi
if command -v pm2 &> /dev/null; then
    echo "pm2: $(pm2 --version)"
fi
echo "Nginx: $(nginx -v 2>&1 | cut -d'/' -f2)"
echo "Git: $(git --version | cut -d' ' -f3)"

success "Server environment preparation completed successfully!"
success "Next steps:"
echo "  1. Configure your deployment settings in .env.production"
echo "  2. Run the deployment script from your local machine"
echo "  3. Obtain SSL certificate with: certbot --nginx -d your-domain.com"

exit 0
