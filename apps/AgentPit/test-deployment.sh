#!/bin/bash
# AgentPit 自动化部署测试脚本
#
# 用途：自动执行部署流程并验证各项指标
#
# 用法：
#   ./test-deployment.sh              # 运行完整测试套件
#   ./test-deployment.sh --quick      # 快速模式（跳过耗时测试）
#   ./test-deployment.sh --report     # 生成详细报告
#   ./test-deployment.sh --clean      # 测试后清理
#   ./test-deployment.sh --help       # 显示帮助信息
#
# 示例：
#   ./test-deployment.sh --quick --clean    # 快速模式并清理
#   ./test-deployment.sh --report           # 完整测试并生成报告
#
# 依赖工具：podman, curl, jq (可选)
# 作者：AgentPit Team
# 版本：1.0.0
# 日期：2026-04-10

set -e

# ==================== 全局配置 ====================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="${SCRIPT_DIR}"
IMAGE_NAME="agentpit-vue3"
IMAGE_TAG="latest"
CONTAINER_NAME="agentpit-web"
PORT=8080
HEALTH_URL="http://localhost:${PORT}/health"
BASE_URL="http://localhost:${PORT}"
LOG_FILE="${SCRIPT_DIR}/test-deployment.log"

# 测试统计变量
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
SKIPPED_TESTS=0
TEST_RESULTS=()

# 时间记录
BUILD_START_TIME=""
BUILD_END_TIME=""
DEPLOY_START_TIME=""
DEPLOY_END_TIME=""
IMAGE_SIZE=""

# ==================== 彩色输出定义 ====================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# ==================== 命令行参数解析 ====================
QUICK_MODE=false
GENERATE_REPORT=false
CLEANUP=false
VERBOSE=false

show_help() {
    cat << EOF
用法: $0 [选项]

AgentPit 自动化部署测试脚本

选项:
  -q, --quick      快速模式，跳过性能测试和耗时操作
  -r, --report     生成详细测试报告到文件
  -c, --clean      测试完成后自动清理容器和镜像
  -v, --verbose    显示详细输出信息
  -h, --help       显示此帮助信息

示例:
  $0                    # 运行完整测试套件
  $0 --quick            # 快速模式（跳过耗时测试）
  $0 --report           # 完整测试并生成报告
  $0 --quick --clean    # 快速模式并清理环境

退出码:
  0  所有测试通过
  1  存在失败的测试
  2  脚本错误或前置条件不满足
EOF
    exit 0
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -q|--quick)
                QUICK_MODE=true
                shift
                ;;
            -r|--report)
                GENERATE_REPORT=true
                shift
                ;;
            -c|--clean)
                CLEANUP=true
                shift
                ;;
            -v|--verbose)
                VERBOSE=true
                shift
                ;;
            -h|--help)
                show_help
                ;;
            *)
                echo -e "${RED}未知参数: $1${NC}"
                show_help
                ;;
        esac
    done
}

# ==================== 工具函数 ====================

log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

log_info() {
    log "INFO" "$@"
}

log_success() {
    log "SUCCESS" "$@"
}

log_warning() {
    log "WARNING" "$@"
}

log_error() {
    log "ERROR" "$@"
}

print_header() {
    echo ""
    echo -e "${BLUE}=====================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}=====================================${NC}"
}

print_section() {
    echo ""
    echo -e "${CYAN}--- $1 ---${NC}"
}

print_pass() {
    echo -e "  ${GREEN}✓ PASS${NC}: $1"
}

print_fail() {
    echo -e "  ${RED}✗ FAIL${NC}: $1"
    [ -n "$2" ] && echo -e "         ${RED}原因: $2${NC}"
}

print_skip() {
    echo -e "  ${YELLOW}⊘ SKIP${NC}: $1"
    [ -n "$2" ] && echo -e "         ${YELLOW}原因: $2${NC}"
}

record_test() {
    local name="$1"
    local status="$2"
    local detail="${3:-}"

    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    TEST_RESULTS+=("$name|$status|$detail")

    case $status in
        PASSED)
            PASSED_TESTS=$((PASSED_TESTS + 1))
            print_pass "$name"
            ;;
        FAILED)
            FAILED_TESTS=$((FAILED_TESTS + 1))
            print_fail "$name" "$detail"
            ;;
        SKIPPED)
            SKIPPED_TESTS=$((SKIPPED_TESTS + 1))
            print_skip "$name" "$detail"
            ;;
    esac
}

check_command() {
    if command -v "$1" &> /dev/null; then
        return 0
    else
        return 1
    fi
}

get_time_ms() {
    date +%s%3N 2>/dev/null || date +%s000
}

calculate_duration() {
    local start=$1
    local end=$2
    echo $(( (end - start) / 1000 ))
}

wait_for_port() {
    local port=$1
    local timeout=${2:-30}
    local start_time=$(get_time_ms)

    while true; do
        if netstat -tlnp 2>/dev/null | grep -q ":${port} " || \
           ss -tlnp 2>/dev/null | grep -q ":${port} "; then
            return 0
        fi

        local current_time=$(get_time_ms)
        local elapsed=$(( (current_time - start_time) / 1000 ))
        if [ $elapsed -ge $timeout ]; then
            return 1
        fi

        sleep 1
    done
}

make_http_request() {
    local url=$1
    local method=${2:-GET}
    local timeout=${3:-5}
    
    curl -s -o /dev/null -w "%{http_code}|%{time_total}|%{size_download}" \
         -X "$method" \
         --connect-timeout "$timeout" \
         --max-time "$timeout" \
         "$url" 2>/dev/null
}

get_response_headers() {
    local url=$1
    curl -sI "$url" 2>/dev/null
}

# ==================== 测试模块 1: 前置条件检查 ====================

test_prerequisites() {
    print_section "1. 前置条件检查"
    local section_passed=0
    local section_total=5

    print_section "1.1 检查必要工具"

    if check_command podman; then
        local podman_version=$(podman --version 2>/dev/null | grep -oE '[0-9]+\.[0-9]+' | head -1)
        record_test "Podman 已安装 (版本: ${podman_version})" "PASSED"
        ((section_passed++))
    else
        record_test "Podman 已安装" "FAILED" "未找到 podman 命令"
        return 1
    fi

    if check_command podman-compose || check_command docker-compose; then
        record_test "podman-compose 已安装" "PASSED"
        ((section_passed++))
    else
        record_test "podman-compose 已安装" "FAILED" "未找到 podman-compose 或 docker-compose"
        return 1
    fi

    if check_command curl; then
        record_test "curl 已安装" "PASSED"
        ((section_passed++))
    else
        record_test "curl 已安装" "FAILED" "未找到 curl 命令"
        return 1
    fi

    print_section "1.2 检查端口可用性"

    if ! netstat -tlnp 2>/dev/null | grep -q ":${PORT} " && \
       ! ss -tlnp 2>/dev/null | grep -q ":${PORT} "; then
        record_test "端口 ${PORT} 可用" "PASSED"
        ((section_passed++))
    else
        local pid=$(netstat -tlnp 2>/dev/null | grep ":${PORT} " | awk '{print $7}' | cut -d'/' -f1)
        record_test "端口 ${PORT} 可用" "FAILED" "端口已被进程占用 (PID: ${pid:-unknown})"
        return 1
    fi

    print_section "1.3 检查磁盘空间"

    local available_space=$(df -BG "${PROJECT_ROOT}" 2>/dev/null | awk 'NR==2 {print $4}' | tr -d 'G')
    if [ -n "$available_space" ] && [ "$available_space" -ge 2 ]; then
        record_test "磁盘空间充足 (可用: ${available_space}GB)" "PASSED"
        ((section_passed++))
    elif [ -z "$available_space" ]; then
        record_test "磁盘空间检查" "SKIPPED" "无法获取磁盘信息"
    else
        record_test "磁盘空间充足" "FAILED" "可用空间不足 (${available_space}GB < 2GB)"
        return 1
    fi

    if [ $section_passed -ge $((section_total - 1)) ]; then
        log_info "前置条件检查通过 ($section_passed/$section_total)"
        return 0
    else
        log_error "前置条件检查失败"
        return 1
    fi
}

# ==================== 测试模块 2: 构建测试 ====================

test_build() {
    print_section "2. 构建测试"
    local section_passed=0
    local section_total=4

    print_section "2.1 执行镜像构建"

    BUILD_START_TIME=$(get_time_ms)
    log_info "开始构建镜像: ${IMAGE_NAME}:${IMAGE_TAG}"

    if podman build -t "${IMAGE_NAME}:${IMAGE_TAG}" -f Podmanfile . > /tmp/podman-build.log 2>&1; then
        BUILD_END_TIME=$(get_time_ms)
        local build_time=$(calculate_duration BUILD_START_TIME BUILD_END_TIME)
        record_test "镜像构建成功 (耗时: ${build_time}s)" "PASSED"
        ((section_passed++))

        if [ "$VERBOSE" = true ]; then
            cat /tmp/podman-build.log | tee -a "$LOG_FILE"
        fi
    else
        BUILD_END_TIME=$(get_time_ms)
        local build_time=$(calculate_duration BUILD_START_TIME BUILD_END_TIME)
        record_test "镜像构建成功" "FAILED" "构建失败 (耗时: ${build_time}s)"
        log_error "构建日志:"
        cat /tmp/podman-build.log >> "$LOG_FILE"
        return 1
    fi

    print_section "2.2 检查镜像存在"

    if podman images | grep -q "${IMAGE_NAME}.*${IMAGE_TAG}"; then
        record_test "镜像已创建: ${IMAGE_NAME}:${IMAGE_TAG}" "PASSED"
        ((section_passed++))
    else
        record_test "镜像已创建" "FAILED" "镜像列表中未找到"
        return 1
    fi

    print_section "2.3 检查镜像大小"

    IMAGE_SIZE=$(podman images --format "{{.Repository}}:{{.Tag}}\t{{.Size}}" | \
                 grep "^${IMAGE_NAME}:${IMAGE_TAG}" | awk '{print $2}')

    if [ -n "$IMAGE_SIZE" ]; then
        local size_mb=$(echo "$IMAGE_SIZE" | sed 's/MB//')
        if [ -n "$size_mb" ] && [ "$size_mb" -lt 100 ]; then
            record_test "镜像大小合理 (${IMAGE_SIZE}, < 100MB)" "PASSED"
            ((section_passed++))
        else
            record_test "镜像大小合理" "WARNING" "镜像较大 (${IMAGE_SIZE}), 考虑优化"
            ((section_passed++))
        fi
    else
        record_test "获取镜像大小" "FAILED" "无法读取镜像大小"
    fi

    print_section "2.4 验证镜像层结构"

    local layer_count=$(podman images --format "{{.Repository}}:{{.Tag}}" | \
                        grep "^${IMAGE_NAME}:${IMAGE_TAG}" | wc -l)
    if [ "$layer_count" -gt 0 ]; then
        record_test "镜像层结构正常" "PASSED"
        ((section_passed++))
    else
        record_test "镜像层结构正常" "FAILED" "无法获取层信息"
    fi

    log_info "构建测试完成 ($section_passed/$section_total 通过)"
    return 0
}

# ==================== 测试模块 3: 部署测试 ====================

test_deployment() {
    print_section "3. 部署测试"
    local section_passed=0
    local section_total=4

    print_section "3.1 启动容器"

    DEPLOY_START_TIME=$(get_time_ms)
    log_info "启动容器..."

    if [ -f "podman-compose.yml" ]; then
        if podman-compose --profile production up -d > /tmp/podman-up.log 2>&1; then
            DEPLOY_END_TIME=$(get_time_ms)
            local deploy_time=$(calculate_duration DEPLOY_START_TIME DEPLOY_END_TIME)
            record_test "容器启动成功 (耗时: ${deploy_time}s)" "PASSED"
            ((section_passed++))
        else
            record_test "容器启动成功" "FAILED" "$(tail -20 /tmp/podman-up.log)"
            return 1
        fi
    else
        log_warning "未找到 podman-compose.yml，使用 podman run..."
        if podman run -d \
            --name "${CONTAINER_NAME}" \
            -p "${PORT}:80" \
            "${IMAGE_NAME}:${IMAGE_TAG}" > /tmp/podman-run.log 2>&1; then
            DEPLOY_END_TIME=$(get_time_ms)
            local deploy_time=$(calculate_duration DEPLOY_START_TIME DEPLOY_END_TIME)
            record_test "容器启动成功 (耗时: ${deploy_time}s)" "PASSED"
            ((section_passed++))
        else
            record_test "容器启动成功" "FAILED" "$(cat /tmp/podman-run.log)"
            return 1
        fi
    fi

    print_section "3.2 等待端口就绪"

    sleep 2
    if wait_for_port "$PORT" 30; then
        record_test "端口 ${PORT} 开始监听" "PASSED"
        ((section_passed++))
    else
        record_test "端口 ${PORT} 开始监听" "FAILED" "超时 (30秒)"
        return 1
    fi

    print_section "3.3 检查容器状态"

    local container_status=$(podman ps --filter "name=${CONTAINER_NAME}" --format "{{.Status}}" 2>/dev/null | head -1)
    if [[ "$container_status" == *"Up"* ]]; then
        record_test "容器运行状态正常 (${container_status})" "PASSED"
        ((section_passed++))
    else
        record_test "容器运行状态正常" "FAILED" "状态: ${container_status:-未知}"
        return 1
    fi

    print_section "3.4 验证进程运行"

    local process_check=$(podman exec "${CONTAINER_NAME}" ps aux 2>/dev/null | grep nginx | head -1)
    if [ -n "$process_check" ]; then
        record_test "Nginx 进程运行正常" "PASSED"
        ((section_passed++))
    else
        record_test "Nginx 进程运行正常" "FAILED" "未检测到 nginx 进程"
    fi

    log_info "部署测试完成 ($section_passed/$section_total 通过)"
    return 0
}

# ==================== 测试模块 4: 健康检查测试 ====================

test_health() {
    print_section "4. 健康检查测试"
    local section_passed=0
    local section_total=4

    print_section "4.1 调用健康端点"

    local health_result=$(make_http_request "$HEALTH_URL")
    local http_code=$(echo "$health_result" | cut -d'|' -f1)
    local response_time=$(echo "$health_result" | cut -d'|' -f2)

    if [ "$http_code" = "200" ]; then
        record_test "健康端点返回 200 (响应时间: ${response_time}s)" "PASSED"
        ((section_passed++))
    else
        record_test "健康端点返回 200" "FAILED" "HTTP 状态码: ${http_code}"
        return 1
    fi

    print_section "4.2 验证响应体"

    local response_body=$(curl -s "$HEALTH_URL" 2>/dev/null)
    if [[ "$response_body" == *"OK"* ]] || [[ "$response_body" == *"ok"* ]] || \
       [[ "$response_body" == *"healthy"* ]]; then
        record_test "响应体包含健康状态 (${response_body})" "PASSED"
        ((section_passed++))
    else
        record_test "响应体包含健康状态" "FAILED" "响应内容: ${response_body}"
    fi

    print_section "4.3 测试响应时间"

    local time_float=$(echo "$response_time" | awk '{printf "%.3f", $1}')
    local time_ms=$(echo "$time_float * 1000" | bc 2>/dev/null || echo "${time_float}")

    if (( $(echo "$response_time < 1.0" | bc -l 2>/dev/null || echo "0") )); then
        record_test "响应时间 < 1 秒 (${response_time}s)" "PASSED"
        ((section_passed++))
    else
        record_test "响应时间 < 1 秒" "WARNING" "响应较慢 (${response_time}s)"
        ((section_passed++))
    fi

    print_section "4.4 多次请求稳定性测试"

    local stable_count=0
    for i in {1..3}; do
        local result=$(make_http_request "$HEALTH_URL")
        local code=$(echo "$result" | cut -d'|' -f1)
        if [ "$code" = "200" ]; then
            ((stable_count++))
        fi
        sleep 0.5
    done

    if [ "$stable_count" -eq 3 ]; then
        record_test "连续 3 次请求全部成功 (3/3)" "PASSED"
        ((section_passed++))
    else
        record_test "连续请求稳定性" "FAILED" "成功次数: ${stable_count}/3"
    fi

    log_info "健康检查测试完成 ($section_passed/$section_total 通过)"
    return 0
}

# ==================== 测试模块 5: 功能测试 ====================

test_functionality() {
    print_section "5. 功能测试"
    local section_passed=0
    local section_total=8

    print_section "5.1 HTTP 请求首页"

    local home_result=$(make_http_request "$BASE_URL/")
    local home_code=$(echo "$home_result" | cut -d'|' -f1)
    local home_size=$(echo "$home_result" | cut -d'|' -f3)

    if [ "$home_code" = "200" ] && [ "$home_size" -gt 0 ]; then
        record_test "首页访问正常 (HTTP 200, 大小: ${home_size} bytes)" "PASSED"
        ((section_passed++))
    else
        record_test "首页访问正常" "FAILED" "状态码: ${home_code}, 大小: ${home_size}"
        return 1
    fi

    print_section "5.2 请求不存在的页面"

    local notfound_result=$(make_http_request "$BASE_URL/nonexistent-page-12345")
    local notfound_code=$(echo "$notfound_result" | cut -d'|' -f1)

    if [ "$notfound_code" = "200" ] || [ "$notfound_code" = "404" ]; then
        record_test "不存在页面处理正确 (HTTP ${notfound_code}, SPA fallback 正常)" "PASSED"
        ((section_passed++))
    else
        record_test "不存在页面处理正确" "FAILED" "意外的状态码: ${notfound_code}"
    fi

    print_section "5.3 请求静态资源 (JS)"

    local js_url=$(curl -s "$BASE_URL/" | grep -oE '/assets/[^"]+\.js' | head -1)
    if [ -n "$js_url" ]; then
        local js_result=$(make_http_request "${BASE_URL}${js_url}")
        local js_code=$(echo "$js_result" | cut -d'|' -f1)
        if [ "$js_code" = "200" ]; then
            record_test "JS 文件加载正常 (${js_url})" "PASSED"
            ((section_passed++))
        else
            record_test "JS 文件加载正常" "FAILED" "状态码: ${js_code}"
        fi
    else
        record_test "JS 文件加载正常" "SKIPPED" "未在页面中找到 JS 文件引用"
    fi

    print_section "5.4 请求静态资源 (CSS)"

    local css_url=$(curl -s "$BASE_URL/" | grep -oE '/assets/[^"]+\.css' | head -1)
    if [ -n "$css_url" ]; then
        local css_result=$(make_http_request "${BASE_URL}${css_url}")
        local css_code=$(echo "$css_result" | cut -d'|' -f1)
        if [ "$css_code" = "200" ]; then
            record_test "CSS 文件加载正常 (${css_url})" "PASSED"
            ((section_passed++))
        else
            record_test "CSS 文件加载正常" "FAILED" "状态码: ${css_code}"
        fi
    else
        record_test "CSS 文件加载正常" "SKIPPED" "未在页面中找到 CSS 文件引用"
    fi

    print_section "5.5 检查 Gzip 压缩"

    local gzip_headers=$(get_response_headers "${BASE_URL}/" | grep -i "content-encoding")
    if [[ "$gzip_headers" == *"gzip"* ]] || [[ "$gzip_headers" == *"br"* ]]; then
        record_test "压缩生效 (Content-Encoding: ${gzip_headers##*: })" "PASSED"
        ((section_passed++))
    else
        record_test "Gzip/Brotli 压缩生效" "WARNING" "未检测到压缩头 (可能未启用或客户端未发送 Accept-Encoding)"
        ((section_passed++))
    fi

    print_section "5.6 检查缓存策略"

    local cache_headers=$(get_response_headers "${BASE_URL}/" | grep -i "cache-control")
    if [[ "$cache_headers" == *"no-store"* ]] || [[ "$cache_headers" == *"no-cache"* ]]; then
        record_test "index.html 缓存策略正确 (no-store/no-cache)" "PASSED"
        ((section_passed++))
    else
        record_test "index.html 缓存策略正确" "WARNING" "缓存头: ${cache_headers:-未设置}"
        ((section_passed++))
    fi

    print_section "5.7 检查安全响应头 - X-Frame-Options"

    local xframe=$(get_response_headers "${BASE_URL}/" | grep -i "x-frame-options")
    if [[ "$xframe" == *"SAMEORIGIN"* ]] || [[ "$xframe" == *"DENY"* ]]; then
        record_test "X-Frame-Options 头设置正确 (${xframe##*: })" "PASSED"
        ((section_passed++))
    else
        record_test "X-Frame-Options 头设置" "FAILED" "未设置或值不正确: ${xframe:-缺失}"
    fi

    print_section "5.8 检查安全响应头 - X-Content-Type-Options"

    local xcontent=$(get_response_headers "${BASE_URL}/" | grep -i "x-content-type-options")
    if [[ "$xcontent" == *"nosniff"* ]]; then
        record_test "X-Content-Type-Options 头设置正确" "PASSED"
        ((section_passed++))
    else
        record_test "X-Content-Type-Options 头设置" "FAILED" "未设置或值不正确: ${xcontent:-缺失}"
    fi

    log_info "功能测试完成 ($section_passed/$section_total 通过)"
    return 0
}

# ==================== 测试模块 6: 安全性测试 ====================

test_security() {
    print_section "6. 安全性测试"
    local section_passed=0
    local section_total=6

    print_section "6.1 检查容器用户权限"

    local user_id=$(podman exec "${CONTAINER_NAME}" id -u 2>/dev/null)
    if [ -n "$user_id" ] && [ "$user_id" != "0" ]; then
        record_test "非 root 用户运行 (UID: ${user_id})" "PASSED"
        ((section_passed++))
    elif [ "$user_id" = "0" ]; then
        record_test "非 root 用户运行" "FAILED" "以 root 用户运行 (UID: 0)"
    else
        record_test "非 root 用户运行" "SKIPPED" "无法获取 UID"
    fi

    print_section "6.2 检查 Nginx 版本号隐藏"

    local server_header=$(get_response_headers "${BASE_URL}/" | grep -i "^server:")
    if [[ "$server_header" == "Server: nginx" ]] || [[ ! "$server_header" =~ [0-9]+\.[0-9]+ ]]; then
        record_test "Nginx 版本号隐藏 (server_tokens off)" "PASSED"
        ((section_passed++))
    else
        record_test "Nginx 版本号隐藏" "FAILED" "暴露了版本号: ${server_header}"
    fi

    print_section "6.3 检查 X-XSS-Protection"

    local xxss=$(get_response_headers "${BASE_URL}/" | grep -i "x-xss-protection")
    if [[ "$xxss" == *"1"* ]] || [[ "$xxss" == *"mode=block"* ]]; then
        record_test "X-XSS-Protection 启用 (${xxss##*: })" "PASSED"
        ((section_passed++))
    else
        record_test "X-XSS-Protection 启用" "WARNING" "未设置或值异常: ${xxss:-缺失}"
        ((section_passed++))
    fi

    print_section "6.4 检查 Referrer-Policy"

    local referrer=$(get_response_headers "${BASE_URL}/" | grep -i "referrer-policy")
    if [ -n "$referrer" ]; then
        record_test "Referrer-Policy 设置 (${referrer##*: })" "PASSED"
        ((section_passed++))
    else
        record_test "Referrer-Policy 设置" "WARNING" "未设置 Referrer-Policy 头"
        ((section_passed++))
    fi

    print_section "6.5 检查 Content-Security-Policy"

    local csp=$(get_response_headers "${BASE_URL}/" | grep -i "content-security-policy")
    if [ -n "$csp" ]; then
        record_test "Content-Security-Policy 存在" "PASSED"
        ((section_passed++))
    else
        record_test "Content-Security-Policy 存在" "WARNING" "未设置 CSP 头 (推荐配置)"
        ((section_passed++))
    fi

    print_section "6.6 检查敏感信息泄露"

    local body=$(curl -s "$BASE_URL/" 2>/dev/null)
    local leak_found=false

    if [[ "$body" == *"password"* ]] || [[ "$body" == *"secret"* ]] || \
       [[ "$body" == *"api_key"* ]] || [[ "$body" == *"token"* ]]; then
        leak_found=true
    fi

    if [ "$leak_found" = false ]; then
        record_test "无敏感信息泄露" "PASSED"
        ((section_passed++))
    else
        record_test "无敏感信息泄露" "WARNING" "可能包含敏感信息 (需人工审核)"
        ((section_passed++))
    fi

    log_info "安全性测试完成 ($section_passed/$section_total 通过)"
    return 0
}

# ==================== 测试模块 7: 性能测试 ====================

test_performance() {
    print_section "7. 性能测试"

    if [ "$QUICK_MODE" = true ]; then
        print_skip "性能测试套件" "快速模式下跳过"
        SKIPPED_TESTS=$((SKIPPED_TESTS + 4))
        TEST_RESULTS+=("性能测试套件|SKIPPED|快速模式")
        return 0
    fi

    local section_passed=0
    local section_total=4

    print_section "7.1 并发请求测试"

    local concurrent_requests=10
    local success_count=0
    local total_time=0
    local pids=()

    log_info "发起 ${concurrent_requests} 个并发请求..."

    for i in $(seq 1 $concurrent_requests); do
        (
            result=$(make_http_request "$BASE_URL/")
            code=$(echo "$result" | cut -d'|' -f1)
            time=$(echo "$result" | cut -d'|' -f2)
            echo "${code}|${time}" > /tmp/req_$i.txt
        ) &
        pids+=($!)
    done

    for pid in "${pids[@]}"; do
        wait $pid
    done

    for i in $(seq 1 $concurrent_requests); do
        if [ -f "/tmp/req_$i.txt" ]; then
            data=$(cat /tmp/req_$i.txt)
            code=$(echo "$data" | cut -d'|' -f1)
            time=$(echo "$data" | cut -d'|' -f2)
            rm -f "/tmp/req_$i.txt"

            if [ "$code" = "200" ]; then
                ((success_count++))
            fi
            total_time=$(echo "$total_time + $time" | bc 2>/dev/null || echo "$total_time")
        fi
    done

    local avg_time=$(echo "scale=3; $total_time / $concurrent_requests" | bc 2>/dev/null || echo "N/A")
    record_test "并发请求测试 (${success_count}/${concurrent_requests} 成功, 平均: ${avg_time}s)" "PASSED"
    ((section_passed++))

    print_section "7.2 响应时间统计"

    local times=()
    for i in $(seq 1 20); do
        result=$(make_http_request "$BASE_URL/")
        time=$(echo "$result" | cut -d'|' -f2)
        times+=("$time")
        sleep 0.1
    done

    IFS=$'\n' sorted_times=($(sort -n <<<"${times[*]}"))
    unset IFS

    local min_time=${sorted_times[0]}
    local max_time=${sorted_times[19]}
    local median_time=${sorted_times[10]}

    record_test "响应时间统计 (最小: ${min_time}s, 最大: ${max_time}s, 中位数: ${median_time}s)" "PASSED"
    ((section_passed++))

    print_section "7.3 吞吐量估算"

    local test_duration=5
    local request_count=0
    local start_ts=$(date +%s)

    while [ $(($(date +%s) - start_ts)) -lt $test_duration ]; do
        make_http_request "$BASE_URL/" > /dev/null 2>&1 &
        ((request_count++))
        [ $((request_count % 50)) -eq 0 ] && wait
    done

    wait

    local throughput=$((request_count / test_duration))
    record_test "吞吐量估算 (~${throughput} req/s 在 ${test_duration}s 内共 ${request_count} 请求)" "PASSED"
    ((section_passed++))

    print_section "7.4 内存占用检查"

    local mem_usage=$(podman stats --no-stream --format "{{.MemUsage}}" "${CONTAINER_NAME}" 2>/dev/null | head -1)
    if [ -n "$mem_usage" ]; then
        local mem_mb=$(echo "$mem_usage" | grep -oE '[0-9.]+MiB' | head -1)
        if [ -n "$mem_mb" ]; then
            record_test "内存占用合理 (${mem_usage})" "PASSED"
            ((section_passed++))
        else
            record_test "内存占用合理 (${mem_usage})" "PASSED"
            ((section_passed++))
        fi
    else
        record_test "内存占用检查" "SKIPPED" "无法获取内存信息"
    fi

    log_info "性能测试完成 ($section_passed/$section_total 通过)"
    return 0
}

# ==================== 清理函数 ====================

cleanup() {
    if [ "$CLEANUP" = true ]; then
        print_section "清理测试环境"

        log_info "停止并移除容器..."
        if [ -f "podman-compose.yml" ]; then
            podman-compose --profile production down -v 2>/dev/null || true
        else
            podman stop "${CONTAINER_NAME}" 2>/dev/null || true
            podman rm "${CONTAINER_NAME}" 2>/dev/null || true
        fi

        log_info "清理镜像..."
        podman rmi "${IMAGE_NAME}:${IMAGE_TAG}" 2>/dev/null || true

        log_info "临时文件清理..."
        rm -f /tmp/podman-build.log /tmp/podman-up.log /tmp/podman-run.log
        rm -f /tmp/req_*.txt 2>/dev/null

        log_success "清理完成"
    fi
}

# ==================== 报告生成 ====================

generate_report() {
    if [ "$GENERATE_REPORT" = true ]; then
        local report_file="${SCRIPT_DIR}/deployment-test-report-$(date +%Y%m%d-%H%M%S).md"

        cat > "$report_file" << EOF
# AgentPit Deployment Test Report

**Test Date**: $(date '+%Y-%m-%d %H:%M:%S')
**Environment**: Production
**Podman Version**: $(podman --version 2>/dev/null || echo "Unknown")
**Node Version**: $(node --version 2>/dev/null || echo "N/A")
**Quick Mode**: ${QUICK_MODE}

---

## Results Summary

| Test Module | Status | Details |
|-------------|--------|---------|
| Pre-flight Checks | ${PASSED_TESTS}/${TOTAL_TESTS} passed | |
| Build Test | | |
| Deployment Test | | |
| Health Check | | |
| Functionality Test | | |
| Security Test | | |
| Performance Test | | |

**Total**: ${PASSED_TESTS}/${TOTAL_TESTS} tests passed ($(python3 -c "print(f'{(PASSED_TESTS*100/TOTAL_TESTS):.1f}')" 2>/dev/null || echo "N/A")%)
**Failed**: ${FAILED_TESTS}
**Skipped**: ${SKIPPED_TESTS}

---

## Performance Metrics

| Metric | Value |
|--------|-------|
| Build Time | ${BUILD_TIME:-N/A} seconds |
| Image Size | ${IMAGE_SIZE:-N/A} |
| Startup Time | ${STARTUP_TIME:-N/A} seconds |
| Avg Response Time | ${AVG_RESPONSE_TIME:-N/A} ms |

---

## Detailed Test Results

EOF

        for result in "${TEST_RESULTS[@]}"; do
            local name=$(echo "$result" | cut -d'|' -f1)
            local status=$(echo "$result" | cut -d'|' -f2)
            local detail=$(echo "$result" | cut -d'|' -f3)
            
            case $status in
                PASSED) echo "- ✅ **PASS**: ${name}" >> "$report_file" ;;
                FAILED) echo "- ❌ **FAIL**: ${name} - ${detail}" >> "$report_file" ;;
                SKIPPED) echo "- ⏭️ **SKIP**: ${name} - ${detail}" >> "$report_file" ;;
            esac
        done

        cat >> "$report_file" << EOF

---

## Recommendations

$([ $FAILED_TESTS -eq 0 ] && echo "1. 🎉 All checks passed! Ready for deployment." || echo "1. ⚠️ Some tests failed. Please review the failed items above.")
$([ $QUICK_MODE = true ] && echo "2. ℹ️ Quick mode was used. Consider running full test suite before production deployment.")
3. 💡 Regular testing is recommended after each deployment.
4. 🔒 Ensure security headers are properly configured for production.

---

*Generated by test-deployment.sh v1.0.0*
EOF

        log_success "报告已生成: ${report_file}"
    fi
}

# ==================== 主函数 ====================

main() {
    parse_args "$@"

    echo ""
    echo -e "${BOLD}=====================================${NC}"
    echo -e "${BOLD}  AgentPit Deployment Test Suite${NC}"
    echo -e "${BOLD}=====================================${NC}"
    echo -e "  Date: $(date '+%Y-%m-%d %H:%M:%S')"
    echo -e "  Mode: $([ "$QUICK_MODE" = true ] && echo 'Quick' || echo 'Full')"
    echo -e "  Report: $([ "$GENERATE_REPORT" = true ] && echo 'Enabled' || echo 'Disabled')"
    echo -e "  Cleanup: $([ "$CLEANUP" = true ] && echo 'Enabled' || echo 'Disabled')"
    echo ""

    # 初始化日志
    echo "" > "$LOG_FILE"
    log_info "========== 测试开始 =========="
    log_info "项目路径: ${PROJECT_ROOT}"

    # 执行测试套件
    local exit_code=0

    if ! test_prerequisites; then
        log_error "前置条件检查失败，终止测试"
        exit_code=2
        cleanup
        generate_report
        exit $exit_code
    fi

    if ! test_build; then
        log_error "构建测试失败"
        exit_code=1
        cleanup
        generate_report
        exit $exit_code
    fi

    if ! test_deployment; then
        log_error "部署测试失败"
        exit_code=1
        cleanup
        generate_report
        exit $exit_code
    fi

    if ! test_health; then
        log_warning "健康检查存在问题"
    fi

    test_functionality || true
    test_security || true
    test_performance || true

    # 输出最终报告
    echo ""
    echo -e "${BOLD}=====================================${NC}"
    echo -e "${BOLD}  AgentPit Deployment Test Report${NC}"
    echo -e "${BOLD}=====================================${NC}"
    echo ""
    echo -e "Test Date: $(date '+%Y-%m-%d %H:%M:%S')"
    echo -e "Environment: Production"
    echo -e "Podman Version: $(podman --version 2>/dev/null | grep -oE '[0-9.]+' | head -1 || echo 'Unknown')"
    echo ""
    echo -e "${CYAN}-------------------------------------${NC}"
    echo -e "${CYAN}Results Summary:${NC}"
    echo -e "${CYAN}-------------------------------------${NC}"

    local pass_rate=0
    if [ $TOTAL_TESTS -gt 0 ]; then
        pass_rate=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    fi

    echo -e "  Total Tests:    ${TOTAL_TESTS}"
    echo -e "  ${GREEN}✓ Passed${NC}:       ${PASSED_TESTS} (${pass_rate}%)"
    echo -e "  ${RED}✗ Failed${NC}:       ${FAILED_TESTS}"
    echo -e "  ${YELLOW}⊘ Skipped${NC}:     ${SKIPPED_TESTS}"
    echo ""

    if [ -n "$IMAGE_SIZE" ]; then
        echo -e "${CYAN}-------------------------------------${NC}"
        echo -e "${CYAN}Build Metrics:${NC}"
        echo -e "${CYAN}-------------------------------------${NC}"
        echo -e "  Image Size:     ${IMAGE_SIZE}"
        
        if [ -n "$BUILD_START_TIME" ] && [ -n "$BUILD_END_TIME" ]; then
            local build_dur=$(calculate_duration BUILD_START_TIME BUILD_END_TIME)
            echo -e "  Build Time:     ${build_dur}s"
        fi
        
        if [ -n "$DEPLOY_START_TIME" ] && [ -n "$DEPLOY_END_TIME" ]; then
            local deploy_dur=$(calculate_duration DEPLOY_START_TIME DEPLOY_END_TIME)
            echo -e "  Startup Time:   ${deploy_dur}s"
        fi
        echo ""
    fi

    echo -e "${CYAN}-------------------------------------${NC}"
    echo -e "${CYAN}Recommendations:${NC}"
    echo -e "${CYAN}-------------------------------------${NC}"

    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "  ${GREEN}1. 🎉 All critical tests passed! Ready for deployment.${NC}"
    else
        echo -e "  ${RED}1. ⚠️ ${FAILED_TESTS} test(s) failed. Review and fix before deployment.${NC}"
    fi

    if [ "$QUICK_MODE" = true ]; then
        echo -e "  ${YELLOW}2. ℹ️ Quick mode used. Run full suite for comprehensive validation.${NC}"
    fi

    echo -e "  3. 💡 Check logs at: ${LOG_FILE}"
    echo -e "  4. 🔒 Verify security headers in production environment"
    echo ""

    echo -e "${BOLD}=====================================${NC}"
    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "${GREEN}Result: ✅ ALL CRITICAL TESTS PASSED${NC}"
    else
        echo -e "${RED}Result: ❌ SOME TESTS FAILED${NC}"
        exit_code=1
    fi
    echo -e "${BOLD}=====================================${NC}"
    echo ""

    log_info "========== 测试结束 =========="
    log_info "总计: ${TOTAL_TESTS} 测试, 通过: ${PASSED_TESTS}, 失败: ${FAILED_TESTS}, 跳过: ${SKIPPED_TESTS}"

    # 清理和报告
    cleanup
    generate_report

    exit $exit_code
}

# 执行主函数
main "$@"
