#!/bin/bash

# Flexloop Deployment Script

set -e

echo "=== Flexloop Deployment Started ==="
echo ""

# Server information
SERVER_IP="34.126.124.215"
USER="a1"
DOMAIN="pagent.agentpit.io"
SSH_KEY="~/.ssh/id_rsa_google_longterm.pub"

# Local project path
LOCAL_PROJECT=$(pwd)

# Remote project path
REMOTE_PROJECT="~/agentpit"

echo "1. Checking server connection..."
if ssh -i "$SSH_KEY" $USER@$SERVER_IP echo "Connection successful"; then
    echo "✓ Server connection established"
else
    echo "✗ Failed to connect to server"
    exit 1
fi
echo ""

echo "2. Creating project directory on server..."
ssh -i "$SSH_KEY" $USER@$SERVER_IP "mkdir -p $REMOTE_PROJECT"
echo "✓ Project directory created"
echo ""

echo "3. Uploading project files..."
scp -i "$SSH_KEY" -r . $USER@$SERVER_IP:$REMOTE_PROJECT
echo "✓ Project files uploaded"
echo ""

echo "4. Installing dependencies..."
ssh -i "$SSH_KEY" $USER@$SERVER_IP "cd $REMOTE_PROJECT && npm install"
echo "✓ Dependencies installed"
echo ""

echo "5. Building project..."
ssh -i "$SSH_KEY" $USER@$SERVER_IP "cd $REMOTE_PROJECT && npm run build"
echo "✓ Project built"
echo ""

echo "6. Checking if Nginx is installed..."
if ssh -i "$SSH_KEY" $USER@$SERVER_IP "command -v nginx &> /dev/null"; then
    echo "✓ Nginx is installed"
else
    echo "Installing Nginx..."
    ssh -i "$SSH_KEY" $USER@$SERVER_IP "sudo apt update && sudo apt install -y nginx"
    echo "✓ Nginx installed"
fi
echo ""

echo "7. Configuring Nginx..."
NGINX_CONFIG="server {
    listen 80;
    server_name $DOMAIN;
    
    location / {
        root $REMOTE_PROJECT/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}"

ssh -i "$SSH_KEY" $USER@$SERVER_IP "echo '$NGINX_CONFIG' | sudo tee /etc/nginx/sites-available/$DOMAIN"
ssh -i "$SSH_KEY" $USER@$SERVER_IP "sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/"
ssh -i "$SSH_KEY" $USER@$SERVER_IP "sudo nginx -t"
ssh -i "$SSH_KEY" $USER@$SERVER_IP "sudo systemctl restart nginx"
echo "✓ Nginx configured"
echo ""

echo "8. Installing Certbot..."
if ssh -i "$SSH_KEY" $USER@$SERVER_IP "command -v certbot &> /dev/null"; then
    echo "✓ Certbot is installed"
else
    ssh -i "$SSH_KEY" $USER@$SERVER_IP "sudo apt update && sudo apt install -y certbot python3-certbot-nginx"
    echo "✓ Certbot installed"
fi
echo ""

echo "9. Obtaining SSL certificate..."
ssh -i "$SSH_KEY" $USER@$SERVER_IP "sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@agentpit.io"
echo "✓ SSL certificate obtained"
echo ""

echo "10. Setting up auto-renewal..."
ssh -i "$SSH_KEY" $USER@$SERVER_IP "sudo crontab -l | grep -q 'certbot renew' || echo '0 12 * * * /usr/bin/certbot renew --quiet' | sudo crontab -"
echo "✓ Auto-renewal configured"
echo ""

echo "11. Testing deployment..."
if curl -s -L "http://$DOMAIN" | grep -q "Flexloop"; then
    echo "✓ Website is accessible"
else
    echo "✗ Website is not accessible"
fi
echo ""

echo "=== Flexloop Deployment Completed ==="
echo "Website: https://$DOMAIN"
