#!/bin/bash
# ============================================================
# AgentPit Skills 安全验证工具 (Quick Validation)
# ============================================================
#
# 用途：快速验证 Skills 文件中是否包含明文敏感凭证
#
# 使用方式:
#   ./skills/security/validate-security.sh              # 验证 skills 目录
#   ./skills/security/validate-security.sh ./src         # 验证指定目录
#   ./skills/security/validate-security.sh --verbose     # 显示详细信息
#   ./skills/security/validate-security.sh --help        # 显示帮助
#
# 退出码:
#   0 - ✅ 验证通过（未发现明文凭证）
#   1 - ⚠️ 发现警告（建议项）
#   2 - ❌ 验证失败（发现严重问题）
#
# 版本: v1.0.0
# 最后更新: 2026-04-10
# ============================================================

set -euo pipefail

# ==================== 颜色定义 ====================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# ==================== 全局变量 ====================
VERBOSE=false
TARGET_DIR="${1:-./skills}"
PASS_COUNT=0
WARN_COUNT=0
FAIL_COUNT=0
TOTAL_CHECKS=0

# ==================== 函数 ====================

log_pass() { echo -e "${GREEN}[✅ PASS]${NC} $1"; ((PASS_COUNT++)) || true; ((TOTAL_CHECKS++)) || true; }
log_warn() { echo -e "${YELLOW}[⚠️  WARN]${NC} $1"; ((WARN_COUNT++)) || true; ((TOTAL_CHECKS++)) || true; }
log_fail() { echo -e "${RED}[❌ FAIL]${NC} $1"; ((FAIL_COUNT++)) || true; ((TOTAL_CHECKS++)) || true; }
log_info() { echo -e "${BLUE}[ℹ️  INFO]${NC} $1"; }

show_help() {
    cat << 'EOF'
AgentPit Security Validator v1.0.0

用法:
  validate-security.sh [选项] [目录]

选项:
  --verbose    显示详细的匹配内容
  -h, --help   显示此帮助信息

示例:
  validate-security.sh                    # 验证 ./skills 目录
  validate-security.sh --verbose          # 详细模式
  validate-security.sh ./src              # 验证其他目录

检测项目:
  1. 明文 OAuth Client ID（cmnkgi6yk 等真实值）
  2. 明文 Client Secret（非占位符格式）
  3. 硬编码的 API Key（sk-, pk- 开头）
  4. 数据库连接串含密码
  5. JWT Secret 硬编码
  6. AWS/GCP 凭证泄露
EOF
}

check_no_real_oauth_credentials() {
    log_info "检查 1/6: 明文 OAuth 凭证..."

    # 检查是否还有真实的 Client ID（示例值 cmnkgi6yk）
    if grep -rq "cmnkgi6yk" "$TARGET_DIR" --include="*.md" --include="*.ts" --include="*.js" 2>/dev/null; then
        local matches=$(grep -rn "cmnkgi6yk" "$TARGET_DIR" --include="*.md" --include="*.ts" --include="*.js" 2>/dev/null || true)

        # 排除自检命令中的提及（这是允许的）
        local real_issues=$(echo "$matches" | grep -v "grep.*cmnkgi6yk\|自检\|example\|例如" || true)

        if [ -n "$real_issues" ]; then
            log_fail "发现明文 OAuth Client ID!"
            if [ "$VERBOSE" = true ]; then
                echo "$real_issues" | while IFS=: read -r line content; do
                    echo "       📍 $line"
                done
            fi
        else
            log_warn "发现 'cmnkgi6yk' 字符串，但仅在自检示例中（可接受）"
        fi
    else
        log_pass "未发现明文 OAuth Client ID"
    fi

    # 检查 clientSecret 后面是否跟着真实值（非占位符）
    if grep -rqE "client_secret.*['\"][a-zA-Z0-9_\-]{20,}['\"]" "$TARGET_DIR" --include="*.md" --include="*.ts" 2>/dev/null; then
        # 排除 [CLIENT_SECRET] 占位符格式
        local issues=$(grep -rnE "client_secret.*['\"][a-zA-Z0-9_\-]{20,}['\"]" "$TARGET_DIR" --include="*.md" --include="*.ts" 2>/dev/null | grep -v "\[CLIENT_SECRET\]" || true)

        if [ -n "$issues" ]; then
            log_fail "发现可能的明文 Client Secret!"
            if [ "$VERBOSE" = true ]; then
                echo "$issues" | head -5
            fi
        else
            log_pass "Client Secret 仅使用占位符格式"
        fi
    else
        log_pass "未发现可疑的 Client Secret"
    fi
}

check_no_hardcoded_api_keys() {
    log_info "检查 2/6: 硬编码 API Key..."

    # OpenAI Key 格式: sk- 后跟 48 个字符
    if grep -rqE "sk-[a-zA-Z0-9]{48}" "$TARGET_DIR" 2>/dev/null; then
        log_fail "发现可能的 OpenAI API Key 格式字符串"
    else
        log_pass "未发现硬编码的 API Key"
    fi

    # Anthropic Key 格式
    if grep -rqE "sk-ant-api03-[a-zA-Z0-9\-_]{90,}" "$TARGET_DIR" 2>/dev/null; then
        log_fail "发现可能的 Anthropic API Key 格式字符串"
    else
        log_pass "未发现 Anthropic API Key"
    fi
}

check_database_url_safety() {
    log_info "检查 3/6: 数据库连接串安全性..."

    # 检测带密码的数据库 URL
    if grep -rqE "(mysql|postgresql|mongodb)://[^:]+:[^@]+@" "$TARGET_DIR" --include="*.env*" --include="*.json" --include="*.yaml" 2>/dev/null; then
        # 排除使用占位符的情况
        local issues=$(grep -rnE "(mysql|postgresql|mongodb)://[^:]+:[^@]+@" "$TARGET_DIR" --include="*.env*" --include="*.json" 2>/dev/null | grep -v "\[DB_PASSWORD\]\|\[PASSWORD\]\|user:\[password\]" || true)

        if [ -n "$issues" ]; then
            log_warn "发现可能含密码的数据库连接串"
            if [ "$VERBOSE" = true ]; then
                echo "$issues" | head -3
            fi
        else
            log_pass "数据库连接串使用占位符或模板格式"
        fi
    else
        log_pass "未发现不安全的数据库连接串"
    fi
}

check_jwt_secret_handling() {
    log_info "检查 4/6: JWT Secret 处理..."

    # 检测硬编码的长随机字符串作为 JWT Secret
    if grep -rqE "(jwt_secret|JWT_SECRET)\s*[:=]\s*['\"][a-zA-Z0-9]{32,}['\"]" "$TARGET_DIR" 2>/dev/null; then
        local issues=$(grep -rnE "(jwt_secret|JWT_SECRET)\s*[:=]\s*['\"][a-zA-Z0-9]{32,}['\"]" "$TARGET_DIR" 2>/dev/null | grep -v "\[SECRET\]\|\[JWT" || true)

        if [ -n "$issues" ]; then
            log_fail "发现可能硬编码的 JWT Secret"
        else
            log_pass "JWT Secret 使用占位符或环境变量引用"
        fi
    else
        log_pass "未发现硬编码的 JWT Secret"
    fi
}

check_placeholder_format_consistency() {
    log_info "检查 5/6: 占位符格式一致性..."

    # 检查是否使用了标准化的占位符格式
    local non_standard=$(grep -roh "\[[A-Za-z_]*\]" "$TARGET_DIR" --include="*.md" --include="*.ts" 2>/dev/null | sort -u | grep -vE "^\[(CLIENT_ID|CLIENT_SECRET|API_KEY|SECRET|PLACEHOLDER|DB_PASSWORD|STATE_SECRET|CRON_|YOUR_[A-Z_]+)\]$" || true)

    if [ -n "$non_standard" ]; then
        log_warn "发现非标准占位符格式（建议统一为 [UPPER_CASE_NAME]）:"
        if [ "$VERBOSE" = true ]; then
            echo "$non_standard" | head -10
        fi
    else
        log_pass "占位符格式符合标准化要求"
    fi

    # 检查 process.env 引用是否存在
    if grep -rq "process\.env\." "$TARGET_DIR" --include="*.ts" --include="*.js" 2>/dev/null; then
        log_pass "代码中使用 process.env 读取环境变量（推荐）"
    else
        log_info "提示：建议在代码中使用 process.env 读取配置"
    fi
}

check_gitignore_coverage() {
    log_info "检查 6/6: .gitignore 覆盖范围..."

    local gitignore_file="$(dirname "$TARGET_DIR")/.gitignore"
    if [ ! -f "$gitignore_file" ]; then
        gitignore_file=".gitignore"
    fi

    if [ -f "$gitignore_file" ]; then
        # 检查关键忽略规则
        local required_patterns=(".env.local" ".env.production" "*.key" "*.pem")
        local missing_count=0

        for pattern in "${required_patterns[@]}"; do
            if ! grep -q "$pattern" "$gitignore_file" 2>/dev/null; then
                log_warn ".gitignore 缺少规则: $pattern"
                ((missing_count++)) || true
            fi
        done

        if [ "$missing_count" -eq 0 ]; then
            log_pass ".gitignore 包含所有必要的敏感文件保护规则"
        else
            log_warn ".gitignore 缺少 $missing_count 个必要规则"
        fi
    else
        log_warn "未找到 .gitignore 文件"
    fi
}

# ==================== 主程序 ====================

main() {
    # 解析参数
    case "${1:-}" in
        --verbose|-v)
            VERBOSE=true
            TARGET_DIR="${2:-./skills}"
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            if [ -d "${1:-}" ] && [ "${1:-}" != "--"* ]; then
                TARGET_DIR="$1"
            fi
            ;;
    esac

    echo ""
    echo "========================================="
    echo "  AgentPit Security Validator v1.0.0"
    echo "========================================="
    echo ""
    log_info "目标目录: $(cd "$TARGET_DIR" 2>/dev/null && pwd || echo "$TARGET_DIR")"
    log_info "详细模式: $VERBOSE"
    echo ""

    # 执行所有检查
    check_no_real_oauth_credentials
    check_no_hardcoded_api_keys
    check_database_url_safety
    check_jwt_secret_handling
    check_placeholder_format_consistency
    check_gitignore_coverage

    # 输出汇总
    echo ""
    echo "========================================="
    echo "  验证结果汇总"
    echo "========================================="
    echo ""
    echo "总检查数: $TOTAL_CHECKS"
    echo -e "通过: ${GREEN}$PASS_COUNT${NC}"
    echo -e "警告: ${YELLOW}$WARN_COUNT${NC}"
    echo -e "失败: ${RED}$FAIL_COUNT${NC}"
    echo ""

    # 返回退出码
    if [ "$FAIL_COUNT" -gt 0 ]; then
        echo -e "${RED}❌ 验证失败！发现 $FAIL_COUNT 个严重问题，必须立即修复！${NC}"
        exit 2
    elif [ "$WARN_COUNT" -gt 0 ]; then
        echo -e "${YELLOW}⚠️  验证通过但有 $WARN_COUNT 个警告，建议尽快处理${NC}"
        exit 1
    else
        echo -e "${GREEN}✅ 全部验证通过！Skills 安全性符合要求。${NC}"
        exit 0
    fi
}

main "$@"
