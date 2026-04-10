#!/bin/bash

# ============================================
# AgentPit Vue3 应用部署脚本
# 用于 Podman 容器化部署
# ============================================

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # 无颜色

# 配置变量
IMAGE_NAME="agentpit-vue3:latest"
CONTAINER_NAME="agentpit-frontend"
PORT="8080"
HEALTH_CHECK_URL="http://localhost:${PORT}/health"
MAX_WAIT_SECONDS=30
WAIT_INTERVAL=2

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 打印分隔线
print_separator() {
    echo "=================================================="
}

# 检查 Podman 是否安装
check_podman() {
    if ! command -v podman &> /dev/null; then
        log_error "Podman 未安装，请先安装 Podman"
        exit 1
    fi
    log_success "Podman 已安装: $(podman --version)"
}

# 检查 podman-compose 是否安装
check_podman_compose() {
    if ! command -v podman-compose &> /dev/null; then
        log_error "podman-compose 未安装，请先安装 podman-compose"
        exit 1
    fi
    log_success "podman-compose 已安装"
}

# 构建镜像
build_image() {
    print_separator
    log_info "开始构建 Docker 镜像..."
    print_separator

    podman build -t ${IMAGE_NAME} .

    if [ $? -eq 0 ]; then
        log_success "镜像构建成功: ${IMAGE_NAME}"
    else
        log_error "镜像构建失败！"
        exit 1
    fi
}

# 停止并移除旧容器
stop_old_container() {
    print_separator
    log_info "检查并停止旧容器..."
    print_separator

    # 检查容器是否存在
    if podman ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        log_warning "发现运行中的容器: ${CONTAINER_NAME}"

        # 尝试优雅停止
        podman stop ${CONTAINER_NAME} || true
        podman rm ${CONTAINER_NAME} || true

        log_success "旧容器已停止并移除"
    else
        log_info "未发现运行中的旧容器"
    fi
}

# 启动新容器
start_container() {
    print_separator
    log_info "启动新容器..."
    print_separator

    # 使用 podman-compose 启动服务
    podman-compose up -d

    if [ $? -eq 0 ]; then
        log_success "容器启动命令已执行"
    else
        log_error "容器启动失败！"
        exit 1
    fi
}

# 等待健康检查通过
wait_for_healthy() {
    print_separator
    log_info "等待应用启动并进行健康检查（最多 ${MAX_WAIT_SECONDS} 秒）..."
    print_separator

    elapsed=0

    while [ $elapsed -lt $MAX_WAIT_SECONDS ]; do
        # 使用 curl 检查健康端点
        if curl -sf ${HEALTH_CHECK_URL} > /dev/null 2>&1; then
            log_success "应用已成功启动并通过健康检查！"
            return 0
        fi

        log_info "等待中... (${elapsed}/${MAX_WAIT_SECONDS} 秒)"
        sleep ${WAIT_INTERVAL}
        elapsed=$((elapsed + WAIT_INTERVAL))
    done

    log_error "健康检查超时（${MAX_WAIT_SECONDS} 秒）！"
    log_error "请检查容器日志：podman logs ${CONTAINER_NAME}"
    return 1
}

# 显示部署状态
show_status() {
    print_separator
    echo -e "${GREEN}              部署完成！              ${NC}"
    print_separator
    echo ""
    echo -e "${BLUE}访问地址:${NC} http://localhost:${PORT}"
    echo -e "${BLUE}健康检查:${NC} ${HEALTH_CHECK_URL}"
    echo ""
    echo -e "${BLUE}常用命令:${NC}"
    echo "  查看日志：   podman logs -f ${CONTAINER_NAME}"
    echo "  查看状态：   podman ps | grep ${CONTAINER_NAME}"
    echo "  停止服务：   podman-compose down"
    echo "  重启服务：   podman-compose restart"
    echo ""
    print_separator
}

# 主函数
main() {
    echo ""
    echo -e "${GREEN}============================================${NC}"
    echo -e "${GREEN}     AgentPit Vue3 应用自动部署脚本       ${NC}"
    echo -e "${GREEN}============================================${NC}"
    echo ""

    # 执行部署流程
    check_podman
    check_podman_compose
    build_image
    stop_old_container
    start_container
    wait_for_healthy
    show_status

    echo -e "${GREEN}${NC}"
    echo -e "${GREEN}部署成功完成！${NC}"
    echo ""
}

# 执行主函数
main "$@"