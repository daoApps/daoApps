#!/bin/bash
# Remote deployment script - runs on target server

set -e

echo "==> Starting deployment on target server..."

cd /var/www/daoapps
mkdir -p releases

# Extract the build
tar -xzf /tmp/daoapps-build.tar.gz -C /tmp

# Create release directory with timestamp
release_name=release_$(date +%Y%m%d_%H%M%S)
cp -r /tmp/dist /var/www/daoapps/releases/$release_name

# Update symlink
ln -sfn /var/www/daoapps/releases/$release_name /var/www/daoapps/current

# Fix permissions
chown -R daoapps:daoapps /var/www/daoapps/releases/$release_name
chown -h daoapps:daoapps /var/www/daoapps/current

echo "==> Release created: $release_name"
echo "==> Symlink updated to current: $release_name"

# Cleanup
rm -rf /tmp/dist /tmp/deploy

echo "==> Deployment files extracted successfully"
