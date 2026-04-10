# ============================================
# Flexloop Vue3 应用 Makefile
# 提供统一的命令入口，简化开发和部署流程
#
# 使用方式：
#   make help          # 显示所有可用命令
#   make deploy        # 执行完整部署
#   make build         # 仅构建镜像
#   make up            # 启动容器
#   make down          # 停止容器
#   make status        # 查看容器状态
#   make rollback      # 回滚到上一版本
#   make clean         # 清理未使用资源
#   make logs          # 查看实时日志
#   make test          # 运行测试
#
# 环境变量（可通过命令行覆盖）：
#   IMAGE_NAME=xxx     自定义镜像名称
#   PORT=xxx           自定义端口号
#   PROFILE=xxx        选择环境 (production/development)
# ============================================

.PHONY: build up down restart logs deploy rollback status clean test help

# ============================================
# 变量定义（可通过环境变量或命令行参数覆盖）
# ============================================
IMAGE_NAME ?= agentpit-vue3:latest
CONTAINER_NAME ?= agentpit-frontend
PORT ?= 8080
PROFILE ?= production

# ============================================
# 颜色定义（用于美化输出）
# ============================================
GREEN := \033[0;32m
BLUE := \033[0;34m
YELLOW := \033[1;33m
NC := \033[0m

# ============================================
# 构建相关命令
# ============================================

## build: 构建 Docker/Podman 镜像
build:
	@echo "$(GREEN)============================================$(NC)"
	@echo "$(GREEN)  开始构建镜像: $(IMAGE_NAME)$(NC)"
	@echo "$(GREEN)============================================$(NC)"
	podman build -t $(IMAGE_NAME) .
	@echo ""
	@echo "$(BLUE)构建完成！$(NC)"
	@echo "镜像: $(IMAGE_NAME)"

## up: 启动容器服务
up:
	@echo "$(GREEN)============================================$(NC)"
	@echo "$(GREEN)  启动容器 (环境: $(PROFILE))$(NC)"
	@echo "$(GREEN)============================================$(NC)"
	podman-compose --profile $(PROFILE) up -d
	@echo ""
	@echo "$(BLUE)容器已启动！$(NC)"
	@echo "访问地址: http://localhost:$(PORT)"

## down: 停止并移除容器
down:
	@echo "$(YELLOW)============================================$(NC)"
	@echo "$(YELLOW)  停止并移除容器 (环境: $(PROFILE))$(NC)"
	@echo "$(YELLOW)============================================$(NC)"
	podman-compose --profile $(PROFILE) down
	@echo ""
	@echo "$(BLUE)容器已停止！$(NC)"

## restart: 重启所有服务
restart:
	@echo "$(GREEN)============================================$(NC)"
	@echo "$(GREEN)  重启服务 (环境: $(PROFILE))$(NC)"
	@echo "$(GREEN)============================================$(NC)"
	podman-compose --profile $(PROFILE) restart
	@echo ""
	@echo "$(BLUE)服务已重启！$(NC)"

## logs: 查看实时日志（按 Ctrl+C 退出）
logs:
	@echo "$(BLUE)============================================$(NC)"
	@echo "$(BLUE)  实时日志输出 (环境: $(PROFILE))$(NC)"
	@echo "$(BLUE)============================================$(NC)"
	podman-compose --profile $(PROFILE) logs -f

# ============================================
# 部署相关命令
# ============================================

## deploy: 执行完整部署流程（验证 -> 备份 -> 构建 -> 启动 -> 健康检查）
deploy:
	@echo "$(GREEN)============================================$(NC)"
	@echo "$(GREEN)  执行完整部署流程$(NC)"
	@echo "$(GREEN)============================================$(NC)"
	@echo ""
	./deploy.sh -p $(PORT) -i $(IMAGE_NAME) -e $(PROFILE)

## rollback: 回滚到上一版本
rollback:
	@echo "$(YELLOW)============================================$(NC)"
	@echo "$(YELLOW)  执行回滚操作$(NC)"
	@echo "$(YELLOW)============================================$(NC)"
	@echo ""
	./deploy.sh rollback

## status: 显示容器运行状态
status:
	@echo "$(BLUE)============================================$(NC)"
	@echo "$(BLUE)  查看容器运行状态$(NC)"
	@echo "$(BLUE)============================================$(NC)"
	@echo ""
	./deploy.sh status

## clean: 清理未使用的资源（停止的容器、悬空镜像、未使用的卷和网络）
clean:
	@echo "$(YELLOW)============================================$(NC)"
	@echo "$(YELLOW)  清理未使用的资源$(NC)"
	@echo "$(YELLOW)============================================$(NC)"
	@echo ""
	./deploy.sh clean

# ============================================
# 测试和开发命令
# ============================================

## test: 运行测试套件
test:
	@echo "$(GREEN)============================================$(NC)"
	@echo "$(GREEN)  运行测试套件$(NC)"
	@echo "$(GREEN)============================================$(NC)"
	@if [ -f "./test-deployment.sh" ]; then \
		./test-deployment.sh; \
	else \
		echo "$(YELLOW)test-deployment.sh 不存在，跳过测试$(NC)"; \
	fi

## dev: 启动开发环境（热重载）
dev:
	@echo "$(GREEN)============================================$(NC)"
	@echo "$(GREEN)  启动开发环境 (Vite 热重载)$(NC)"
	@echo "$(GREEN)============================================$(NC)"
	podman-compose --profile development up agentpit-dev

## prod: 启动生产环境
prod:
	@echo "$(GREEN)============================================$(NC)"
	@echo "$(GREEN)  启动生产环境 (Nginx 服务)$(NC)"
	@echo "$(GREEN)============================================$(NC)"
	podman-compose --profile production up -d

# ============================================
# 辅助命令
# ============================================

## shell: 进入正在运行的容器 Shell
shell:
	@echo "$(BLUE)进入容器 Shell...$(NC)"
	podman exec -it $(CONTAINER_NAME) /bin/sh || podman exec -it $(CONTAINER_NAME) /bin/bash

## ps: 查看所有容器状态
ps:
	@echo "$(BLUE)============================================$(NC)"
	@echo "$(BLUE)  所有容器列表$(NC)"
	@echo "$(BLUE)============================================$(NC)"
	podman ps -a

## images: 查看本地镜像列表
images:
	@echo "$(BLUE)============================================$(NC)"
	@echo "$(BLUE)  本地镜像列表$(NC)"
	@echo "$(BLUE)============================================$(NC)"
	podman images

## prune: 深度清理（慎用）
prune:
	@echo "$(YELLOW)============================================$(NC)"
	@echo "$(YELLOW)  深度清理警告！此操作将删除：$(NC)"
	@echo "$(YELLOW)  - 停止的容器$(NC)"
	@echo "$(YELLOW)  - 未使用的镜像$(NC)"
	@echo "$(YELLOW)  - 未使用的卷$(NC)"
	@echo "$(YELLOW)  - 未使用的网络$(NC)"
	@echo "$(YELLOW)  - 构建缓存$(NC)"
	@echo "$(YELLOW)============================================$(NC)"
	@read -p "确认要执行深度清理吗？(y/N) " confirm && [ "$$confirm" = "y" ] && podman system prune -a --volumes || echo "已取消"

## backup: 手动备份当前镜像
backup:
	@echo "$(GREEN)============================================$(NC)"
	@echo "$(GREEN)  手动备份当前镜像$(NC)"
	@echo "$(GREEN)============================================$(NC)"
	@if podman image exists $(IMAGE_NAME); then \
		timestamp=$$(date +%Y%m%d%H%M%S); \
		backup_name="$(IMAGE_NAME)-manual-backup-$${timestamp}"; \
		podman tag $(IMAGE_NAME) $${backup_name}; \
		echo "$(GREEN)备份成功: $${backup_name}$(NC)"; \
	else \
		echo "$(YELLOW)镜像 $(IMAGE_NAME) 不存在，无法备份$(NC)"; \
	fi

## check: 检查环境和配置
check:
	@echo "$(BLUE)============================================$(NC)"
	@echo "$(BLUE)  环境检查$(NC)"
	@echo "$(BLUE)============================================$(NC)"
	@echo ""
	@echo "Podman 版本:"
	@podman --version || echo "$(RED)未安装$(NC)"
	@echo ""
	@echo "podman-compose 版本:"
	@podman-compose version || echo "$(RED)未安装$(NC)"
	@echo ""
	@echo "配置文件检查:"
	@test -f Podmanfile && echo "  ✓ Podmanfile" || echo "  ✗ Podmanfile 缺失"
	@test -f podman-compose.yml && echo "  ✓ podman-compose.yml" || echo "  ✗ podman-compose.yml 缺失"
	@test -f .env.$(PROFILE) && echo "  ✓ .env.$(PROFILE)" || echo "  ✗ .env.$(PROFILE) 缺失"
	@test -f nginx.conf && echo "  ✓ nginx.conf" || echo "  ⚠ nginx.conf 缺失"

# ============================================
# 帮助信息
# ============================================

## help: 显示帮助信息
help:
	@echo ""
	@echo "$(GREEN)============================================$(NC)"
	@echo "$(GREEN)  Flexloop 部署工具 - 帮助信息$(NC)"
	@echo "$(GREEN)============================================$(NC)"
	@echo ""
	@echo "$(BLUE)用法: make [目标] [变量=值]$(NC)"
	@echo ""
	@echo "$(YELLOW)常用目标:$(NC)"
	@grep -E '^## ' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ": "}; {printf "  %-15s %s\n", $$1, $$2}' | \
		sed 's/## //'
	@echo ""
	@echo "$(YELLOW)示例:$(NC)"
	@echo "  make deploy                          # 生产环境部署（默认端口 8080）"
	@echo "  make PROFILE=development deploy       # 开发环境部署"
	@echo "  make PORT=3000 IMAGE_NAME=myapp:v1 deploy  # 自定义配置部署"
	@echo "  make build                            # 仅构建镜像"
	@echo "  make up                               # 启动容器"
	@echo "  make down                             # 停止容器"
	@echo "  make logs                             # 查看实时日志"
	@echo "  make status                           # 查看容器状态"
	@echo "  make rollback                         # 回滚到上一版本"
	@echo "  make clean                            # 清理资源"
	@echo "  make test                             # 运行测试"
	@echo "  make dev                              # 启动开发环境"
	@echo "  make prod                             # 启动生产环境"
	@echo "  make help                             # 显示此帮助"
	@echo ""
	@echo "$(YELLOW)可用的环境变量:$(NC)"
	@echo "  IMAGE_NAME    镜像名称（默认: agentpit-vue3:latest）"
	@echo "  PORT          端口号（默认: 8080）"
	@echo "  PROFILE       环境 profile（默认: production）"
	@echo ""

# 默认目标：显示帮助
.DEFAULT_GOAL := help
