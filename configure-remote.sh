#!/bin/bash
# Remote configuration script - runs on target server

set -e

echo "==> Configuring Nginx and systemd..."

# Copy Nginx configuration
cp /tmp/nginx.conf /etc/nginx/sites-available/daoapps.conf
ln -sf /etc/nginx/sites-available/daoapps.conf /etc/nginx/sites-enabled/daoapps.conf

# Test Nginx configuration
echo "==> Testing Nginx configuration..."
nginx -t

# Copy systemd service
cp /tmp/daoapps.service /etc/systemd/system/daoapps.service

# Reload systemd
systemctl daemon-reload

# Enable and start service
systemctl enable daoapps
systemctl restart daoapps

# Restart Nginx
systemctl restart nginx

echo "==> Installing logrotate configuration..."
cp /tmp/daoapps.logrotate /etc/logrotate.d/daoapps

# Fix permissions
chown -R daoapps:daoapps /var/www/daoapps
chown -R daoapps:daoapps /var/log/daoapps

echo "==> Configuration completed!"
echo ""
echo "Next steps:"
echo "  1. Obtain SSL certificate with: sudo certbot --nginx -d pagent.agentpit.io -d www.pagent.agentpit.io"
echo "  2. Check status: sudo systemctl status daoapps"
echo "  3. Check logs: sudo journalctl -u daoapps -f"
