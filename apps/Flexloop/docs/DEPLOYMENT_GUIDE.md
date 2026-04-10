# Flexloop 部署指南

## 1. 环境配置

### 服务器环境
- **操作系统**：Debian 12 (bookworm)
- **IP地址**：34.126.124.215
- **域名**：pagent.flexloop.tech
- **已安装软件**：
  - Node.js 20.20.2
  - npm 10.8.2
  - Git 2.39.5
  - Nginx 1.22.1
  - Certbot 2.1.0

### 本地环境
- **操作系统**：Windows
- **SSH密钥**：`C:\Users\xinzo\.ssh\id_rsa_google_longterm`

## 2. 部署步骤

### 2.1 建立SSH连接
```bash
ssh -i "C:\Users\xinzo\.ssh\id_rsa_google_longterm" a1@34.126.124.215
```

### 2.2 本地构建项目
```bash
# 在项目根目录执行
npm install
npm run build
```

### 2.3 上传项目文件
```bash
# 上传构建好的dist目录
scp -i "C:\Users\xinzo\.ssh\id_rsa_google_longterm" -r dist a1@34.126.124.215:~/flexloop/
```

### 2.4 配置Nginx
```bash
# 创建Nginx配置文件
sudo bash -c "cat > /etc/nginx/sites-available/pagent.flexloop.tech <<EOF
server {
    listen 80;
    server_name pagent.flexloop.tech;
    
    root /home/a1/flexloop/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF"

# 启用配置文件
sudo ln -sf /etc/nginx/sites-available/pagent.flexloop.tech /etc/nginx/sites-enabled/

# 测试Nginx配置
sudo nginx -t

# 重启Nginx服务
sudo systemctl restart nginx
```

### 2.5 配置域名解析
- **A记录**：pagent.flexloop.tech → 34.126.124.215
- **TTL**：3600秒

### 2.6 实现SSL证书
```bash
# 申请Let's Encrypt证书
sudo certbot --nginx -d pagent.flexloop.tech --non-interactive --agree-tos --email admin@flexloop.tech

# 设置自动续期
sudo crontab -l | grep -q 'certbot renew' || echo '0 12 * * * /usr/bin/certbot renew --quiet' | sudo crontab -
```

## 3. 测试结果

### 3.1 域名解析测试
```bash
nslookup pagent.flexloop.tech
# 输出：
# Name:    pagent.flexloop.tech
# Address:  34.126.124.215
```

### 3.2 服务状态测试
```bash
# 检查Nginx状态
sudo systemctl status nginx

# 检查端口监听
sudo netstat -tulpn | grep :80
```

### 3.3 网站访问测试
```bash
# 服务器本地访问
curl -s -L http://localhost

# 外部访问
curl -s -L http://pagent.flexloop.tech
```

## 4. 遇到的问题及解决方案

### 4.1 SSH密钥路径问题
- **问题**：SSH密钥路径配置错误
- **解决方案**：使用绝对路径指定SSH密钥位置

### 4.2 Nginx端口占用
- **问题**：端口80被占用，导致Nginx无法启动
- **解决方案**：使用`fuser -k 80/tcp`停止占用端口的进程

### 4.3 Nginx配置冲突
- **问题**：多个Nginx配置文件使用相同的server_name
- **解决方案**：删除冲突的配置文件，只保留一个配置

### 4.4 网络连接问题
- **问题**：服务器无法连接到Let's Encrypt API
- **解决方案**：检查网络连接和防火墙设置

## 5. 注意事项

1. **SSH密钥安全**：确保SSH密钥文件权限正确（600）
2. **Nginx配置**：确保配置文件语法正确，使用`nginx -t`测试
3. **域名解析**：DNS propagation可能需要时间，耐心等待
4. **SSL证书**：定期检查证书状态，确保自动续期正常工作
5. **服务器安全**：定期更新系统和软件，设置防火墙规则
6. **备份**：定期备份项目文件和配置

## 6. 自动化部署

### 6.1 部署脚本
项目根目录提供了`deploy.sh`脚本，可用于自动化部署：

```bash
# 执行部署脚本
bash deploy.sh
```

### 6.2 自动化技能
在`skills`目录中创建了自动化部署技能，支持一键部署。

## 7. 技术支持

- **邮箱**：admin@flexloop.tech
- **GitHub**：https://github.com/daoApps/daoApps

---

*最后更新时间：2026-04-10*