#!/bin/bash
# Flexloop 容器初始化工具
#
# 用途：在首次部署或环境重置时，初始化必要的目录结构和配置
#
# 用法：
#   ./init-container.sh                  # 初始化生产环境
#   ./init-container.sh --dev            # 初始化开发环境
#   ./init-container.sh --clean          # 清理后重新初始化
#   ./init-container.sh --check-only     # 仅检查不修改
#
# 作者：Flexloop 团队
# 版本：1.0.0
# 日期：2026-04-10

set -e

# ==================== 颜色定义 ====================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ==================== 全局变量 ====================
DEV_MODE=false
CLEAN_MODE=false
CHECK_ONLY=false
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 统计计数器
SUCCESS_COUNT=0
WARNING_COUNT=0
FAILURE_COUNT=0

# ==================== 辅助函数 ====================

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
    ((SUCCESS_COUNT++))
}

print_failure() {
    echo -e "${RED}✗ $1${NC}"
    ((FAILURE_COUNT++))
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
    ((WARNING_COUNT++))
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_header() {
    echo ""
    echo -e "${CYAN}=========================================${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}=========================================${NC}"
}

show_help() {
    cat << EOF
Flexloop 容器初始化工具 v1.0.0

用法: $0 [选项]

选项:
  --dev             初始化开发环境（额外检查 Node.js/npm）
  --clean           清理后重新初始化（停止容器、删除日志等）
  --check-only      仅执行检查，不进行任何修改
  -h, --help        显示此帮助信息

功能说明:
  - 创建必要的目录结构 (logs/)
  - 初始化日志文件
  - 验证配置文件存在性
  - 检测运行环境和依赖
  - 检查网络和端口状态
  - 提供清理功能

退出码:
  0  所有检查通过（可能有警告）
  1  存在失败项

示例:
  $0                          # 标准初始化
  $0 --dev                    # 开发环境初始化
  $0 --clean                  # 清理并重新初始化
  $0 --check-only             # 仅检查环境状态

EOF
}

show_progress() {
    local current=$1
    local total=$2
    local message=$3
    printf "\r[%3d%%] %s" $((current * 100 / total)) "$message"
}

# ==================== 环境检测函数 ====================

detect_os() {
    print_info "检测操作系统..."

    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if [ -f /etc/os-release ]; then
            . /etc/os-release
            print_success "操作系统: Linux (${NAME} ${VERSION})"
        else
            print_success "操作系统: Linux"
        fi
        return 0
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        print_success "操作系统: macOS $(sw_vers -productVersion 2>/dev/null || echo '')"
        return 0
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        print_warning "操作系统: Windows (MSYS/Cygwin)"
        print_info "建议在 WSL2 环境中运行以获得最佳兼容性"
        return 0
    else
        print_warning "未知操作系统: $OSTYPE"
        return 0
    fi
}

check_podman() {
    print_info "检查 Podman 安装..."

    if command -v podman &> /dev/null; then
        local version
        version=$(podman --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
        if [ -n "$version" ]; then
            print_success "Podman 已安装: v${version}"

            if command -v podman-compose &> /dev/null; then
                local compose_version
                compose_version=$(podman-compose --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+' | head -1)
                print_success "podman-compose 已安装: v${compose_version}"
            else
                print_warning "未找到 podman-compose，建议安装以支持多容器编排"
                print_info "安装命令: pip install podman-compose 或 brew install podman-compose"
            fi
        else
            print_warning "Podman 已安装但无法获取版本信息"
        fi
        return 0
    else
        print_failure "未找到 Podman"
        print_info "请访问 https://podman.io/docs/installation 安装 Podman"
        return 1
    fi
}

check_nodejs() {
    if [ "$DEV_MODE" = true ]; then
        print_info "检查 Node.js 环境..."

        if command -v node &> /dev/null; then
            local node_version
            node_version=$(node --version 2>/dev/null)
            print_success "Node.js 已安装: ${node_version}"

            if command -v npm &> /dev/null; then
                local npm_version
                npm_version=$(npm --version 2>/dev/null)
                print_success "npm 已安装: v${npm_version}"
            else
                print_warning "未找到 npm"
            fi
        else
            print_failure "未找到 Node.js（开发环境必需）"
            print_info "请访问 https://nodejs.org/ 下载安装"
            return 1
        fi
    else
        print_info "跳过 Node.js 检查（非开发模式）"
    fi
    return 0
}

check_disk_space() {
    print_info "检查磁盘空间..."

    local available_space
    if [[ "$OSTYPE" == "darwin"* ]]; then
        available_space=$(df -k . | tail -1 | awk '{print $4}')
        available_space_gb=$((available_space / 1024 / 1024))
    else
        available_space=$(df -BG . | tail -1 | awk '{print $4}' | tr -d 'G')
        available_space_gb="${available_space:-0}"
    fi

    if [ "$available_space_gb" -ge 2 ] 2>/dev/null; then
        print_success "可用磁盘空间: ${available_space_gb}GB ✓"
        return 0
    else
        print_warning "可用磁盘空间不足: ${available_space_gb}GB（建议至少 2GB）"
        return 1
    fi
}

# ==================== 配置验证函数 ====================

validate_config_files() {
    print_header "配置文件验证"

    local config_files=(
        ".env:.env 文件（环境变量配置）"
        "Podmanfile:Podmanfile（容器构建文件）"
        "podman-compose.yml:podman-compose.yml（容器编排配置）"
    )

    for config in "${config_files[@]}"; do
        local file="${config%%:*}"
        local description="${config##*:}"

        if [ -f "${SCRIPT_DIR}/${file}" ]; then
            print_success "${description}: 存在"
        else
            print_warning "${description}: 缺失"
            case "$file" in
                .env)
                    print_info "提示: 复制 .env.example 为 .env 并填写配置"
                    ;;
                Podmanfile)
                    print_info "错误: Podmanfile 是必需的容器构建文件"
                    ;;
                podman-compose.yml)
                    print_info "提示: 如需多容器编排请创建此文件"
                    ;;
            esac
        fi
    done
}

# ==================== 目录和文件操作函数 ====================

create_directory_structure() {
    print_header "目录结构初始化"

    if [ "$CHECK_ONLY" = true ]; then
        print_info "检查模式：仅验证不修改"
    fi

    create_directory "logs" "日志目录"
}

create_directory() {
    local dir="$1"
    local description="$2"
    local full_path="${SCRIPT_DIR}/${dir}"

    print_info "检查 ${description}: ${dir}/"

    if [ -d "$full_path" ]; then
        print_success "${description}已存在"
        if [ "$CHECK_ONLY" = false ]; then
            chmod 755 "$full_path"
            print_info "权限已更新为 755"
        fi
    else
        if [ "$CHECK_ONLY" = true ]; then
            print_warning "${description}不存在（检查模式，未创建）"
        else
            if mkdir -p "$full_path"; then
                chmod 755 "$full_path"
                print_success "${description}已创建并设置权限 755"
            else
                print_failure "无法创建 ${description}"
                return 1
            fi
        fi
    fi
    return 0
}

initialize_log_files() {
    print_header "日志文件初始化"

    if [ "$CHECK_ONLY" = true ]; then
        print_info "检查模式：仅验证不修改"
    fi

    local log_files=(
        "logs/deploy.log:部署日志"
        "logs/access.log:访问日志"
    )

    for log_entry in "${log_files[@]}"; do
        local file="${log_entry%%:*}"
        local description="${log_entry##*:}"
        initialize_log_file "$file" "$description"
    done
}

initialize_log_file() {
    local file="$1"
    local description="$2"
    local full_path="${SCRIPT_DIR}/${file}"

    print_info "检查 ${description}: ${file}"

    if [ -f "$full_path" ]; then
        print_success "${description}已存在"
        if [ "$CHECK_ONLY" = false ]; then
            chmod 644 "$full_path"
            print_info "权限已更新为 644"
        fi
    else
        if [ "$CHECK_ONLY" = true ]; then
            print_warning "${description}不存在（检查模式，未创建）"
        else
            if touch "$full_path"; then
                chmod 644 "$full_path"
                echo "# ${description} - Created at $(date '+%Y-%m-%d %H:%M:%S')" > "$full_path"
                print_success "${description}已创建并设置权限 644"
            else
                print_failure "无法创建 ${description}"
                return 1
            fi
        fi
    fi
    return 0
}

# ==================== 网络检查函数 ====================

check_network() {
    print_header "网络和环境检查"

    check_port_8080
    check_container_socket
    check_network_connectivity
}

check_port_8080() {
    print_info "检查端口 8080 是否被占用..."

    if command -v netstat &> /dev/null; then
        if netstat -tuln 2>/dev/null | grep -q ":8080 "; then
            print_warning "端口 8080 已被占用"
            print_info "可能影响应用启动，请确认端口使用情况"
        else
            print_success "端口 8080 可用"
        fi
    elif command -v ss &> /dev/null; then
        if ss -tuln 2>/dev/null | grep -q ":8080 "; then
            print_warning "端口 8080 已被占用"
        else
            print_success "端口 8080 可用"
        fi
    else
        print_info "无法检测端口状态（缺少 netstat/ss 工具）"
    fi
}

check_container_socket() {
    print_info "检查容器运行时 socket..."

    if command -v podman &> /dev/null; then
        if podman info &> /dev/null; then
            print_success "Podman socket 连接正常"
        else
            print_warning "Podman socket 连接异常"
            print_info "请确保 Podman 服务正在运行"
        fi
    else
        print_info "跳过 socket 检查（Podman 未安装）"
    fi
}

check_network_connectivity() {
    print_info "检查网络连接性..."

    if ping -c 1 -W 2 8.8.8.8 &> /dev/null; then
        print_success "网络连接正常"
    else
        print_warning "无法连接到外部网络（8.8.8.8）"
        print_info "离线模式下部分功能可能受限"
    fi
}

# ==================== 清理函数 ====================

perform_cleanup() {
    print_header "执行清理操作"

    stop_containers
    clean_log_files
    clean_podman_cache
    print_info "清理完成"
}

stop_containers() {
    print_info "停止正在运行的容器..."

    if command -v podman &> /dev/null; then
        cd "$SCRIPT_DIR" || return 1

        if [ -f "podman-compose.yml" ]; then
            if podman-compose down 2>/dev/null; then
                print_success "已停止所有容器（podman-compose）"
            else
                print_info "没有正在运行的容器或停止失败"
            fi
        else
            local containers
            containers=$(podman ps -q --filter "name=flexloop" 2>/dev/null || true)
            if [ -n "$containers" ]; then
                echo "$containers" | while read -r container_id; do
                    podman stop "$container_id" 2>/dev/null && print_success "已停止容器: ${container_id:0:12}"
                done
            else
                print_info "没有找到 Flexloop 相关的运行容器"
            fi
        fi
    else
        print_info "跳过容器停止（Podman 未安装）"
    fi
}

clean_log_files() {
    print_info "清理旧日志文件..."

    local log_dir="${SCRIPT_DIR}/logs"
    if [ -d "$log_dir" ]; then
        find "$log_dir" -type f -name "*.log" -exec truncate -s 0 {} \; 2>/dev/null || true
        print_success "日志文件已清空"
    else
        print_info "日志目录不存在，无需清理"
    fi
}

clean_podman_cache() {
    print_info "清理 Podman 缓存..."

    if command -v podman &> /dev/null; then
        read -rp "是否清理 Podman 构建缓存？这将释放磁盘空间但会减慢后续构建速度 [y/N]: " response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            if podman system prune -f 2>/dev/null; then
                print_success "Podman 缓存清理完成"
            else
                print_warning "Podman 缓存清理遇到问题"
            fi
        else
            print_info "跳过缓存清理"
        fi
    else
        print_info "跳过缓存清理（Podman 未安装）"
    fi
}

# ==================== 汇总报告函数 ====================

generate_summary_report() {
    print_header "初始化汇总报告"

    local total=$((SUCCESS_COUNT + WARNING_COUNT + FAILURE_COUNT))

    echo ""
    print_info "统计信息:"
    echo -e "  ${GREEN}成功:${NC}  ${SUCCESS_COUNT} 项"
    echo -e "  ${YELLOW}警告:${NC}  ${WARNING_COUNT} 项"
    echo -e "  ${RED}失败:${NC}  ${FAILURE_COUNT} 项"
    echo -e "  总计:  ${total}  项"
    echo ""

    if [ "$FAILURE_COUNT" -eq 0 ]; then
        if [ "$CHECK_ONLY" = true ]; then
            print_success "环境检查完成 ✓（所有必要条件满足或有可接受的警告）"
        else
            print_success "初始化完成 ✓"
        fi
        echo ""
        print_info "下一步操作:"
        if [ "$DEV_MODE" = true ]; then
            print_info "  1. 运行 'npm install' 安装依赖"
            print_info "  2. 运行 'npm run dev' 启动开发服务器"
        else
            print_info "  1. 运行 './deploy.sh build' 构建镜像"
            print_info "  2. 运行 './deploy.sh start' 启动服务"
            print_info "  3. 运行 './healthcheck.sh' 验证服务健康状态"
        fi
        return 0
    else
        print_failure "初始化存在失败项 ✗"
        echo ""
        print_info "请解决上述失败项后重试:"
        print_info "  运行 '$0 --check-only' 仅查看问题而不修改"
        return 1
    fi
}

# ==================== 主程序 ====================

main() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --dev)
                DEV_MODE=true
                shift
                ;;
            --clean)
                CLEAN_MODE=true
                shift
                ;;
            --check-only)
                CHECK_ONLY=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                print_failure "未知参数: $1"
                show_help
                exit 1
                ;;
        esac
    done

    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║     Flexloop 容器初始化工具 v1.0.0     ║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════╝${NC}"
    echo ""

    print_info "工作目录: ${SCRIPT_DIR}"
    print_info "运行模式: $(if [ "$DEV_MODE" = true ]; then echo '开发环境'; else echo '生产环境'; fi)"
    print_info "检查模式: $(if [ "$CHECK_ONLY" = true ]; then echo '是'; else echo '否'; fi)"

    if [ "$CLEAN_MODE" = true ] && [ "$CHECK_ONLY" = false ]; then
        perform_cleanup
        echo ""
    fi

    detect_os
    check_disk_space
    check_podman
    check_nodejs
    validate_config_files

    if [ "$CHECK_ONLY" = false ]; then
        create_directory_structure
        initialize_log_files
    else
        create_directory_structure
        initialize_log_files
    fi

    check_network

    generate_summary_report
    exit $?
}

main "$@"
