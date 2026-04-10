#!/bin/bash

echo "=== Server Environment Check ==="
echo ""

# System information
echo "1. System Information"
echo "-------------------"
lsb_release -a
uname -a
echo ""

# Node.js and npm
echo "2. Node.js and npm"
echo "-------------------"
if command -v node &> /dev/null; then
    node -v
else
    echo "Node.js not found"
fi

if command -v npm &> /dev/null; then
    npm -v
else
    echo "npm not found"
fi
echo ""

# Git
echo "3. Git"
echo "-------"
if command -v git &> /dev/null; then
    git --version
else
    echo "Git not found"
fi
echo ""

# Web server
echo "4. Web Server"
echo "-------------"
if command -v nginx &> /dev/null; then
    nginx -v
else
    echo "Nginx not found"
fi

if command -v apache2 &> /dev/null; then
    apache2 -v
else
    echo "Apache not found"
fi
echo ""

# Certbot
echo "5. Certbot"
echo "-----------"
if command -v certbot &> /dev/null; then
    certbot --version
else
    echo "Certbot not found"
fi
echo ""

echo "=== Check Complete ==="
