#!/bin/bash

# ============================================
# AgentPit Vue3 应用部署脚本（增强版）
# 用于 Podman 容器化部署
#
# 功能：
#   - 部署 (deploy): 构建镜像并启动容器
#   - 回滚 (rollback): 恢复到上一版本
#   - 状态 (status): 显示容器运行状态
#   - 清理 (clean): 清理未使用的资源
#   - 备份: 自动备份当前镜像
#   - 日志记录: 记录所有操作到 logs/deploy.log
#   - 配置验证: 部署前检查必要文件
#
# 使用方式：
#   ./deploy.sh                  # 默认部署（生产环境）
#   ./deploy.sh rollback         # 回滚到上一版本
#   ./deploy.sh status           # 查看容器状态
#   ./deploy.sh clean            # 清理未使用资源
#   ./deploy.sh -p 3000          # 自定义端口
#   ./deploy.sh -e development   # 开发环境部署
#   ./deploy.sh -i myimage:v1    # 自定义镜像名
# ============================================

set -e  # 遇到错误立即退出

# ============================================
# 颜色定义
# ============================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # 无颜色

# ============================================
# 默认配置变量
# ============================================
IMAGE_NAME="agentpit-vue3:latest"
CONTAINER_NAME="agentpit-frontend"
PORT="8080"
ENVIRONMENT="production"
HEALTH_CHECK_URL="http://localhost:${PORT}/health"
MAX_WAIT_SECONDS=30
WAIT_INTERVAL=2
LOG_DIR="logs"
LOG_FILE="${LOG_DIR}/deploy.log"

# ============================================
# 命令行参数解析
# ============================================
show_help() {
    echo ""
    echo -e "${GREEN}AgentPit 部署脚本帮助${NC}"
    echo ""
    echo "用法: $0 [选项] [命令]"
    echo ""
    echo "命令:"
    echo "  (无)       执行完整部署流程"
    echo "  rollback   回滚到上一版本"
    echo "  status     显示容器运行状态"
    echo "  clean      清理未使用的资源"
    echo "  help       显示此帮助信息"
    echo ""
    echo "选项:"
    echo "  -p, --port PORT             自定义端口号（默认: 8080）"
    echo "  -i, --image IMAGE_NAME      自定义镜像名称（默认: agentpit-vue3:latest）"
    echo "  -e, --env ENVIRONMENT       选择环境 production/development（默认: production）"
    echo "  -h, --help                  显示帮助信息"
    echo ""
    echo "示例:"
    echo "  $0                          # 生产环境部署"
    echo "  $0 -e development           # 开发环境部署"
    echo "  $0 -p 3000 -i myapp:v1      # 自定义端口和镜像名"
    echo "  $0 rollback                 # 回滚到上一版本"
    echo "  $0 status                   # 查看状态"
    echo "  $0 clean                    # 清理资源"
    echo ""
}

parse_args() {
    COMMAND=""
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            -p|--port)
                PORT="$2"
                HEALTH_CHECK_URL="http://localhost:${PORT}/health"
                shift 2
                ;;
            -i|--image)
                IMAGE_NAME="$2"
                shift 2
                ;;
            -e|--env)
                ENVIRONMENT="$2"
                if [[ "$ENVIRONMENT" != "production" && "$ENVIRONMENT" != "development" ]]; then
                    log_error "无效的环境参数: ${ENVIRONMENT}（必须是 production 或 development）"
                    exit 1
                fi
                shift 2
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            rollback|status|clean|help)
                COMMAND="$1"
                shift
                ;;
            *)
                log_error "未知参数: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    if [[ -z "$COMMAND" ]]; then
        COMMAND="deploy"
    fi
}

# ============================================
# 日志函数（带颜色输出 + 文件记录）
# ============================================
log_to_file() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local log_entry="[${timestamp}] [${level}] ${message}"
    
    mkdir -p "${LOG_DIR}"
    echo "${log_entry}" >> "${LOG_FILE}"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
    log_to_file "INFO" "$1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
    log_to_file "SUCCESS" "$1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
    log_to_file "WARNING" "$1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    log_to_file "ERROR" "$1"
}

# 打印分隔线
print_separator() {
    echo "=================================================="
}

# ============================================
# 配置验证函数
# ============================================
validate_configuration() {
    print_separator
    log_info "验证配置文件..."
    print_separator
    
    local errors=0
    
    if [[ ! -f "Podmanfile" ]]; then
        log_error "缺少 Podmanfile 文件！"
        errors=$((errors + 1))
    else
        log_success "Podmanfile 存在"
    fi
    
    if [[ "$ENVIRONMENT" == "production" ]]; then
        if [[ ! -f ".env.production" ]]; then
            log_warning "生产环境文件 .env.production 不存在，将尝试使用 .env.production.example"
            if [[ ! -f ".env.production.example" ]]; then
                log_error "缺少 .env.production 和 .env.production.example 文件！"
                errors=$((errors + 1))
            else
                log_info "找到 .env.production.example，请复制为 .env.production 并配置"
            fi
        else
            log_success ".env.production 存在"
        fi
    else
        if [[ ! -f ".env.development" ]]; then
            log_error "开发环境文件 .env.development 不存在！"
            errors=$((errors + 1))
        else
            log_success ".env.development 存在"
        fi
    fi
    
    if [[ ! -f "podman-compose.yml" ]]; then
        log_error "缺少 podman-compose.yml 文件！"
        errors=$((errors + 1))
    else
        log_success "podman-compose.yml 存在"
    fi
    
    if [[ ! -f "nginx.conf" ]]; then
        log_warning "nginx.conf 不存在，可能影响生产环境部署"
    else
        log_success "nginx.conf 存在"
    fi
    
    if [[ $errors -gt 0 ]]; then
        log_error "配置验证失败，发现 ${errors} 个错误！请修复后重试。"
        exit 1
    fi
    
    log_success "配置验证通过"
}

# ============================================
# 工具检查函数
# ============================================
check_podman() {
    if ! command -v podman &> /dev/null; then
        log_error "Podman 未安装，请先安装 Podman"
        exit 1
    fi
    log_success "Podman 已安装: $(podman --version)"
}

check_podman_compose() {
    if ! command -v podman-compose &> /dev/null; then
        log_error "podman-compose 未安装，请先安装 podman-compose"
        exit 1
    fi
    log_success "podman-compose 已安装"
}

check_curl() {
    if ! command -v curl &> /dev/null; then
        log_warning "curl 未安装，健康检查功能将不可用"
        return 1
    fi
    return 0
}

# ============================================
# 备份机制
# ============================================
backup_current_image() {
    print_separator
    log_info "备份当前镜像..."
    print_separator
    
    local timestamp=$(date +%Y%m%d%H%M%S)
    local backup_image_name="${IMAGE_NAME}-backup-${timestamp}"
    
    if podman image exists "${IMAGE_NAME}"; then
        podman tag "${IMAGE_NAME}" "${backup_image_name}"
        
        if [ $? -eq 0 ]; then
            log_success "当前镜像已备份为: ${backup_image_name}"
            
            # 保存最新备份标签用于回滚
            echo "${backup_image_name}" > .last_backup_tag
            log_to_file "BACKUP" "已创建备份: ${backup_image_name}"
        else
            log_warning "镜像备份失败，继续部署..."
        fi
    else
        log_info "未找到现有镜像，跳过备份步骤"
    fi
}

# ============================================
# 镜像构建
# ============================================
build_image() {
    print_separator
    log_info "开始构建 Docker 镜像..."
    print_separator
    
    local build_start_time=$(date +%s)
    
    podman build -t ${IMAGE_NAME} .
    
    if [ $? -eq 0 ]; then
        local build_end_time=$(date +%s)
        local build_duration=$((build_end_time - build_start_time))
        log_success "镜像构建成功: ${IMAGE_NAME}（耗时: ${build_duration} 秒）"
        log_to_file "BUILD" "镜像构建成功: ${IMAGE_NAME}, 耗时: ${build_duration}s"
    else
        log_error "镜像构建失败！"
        log_to_file "BUILD" "镜像构建失败: ${IMAGE_NAME}"
        exit 1
    fi
}

# ============================================
# 容器管理
# ============================================
stop_old_container() {
    print_separator
    log_info "检查并停止旧容器..."
    print_separator
    
    if podman ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        log_warning "发现容器: ${CONTAINER_NAME}"
        
        local container_status=$(podman inspect -f '{{.State.Status}}' ${CONTAINER_NAME} 2>/dev/null || echo "unknown")
        log_info "容器状态: ${container_status}"
        
        podman stop ${CONTAINER_NAME} || true
        podman rm ${CONTAINER_NAME} || true
        
        log_success "旧容器已停止并移除"
        log_to_file "CONTAINER" "已停止并移除旧容器: ${CONTAINER_NAME}"
    else
        log_info "未发现运行中的旧容器"
    fi
}

start_container() {
    print_separator
    log_info "启动新容器..."
    print_separator
    
    podman-compose --profile ${ENVIRONMENT} up -d
    
    if [ $? -eq 0 ]; then
        log_success "容器启动命令已执行"
        log_to_file "CONTAINER" "容器启动成功, 环境: ${ENVIRONMENT}"
    else
        log_error "容器启动失败！"
        log_to_file "CONTAINER" "容器启动失败"
        exit 1
    fi
}

# ============================================
# 健康检查
# ============================================
wait_for_healthy() {
    print_separator
    log_info "等待应用启动并进行健康检查（最多 ${MAX_WAIT_SECONDS} 秒）..."
    print_separator
    
    if ! check_curl; then
        log_warning "curl 不可用，跳过健康检查"
        return 0
    fi
    
    elapsed=0

    while [ $elapsed -lt $MAX_WAIT_SECONDS ]; do
        if curl -sf ${HEALTH_CHECK_URL} > /dev/null 2>&1; then
            log_success "应用已成功启动并通过健康检查！"
            log_to_file "HEALTH" "健康检查通过: ${HEALTH_CHECK_URL}"
            return 0
        fi

        log_info "等待中... (${elapsed}/${MAX_WAIT_SECONDS} 秒)"
        sleep ${WAIT_INTERVAL}
        elapsed=$((elapsed + WAIT_INTERVAL))
    done

    log_error "健康检查超时（${MAX_WAIT_SECONDS} 秒）！"
    log_error "请检查容器日志：podman logs ${CONTAINER_NAME}"
    log_to_file "HEALTH" "健康检查超时 (${MAX_WAIT_SECONDS}s)"
    return 1
}

# ============================================
# 回滚功能
# ============================================
rollback_deployment() {
    print_separator
    echo -e "${YELLOW}              开始回滚操作              ${NC}"
    print_separator
    
    if [[ ! -f ".last_backup_tag" ]]; then
        log_error "未找到备份记录文件 (.last_backup_tag)，无法回滚！"
        log_error "请确保之前已经执行过部署操作"
        exit 1
    fi
    
    local backup_image=$(cat .last_backup_tag)
    
    if ! podman image exists "${backup_image}"; then
        log_error "备份镜像不存在: ${backup_image}"
        log_error "回滚失败！"
        exit 1
    fi
    
    log_info "准备回滚到备份镜像: ${backup_image}"
    log_warning "此操作将停止当前容器并使用备份镜像重启"
    
    read -p "确认要回滚吗？(y/N) " confirm
    if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
        log_info "回滚操作已取消"
        return 0
    fi
    
    local rollback_start_time=$(date +%s)
    
    stop_old_container
    
    log_info "恢复备份镜像..."
    podman tag "${backup_image}" "${IMAGE_NAME}"
    
    if [ $? -ne 0 ]; then
        log_error "镜像标签恢复失败！"
        exit 1
    fi
    
    start_container
    wait_for_healthy
    
    local rollback_end_time=$(date +%s)
    local rollback_duration=$((rollback_end_time - rollback_start_time))
    
    log_success "回滚完成！（耗时: ${rollback_duration} 秒）"
    log_to_file "ROLLBACK" "成功回滚到: ${backup_image}, 耗时: ${rollback_duration}s"
    
    show_status
}

# ============================================
# 状态显示
# ============================================
show_container_status() {
    print_separator
    echo -e "${CYAN}              容器运行状态              ${NC}"
    print_separator
    echo ""
    
    if ! podman ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        log_warning "容器 ${CONTAINER_NAME} 未找到"
        echo ""
        echo -e "${BLUE}提示:${NC}"
        echo "  使用 './deploy.sh' 进行首次部署"
        echo "  使用 './deploy.sh status' 查看状态"
        echo ""
        return 0
    fi
    
    local container_info=$(podman inspect ${CONTAINER_NAME} 2>/dev/null)
    
    if [[ -z "$container_info" ]]; then
        log_error "无法获取容器信息"
        return 1
    fi
    
    local status=$(echo "$container_info" | grep -o '"Status": "[^"]*"' | head -1 | cut -d'"' -f4)
    local image=$(echo "$container_info" | grep -o '"Image": "[^"]*"' | head -1 | cut -d'"' -f4)
    local created=$(echo "$container_info" | grep -o '"CreatedAt": "[^"]*"' | head -1 | cut -d'"' -f4 | cut -d'T' -f1-2 | cut -d'.' -f1)
    local restart_policy=$(echo "$container_info" | grep -o '"RestartPolicyName": "[^"]*"' | head -1 | cut -d'"' -f4)
    
    local port_mapping=$(podman port ${CONTAINER_NAME} 2>/dev/null || echo "N/A")
    
    echo -e "${GREEN}容器名称:${NC}   ${CONTAINER_NAME}"
    echo -e "${GREEN}运行状态:${NC}   ${status}"
    echo -e "${GREEN}镜像名称:${NC}   ${image:-N/A}"
    echo -e "${GREEN}端口映射:${NC}   ${port_mapping}"
    echo -e "${GREEN}创建时间:${NC}   ${created:-N/A}"
    echo -e "${GREEN}重启策略:${NC}   ${restart_policy:-N/A}"
    echo ""
    
    if [[ "$status" == "running" ]]; then
        echo -e "${GREEN}健康状态:${NC}   $(check_health_status)"
    fi
    
    echo ""
    echo -e "${BLUE}资源使用情况:${NC}"
    podman stats --no-stream ${CONTAINER_NAME} 2>/dev/null || log_warning "无法获取资源使用情况"
    echo ""
    
    log_to_file "STATUS" "查看容器状态: ${CONTAINER_NAME}, 状态: ${status}"
}

check_health_status() {
    if check_curl && curl -sf ${HEALTH_CHECK_URL} > /dev/null 2>&1; then
        echo -e "${GREEN}健康 ✓${NC}"
    else
        echo -e "${RED}不健康 ✗${NC}"
    fi
}

# ============================================
# 清理功能
# ============================================
clean_resources() {
    print_separator
    echo -e "${YELLOW}              清理未使用的资源              ${NC}"
    print_separator
    echo ""
    
    log_warning "此操作将清理以下资源："
    echo "  - 停止的容器"
    echo "  - 未使用的镜像（不包括正在使用的）"
    echo "  - 未使用的卷"
    echo "  - 未使用的网络"
    echo ""
    
    read -p "确认要清理吗？(y/N) " confirm
    if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
        log_info "清理操作已取消"
        return 0
    fi
    
    local cleaned_containers=0
    local cleaned_images=0
    local cleaned_volumes=0
    local cleaned_networks=0
    
    echo ""
    log_info "清理停止的容器..."
    stopped_containers=$(podman ps -aq -f status=exited -f status=created 2>/dev/null)
    if [[ -n "$stopped_containers" ]]; then
        echo "$stopped_containers" | while read cid; do
            podman rm "$cid" >/dev/null 2>&1 && ((cleaned_containers++)) || true
        done
        log_success "已清理 ${cleaned_containers} 个停止的容器"
    else
        log_info "没有需要清理的停止容器"
    fi
    
    echo ""
    log_info "清理未使用的镜像（dangling images）..."
    dangling_images=$(podman images -f "dangling=true" -q 2>/dev/null)
    if [[ -n "$dangling_images" ]]; then
        echo "$dangling_images" | while read iid; do
            podman rmi "$iid" >/dev/null 2>&1 && ((cleaned_images++)) || true
        done
        log_success "已清理 ${cleaned_images} 个未使用的镜像"
    else
        log_info "没有需要清理的未使用镜像"
    fi
    
    echo ""
    log_info "清理未使用的卷..."
    unused_volumes=$(podman volume ls -q -f dangling=true 2>/dev/null)
    if [[ -n "$unused_volumes" ]]; then
        echo "$unused_volumes" | while read vid; do
            podman volume rm "$vid" >/dev/null 2>&1 && ((cleaned_volumes++)) || true
        done
        log_success "已清理 ${cleaned_volumes} 个未使用的卷"
    else
        log_info "没有需要清理的未使用卷"
    fi
    
    echo ""
    log_info "清理未使用的网络..."
    unused_networks=$(podman network ls -q -f "driver!=bridge" -f "driver!=host" -f "driver!=none" 2>/dev/null | head -10)
    if [[ -n "$unused_networks" ]]; then
        for nid in $unused_networks; do
            podman network rm "$nid" >/dev/null 2>&1 && ((cleaned_networks++)) || true
        done
        log_success "已清理 ${cleaned_networks} 个未使用的网络"
    else
        log_info "没有需要清理的未使用网络"
    fi
    
    echo ""
    log_success "资源清理完成！"
    log_to_file "CLEAN" "资源清理完成: 容器=${cleaned_containers}, 镜像=${cleaned_images}, 卷=${cleaned_volumes}, 网络=${cleaned_networks}"
}

# ============================================
# 部署状态显示
# ============================================
show_status() {
    print_separator
    echo -e "${GREEN}              部署完成！              ${NC}"
    print_separator
    echo ""
    echo -e "${BLUE}访问地址:${NC} http://localhost:${PORT}"
    echo -e "${BLUE}健康检查:${NC} ${HEALTH_CHECK_URL}"
    echo -e "${BLUE}环境类型:${NC} ${ENVIRONMENT}"
    echo -e "${BLUE}镜像名称:${NC} ${IMAGE_NAME}"
    echo ""
    echo -e "${BLUE}常用命令:${NC}"
    echo "  查看日志：   podman logs -f ${CONTAINER_NAME}"
    echo "  查看状态：   ./deploy.sh status"
    echo "  停止服务：   ./deploy.sh down 或 podman-compose --profile ${ENVIRONMENT} down"
    echo "  重启服务：   ./deploy.sh restart 或 podman-compose --profile ${ENVIRONMENT} restart"
    echo "  回滚版本：   ./deploy.sh rollback"
    echo "  清理资源：   ./deploy.sh clean"
    echo ""
    print_separator
}

# ============================================
# 主部署流程
# ============================================
deploy() {
    local deploy_start_time=$(date +%s)
    
    echo ""
    echo -e "${GREEN}============================================${NC}"
    echo -e "${GREEN}     AgentPit Vue3 应用自动部署脚本       ${NC}"
    echo -e "${GREEN}============================================${NC}"
    echo ""
    echo -e "${BLUE}部署配置:${NC}"
    echo "  环境:       ${ENVIRONMENT}"
    echo "  端口:       ${PORT}"
    echo "  镜像:       ${IMAGE_NAME}"
    echo "  容器名:     ${CONTAINER_NAME}"
    echo ""
    
    log_to_file "DEPLOY" "========== 开始部署 =========="
    log_to_file "DEPLOY" "环境: ${ENVIRONMENT}, 端口: ${PORT}, 镜像: ${IMAGE_NAME}"
    
    validate_configuration
    check_podman
    check_podman_compose
    backup_current_image
    build_image
    stop_old_container
    start_container
    wait_for_healthy
    
    local deploy_end_time=$(date +%s)
    local deploy_duration=$((deploy_end_time - deploy_start_time))
    
    log_to_file "DEPLOY" "========== 部署完成 =========="
    log_to_file "DEPLOY" "总耗时: ${deploy_duration}s"
    
    show_status
    
    echo -e "${GREEN}${NC}"
    echo -e "${GREEN}部署成功完成！（总耗时: ${deploy_duration} 秒）${NC}"
    echo ""
}

# ============================================
# 主入口函数
# ============================================
main() {
    parse_args "$@"
    
    case "$COMMAND" in
        deploy)
            deploy
            ;;
        rollback)
            rollback_deployment
            ;;
        status)
            show_container_status
            ;;
        clean)
            clean_resources
            ;;
        help)
            show_help
            ;;
        *)
            log_error "未知命令: ${COMMAND}"
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"
