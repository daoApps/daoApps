#!/bin/bash
set -euo pipefail

# AgentPit 自动化部署脚本

# 配置参数
SERVER_IP="34.126.124.215"
SERVER_USER="a1"
SSH_KEY="C:\Users\xinzo\.ssh\id_rsa_google_longterm"
DOMAIN="pagent.agentpit.io"
PROJECT_PATH="$(pwd)"
LOG_FILE="logs/deploy.log"

# 颜色定义
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

# 日志函数
log() {
    local level=$1
    local message=$2
    local timestamp=$(date "%Y-%m-%d %H:%M:%S")
    
    case $level in
        "INFO")
            echo -e "${GREEN}[INFO] ${timestamp}${NC} ${message}"
            ;;
        "WARNING")
            echo -e "${YELLOW}[WARNING] ${timestamp}${NC} ${message}"
            ;;
        "ERROR")
            echo -e "${RED}[ERROR] ${timestamp}${NC} ${message}"
            ;;
        *)
            echo -e "[${level}] ${timestamp} ${message}"
            ;;
    esac
    
    # 写入日志文件
    mkdir -p "$(dirname "$LOG_FILE")"
    echo "[${level}] ${timestamp} ${message}" >> "$LOG_FILE"
}

# 检查本地环境
check_local_env() {
    log "INFO" "检查本地环境..."
    
    # 检查Node.js
    if ! command -v node &> /dev/null; then
        log "ERROR" "Node.js 未安装"
        return 1
    fi
    
    # 检查npm
    if ! command -v npm &> /dev/null; then
        log "ERROR" "npm 未安装"
        return 1
    fi
    
    # 检查SSH
    if ! command -v ssh &> /dev/null; then
        log "ERROR" "SSH 未安装"
        return 1
    fi
    
    # 检查SSH密钥
    if [ ! -f "$SSH_KEY" ]; then
        log "ERROR" "SSH密钥文件不存在: $SSH_KEY"
        return 1
    fi
    
    log "INFO" "本地环境检查通过"
    return 0
}

# 构建项目
build_project() {
    log "INFO" "构建项目..."
    
    cd "$PROJECT_PATH"
    
    # 安装依赖
    log "INFO" "安装依赖..."
    if npm install; then
        log "INFO" "依赖安装成功"
    else
        log "ERROR" "依赖安装失败"
        return 1
    fi
    
    # 构建项目
    log "INFO" "构建项目..."
    if npm run build; then
        log "INFO" "项目构建成功"
    else
        log "ERROR" "项目构建失败"
        return 1
    fi
    
    return 0
}

# 检查服务器环境
check_server_env() {
    log "INFO" "检查服务器环境..."
    
    # 建立SSH连接
    if ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" echo "Connection successful"; then
        log "INFO" "SSH连接成功"
    else
        log "ERROR" "SSH连接失败"
        return 1
    fi
    
    # 检查服务器软件
    ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" << 'EOF'
    # 检查Node.js
    if command -v node &> /dev/null; then
        echo "Node.js 已安装: $(node -v)"
    else
        echo "Node.js 未安装"
    fi
    
    # 检查Nginx
    if command -v nginx &> /dev/null; then
        echo "Nginx 已安装: $(nginx -v 2>&1)"
    else
        echo "Nginx 未安装"
    fi
    
    # 检查Certbot
    if command -v certbot &> /dev/null; then
        echo "Certbot 已安装: $(certbot --version 2>&1)"
    else
        echo "Certbot 未安装"
    fi
EOF
    
    log "INFO" "服务器环境检查完成"
    return 0
}

# 上传项目文件
upload_files() {
    log "INFO" "上传项目文件..."
    
    # 创建远程目录
    ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "mkdir -p agentpit"
    
    # 上传dist目录
    if scp -i "$SSH_KEY" -r "$PROJECT_PATH/dist" "$SERVER_USER@$SERVER_IP:~/agentpit/"; then
        log "INFO" "文件上传成功"
    else
        log "ERROR" "文件上传失败"
        return 1
    fi
    
    return 0
}

# 配置Nginx
configure_nginx() {
    log "INFO" "配置Nginx..."
    
    # 创建Nginx配置文件
    ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" sudo bash -c "cat > /etc/nginx/sites-available/$DOMAIN << 'EOF'
server {
    listen 80;
    server_name $DOMAIN;
    
    root /home/$SERVER_USER/agentpit/dist;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF"
    
    # 启用配置文件
    ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/"
    
    # 测试Nginx配置
    if ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "sudo nginx -t"; then
        log "INFO" "Nginx配置测试通过"
    else
        log "ERROR" "Nginx配置测试失败"
        return 1
    fi
    
    # 重启Nginx
    if ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "sudo systemctl restart nginx"; then
        log "INFO" "Nginx重启成功"
    else
        log "ERROR" "Nginx重启失败"
        return 1
    fi
    
    return 0
}

# 申请SSL证书
request_ssl() {
    log "INFO" "申请SSL证书..."
    
    # 尝试申请证书
    if ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@agentpit.io"; then
        log "INFO" "SSL证书申请成功"
        
        # 设置自动续期
        ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "sudo crontab -l | grep -q 'certbot renew' || echo '0 12 * * * /usr/bin/certbot renew --quiet' | sudo crontab -"
        log "INFO" "SSL证书自动续期已配置"
    else
        log "WARNING" "SSL证书申请失败，可能需要检查网络连接"
    fi
    
    return 0
}

# 验证部署
verify_deployment() {
    log "INFO" "验证部署..."
    
    # 检查Nginx状态
    if ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_IP" "sudo systemctl status nginx | grep 'active (running)'"; then
        log "INFO" "Nginx服务运行正常"
    else
        log "ERROR" "Nginx服务运行异常"
        return 1
    fi
    
    # 检查域名解析
    if nslookup "$DOMAIN" | grep "$SERVER_IP"; then
        log "INFO" "域名解析正确"
    else
        log "WARNING" "域名解析可能尚未生效"
    fi
    
    log "INFO" "部署验证完成"
    return 0
}

# 主函数
main() {
    log "INFO" "开始部署AgentPit..."
    
    # 检查本地环境
    if ! check_local_env; then
        log "ERROR" "本地环境检查失败，部署终止"
        return 1
    fi
    
    # 构建项目
    if ! build_project; then
        log "ERROR" "项目构建失败，部署终止"
        return 1
    fi
    
    # 检查服务器环境
    if ! check_server_env; then
        log "ERROR" "服务器环境检查失败，部署终止"
        return 1
    fi
    
    # 上传项目文件
    if ! upload_files; then
        log "ERROR" "文件上传失败，部署终止"
        return 1
    fi
    
    # 配置Nginx
    if ! configure_nginx; then
        log "ERROR" "Nginx配置失败，部署终止"
        return 1
    fi
    
    # 申请SSL证书
    request_ssl
    
    # 验证部署
    if ! verify_deployment; then
        log "WARNING" "部署验证失败，可能需要进一步检查"
    fi
    
    log "INFO" "AgentPit部署完成！"
    log "INFO" "网站地址: http://$DOMAIN"
    
    return 0
}

# 执行主函数
main

# 退出代码
exit $?
