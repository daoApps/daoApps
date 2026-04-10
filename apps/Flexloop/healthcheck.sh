#!/bin/bash
# Flexloop 应用健康检查工具
#
# 用途：检查应用健康状态，用于监控和 CI/CD 验证
#
# 用法：
#   ./healthcheck.sh                    # 使用默认配置
#   ./healthcheck.sh -u http://localhost:8080  # 自定义 URL
#   ./healthcheck.sh -t 10               # 超时时间 10 秒
#   ./healthcheck.sh -r 5                # 重试 5 次
#   ./healthcheck.sh -v                  # 详细模式
#   ./healthcheck.sh -h                  # 显示帮助
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
NC='\033[0m' # No Color

# ==================== 默认配置 ====================
DEFAULT_URL="http://localhost:8080/health"
DEFAULT_TIMEOUT=5
DEFAULT_RETRIES=3
DEFAULT_RETRY_INTERVAL=2
EXPECTED_STATUS_CODE=200
EXPECTED_STRING="OK"

# ==================== 全局变量 ====================
URL="$DEFAULT_URL"
TIMEOUT="$DEFAULT_TIMEOUT"
RETRIES="$DEFAULT_RETRIES"
RETRY_INTERVAL="$DEFAULT_RETRY_INTERVAL"
VERBOSE=false
SHOW_HEADERS=false
SHOW_BODY=false
CUSTOM_EXPECTED_STRING=""

# ==================== 辅助函数 ====================

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_failure() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_verbose() {
    if [ "$VERBOSE" = true ]; then
        echo -e "${BLUE}[DEBUG] $1${NC}"
    fi
}

show_help() {
    cat << EOF
Flexloop 应用健康检查工具 v1.0.0

用法: $0 [选项]

选项:
  -u, --url URL           健康检查端点 URL (默认: ${DEFAULT_URL})
  -t, --timeout SECONDS   请求超时时间，单位秒 (默认: ${DEFAULT_TIMEOUT})
  -r, --retries COUNT     失败后重试次数 (默认: ${DEFAULT_RETRIES})
  -i, --interval SECONDS  重试间隔时间，单位秒 (默认: ${DEFAULT_RETRY_INTERVAL})
  -s, --string STRING     期望在响应体中包含的字符串 (默认: "${EXPECTED_STRING}")
  -v, --verbose           启用详细输出模式
  --headers               显示响应头
  --body                  显示响应体
  -h, --help              显示此帮助信息

退出码:
  0  健康检查通过
  1  健康检查失败
  2  参数错误

示例:
  $0                                    # 使用默认配置检查
  $0 -u http://localhost:3000/health   # 检查自定义端点
  $0 -t 10 -r 5                        # 设置超时 10 秒，重试 5 次
  $0 -v --headers --body               # 显示完整诊断信息

EOF
}

validate_url() {
    local url="$1"
    if [[ ! "$url" =~ ^https?:// ]]; then
        print_failure "无效的 URL 格式: $url"
        print_info "URL 必须以 http:// 或 https:// 开头"
        return 1
    fi
    return 0
}

validate_number() {
    local value="$1"
    local name="$2"

    if ! [[ "$value" =~ ^[0-9]+$ ]] || [ "$value" -le 0 ]; then
        print_failure "无效的 ${name}: $value"
        print_info "${name} 必须是正整数"
        return 1
    fi
    return 0
}

# ==================== 核心功能函数 ====================

perform_health_check() {
    local attempt=1
    local max_attempts=$((RETRIES + 1))
    local success=false

    while [ $attempt -le $max_attempts ]; do
        print_verbose "执行第 ${attempt}/${max_attempts} 次尝试..."

        if do_single_check; then
            success=true
            break
        fi

        if [ $attempt -lt $max_attempts ]; then
            print_warning "第 ${attempt} 次检查失败，${RETRY_INTERVAL} 秒后重试..."
            sleep "$RETRY_INTERVAL"
        fi

        ((attempt++))
    done

    if [ "$success" = true ]; then
        return 0
    else
        return 1
    fi
}

do_single_check() {
    local start_time
    local end_time
    local elapsed_time
    local http_code
    local response_body
    local curl_exit_code

    start_time=$(date +%s%N 2>/dev/null || date +%s)

    print_verbose "发送 HTTP 请求到: $URL"
    print_verbose "超时设置: ${TIMEOUT} 秒"

    if [ "$VERBOSE" = true ] && [ "$SHOW_HEADERS" = true ]; then
        print_info "--- 请求详情 ---"
        print_info "URL: $URL"
        print_info "超时: ${TIMEOUT}s"
        print_info "----------------"
    fi

    response_body=$(curl -s -w "\n%{http_code}" \
        --max-time "$TIMEOUT" \
        --connect-timeout "$TIMEOUT" \
        -o /tmp/healthcheck_response_$$ \
        "$URL" 2>/dev/null) || true

    curl_exit_code=$?

    end_time=$(date +%s%N 2>/dev/null || date +%s)

    if [ "$start_time" != "$end_time" ]; then
        if [[ "$start_time" =~ ^[0-9]{13}$ ]]; then
            elapsed_time=$(( (end_time - start_time) / 1000000 ))
        else
            elapsed_time=$(( end_time - start_time ))
        fi
    else
        elapsed_time=0
    fi

    http_code=$(tail -1 /tmp/healthcheck_response_$$ 2>/dev/null)
    response_body=$(sed '$ d' /tmp/healthcheck_response_$$ 2>/dev/null)

    rm -f /tmp/healthcheck_response_$$

    print_verbose "curl 退出码: $curl_exit_code"
    print_verbose "HTTP 状态码: $http_code"
    print_verbose "响应时间: ${elapsed_time}ms"

    if [ "$VERBOSE" = true ]; then
        print_info "HTTP 状态码: ${http_code}"
        print_info "响应时间: ${elapsed_time}ms"
    fi

    if [ "$SHOW_HEADERS" = true ] && [ "$VERBOSE" = true ]; then
        print_info "--- 响应头 ---"
        curl -sI --max-time "$TIMEOUT" "$URL" 2>/dev/null | while IFS= read -r line; do
            print_info "$line"
        done
        print_info "-------------"
    fi

    if [ "$SHOW_BODY" = true ] && [ "$VERBOSE" = true ]; then
        print_info "--- 响应体 ---"
        echo "$response_body"
        print_info "-------------"
    fi

    if [ $curl_exit_code -ne 0 ]; then
        print_failure "连接失败 (curl 退出码: $curl_exit_code)"
        case $curl_exit_code in
            6) print_info "无法解析主机名";;
            7) print_info "无法连接到服务器";;
            28) print_info "请求超时 (${TIMEOUT}s)";;
            *) print_info "未知错误";;
        esac
        return 1
    fi

    if [ -z "$http_code" ]; then
        print_failure "无法获取 HTTP 状态码"
        return 1
    fi

    if [ "$http_code" != "$EXPECTED_STATUS_CODE" ]; then
        print_failure "HTTP 状态码不匹配: 期望 ${EXPECTED_STATUS_CODE}，实际 ${http_code}"
        return 1
    fi

    print_verbose "HTTP 状态码检查通过: ${http_code}"

    local expected_string_to_check="${CUSTOM_EXPECTED_STRING:-$EXPECTED_STRING}"

    if [ -n "$expected_string_to_check" ]; then
        if echo "$response_body" | grep -q "$expected_string_to_check"; then
            print_verbose "响应内容验证通过: 包含 '${expected_string_to_check}'"
        else
            print_failure "响应内容验证失败: 未找到期望字符串 '${expected_string_to_check}'"
            if [ "$VERBOSE" = true ]; then
                print_info "实际响应内容: $(echo "$response_body" | head -c 200)"
            fi
            return 1
        fi
    fi

    print_success "健康检查通过!"
    if [ "$VERBOSE" = true ]; then
        print_info "响应时间: ${elapsed_time}ms"
        print_info "状态码: ${http_code}"
    fi

    return 0
}

# ==================== 主程序 ====================

main() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            -u|--url)
                if [ -z "$2" ]; then
                    print_failure "缺少 URL 参数"
                    show_help
                    exit 2
                fi
                URL="$2"
                shift 2
                ;;
            -t|--timeout)
                if [ -z "$2" ]; then
                    print_failure "缺少超时参数"
                    show_help
                    exit 2
                fi
                TIMEOUT="$2"
                shift 2
                ;;
            -r|--retries)
                if [ -z "$2" ]; then
                    print_failure "缺少重试次数参数"
                    show_help
                    exit 2
                fi
                RETRIES="$2"
                shift 2
                ;;
            -i|--interval)
                if [ -z "$2" ]; then
                    print_failure "缺少重试间隔参数"
                    show_help
                    exit 2
                fi
                RETRY_INTERVAL="$2"
                shift 2
                ;;
            -s|--string)
                if [ -z "$2" ]; then
                    print_failure "缺少期望字符串参数"
                    show_help
                    exit 2
                fi
                CUSTOM_EXPECTED_STRING="$2"
                shift 2
                ;;
            -v|--verbose)
                VERBOSE=true
                shift
                ;;
            --headers)
                SHOW_HEADERS=true
                VERBOSE=true
                shift
                ;;
            --body)
                SHOW_BODY=true
                VERBOSE=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                print_failure "未知参数: $1"
                show_help
                exit 2
                ;;
        esac
    done

    print_info "========================================="
    print_info "  Flexloop 健康检查工具 v1.0.0"
    print_info "========================================="
    print_info ""

    if ! validate_url "$URL"; then
        exit 2
    fi

    if ! validate_number "$TIMEOUT" "超时时间"; then
        exit 2
    fi

    if ! validate_number "$RETRIES" "重试次数"; then
        exit 2
    fi

    if ! validate_number "$RETRY_INTERVAL" "重试间隔"; then
        exit 2
    fi

    print_info "检查目标: $URL"
    print_info "超时设置: ${TIMEOUT}s"
    print_info "重试次数: ${RETRIES}"
    print_info "重试间隔: ${RETRY_INTERVAL}s"

    if [ -n "$CUSTOM_EXPECTED_STRING" ]; then
        print_info "期望字符串: $CUSTOM_EXPECTED_STRING"
    fi

    print_info ""
    print_info "开始执行健康检查..."

    if perform_health_check; then
        print_info ""
        print_info "========================================="
        print_success "所有检查项均通过 ✓"
        print_info "========================================="
        exit 0
    else
        print_info ""
        print_info "========================================="
        print_failure "健康检查失败 ✗"
        print_info "========================================="
        exit 1
    fi
}

main "$@"
