# 部署任务调试过程数据收集

## 时间线与关键事件

### 阶段1：部署准备
- **时间**：2026-04-11 开始
- **事件**：准备部署到远程服务器 `a1@34.126.124.215`
- **目标**：部署静态网站到 `https://pagent.agentpit.io`

### 阶段2：初始部署
- **时间**：2026-04-11 早期
- **事件**：完成部署脚本执行，服务启动
- **问题**：服务显示"服务不可用"

### 阶段3：调试开始
- **时间**：2026-04-11 中期
- **事件**：开始系统性排查
- **工具**：Nginx错误日志、netstat、SSH配置检查

### 阶段4：问题识别
- **时间**：2026-04-11 中期
- **事件**：发现多个关键问题
- **问题1**：SSH占用443端口
- **问题2**：目录权限错误

### 阶段5：问题解决
- **时间**：2026-04-11 后期
- **事件**：依次解决各个问题
- **结果**：服务恢复正常

## 详细问题与解决方案

### 问题1：SSH占用443端口
- **症状**：Nginx无法绑定到443端口
- **错误信息**：`bind() to 0.0.0.0:443 failed (98: Address already in use)`
- **原因**：`/etc/ssh/sshd_config` 同时配置了 `Port 22` 和 `Port 443`
- **解决方案**：从sshd_config中移除`Port 443`配置
- **验证**：`sudo netstat -tulpn | grep :443` 显示Nginx占用

### 问题2：目录权限错误
- **症状**：Nginx返回500错误
- **错误信息**：`stat() "/var/www/daoapps/current/index.html" failed (13: Permission denied)`
- **原因**：`/var/www/daoapps/` 目录权限为 `drwxr-x---` (750)，www-data用户无法访问
- **解决方案**：修复目录权限为755
- **验证**：`sudo -u www-data stat /var/www/daoapps/current/index.html` 成功

### 问题3：Nginx配置优化
- **症状**：HTTPS配置需要优化
- **解决方案**：简化Nginx配置，确保正确的root路径和SSL设置
- **验证**：`sudo nginx -t` 配置测试通过

## 关键调试命令

### 端口占用检查
```bash
sudo netstat -tulpn | grep :443
sudo netstat -tulpn | grep -E ":443|:80"
```

### 服务状态检查
```bash
sudo systemctl status nginx daoapps
sudo systemctl restart sshd
sudo systemctl restart nginx
```

### 权限检查
```bash
sudo ls -la /var/www/daoapps/
sudo stat -c "%a %U:%G" /var/www/daoapps/current/index.html
sudo -u www-data stat /var/www/daoapps/current/index.html
```

### 日志分析
```bash
sudo tail -50 /var/log/nginx/error.log
sudo tail -20 /var/log/nginx/access.log
sudo journalctl -u nginx -n 30 --no-pager
```

### 配置检查
```bash
sudo nginx -t
sudo cat /etc/nginx/sites-enabled/daoapps.conf
sudo cat /etc/ssh/sshd_config | grep -A5 -B5 Port
```

### 测试命令
```bash
curl -L -I -k https://pagent.agentpit.io/
curl -L -I http://127.0.0.1/ -H "Host: pagent.agentpit.io"
```

## 权限修复命令
```bash
# 修复顶层目录权限
sudo chmod 755 /var/www/daoapps/
sudo chmod 755 /var/www/daoapps/releases/

# 修复所有内容权限和所有者
sudo chmod -R 755 /var/www/daoapps/releases/
sudo chown -R www-data:www-data /var/www/daoapps/releases/
```

## SSH配置修复
```bash
# 从sshd_config中移除Port 443配置
sudo sed -i "s/Port 443//g" /etc/ssh/sshd_config

# 重启SSH服务
sudo systemctl restart sshd
```

## 验证结果
- **最终状态**：HTTPS服务正常运行，返回200 OK
- **访问地址**：https://pagent.agentpit.io
- **服务状态**：Nginx active (running)
- **权限状态**：www-data用户可正常访问所有文件