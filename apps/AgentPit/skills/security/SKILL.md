---
name: "security"
description: "AgentPit 项目安全管理工具集，提供敏感信息自动检测、安全扫描脚本、环境变量规范管理和日志脱敏函数。当需要检查代码中的凭证泄露、生成安全报告、管理环境变量或保护日志输出时调用此技能。"
---

# Security - 安全管理工具集

## 1. 概述（Overview）

### 用途
此 Skill 用于持续监控项目中的敏感信息安全，提供从开发阶段到生产环境的全方位安全防护能力。

### 适用场景
- **开发阶段安全检查**：在编写代码时实时检测硬编码的凭证和密钥
- **CI/CD 流水线集成**：自动化安全扫描，防止敏感信息进入代码仓库
- **代码审查辅助**：快速识别潜在的安全风险点
- **日志安全防护**：确保日志输出不泄露敏感数据

### 核心原则
**"零信任" (Zero Trust)** - 默认所有外部输入都可能是恶意的：
- 所有凭证必须通过环境变量注入
- 日志输出前必须进行脱敏处理
- 定期执行安全扫描检测潜在泄露
- 遵循最小权限原则配置访问控制

---

## 2. 敏感信息检测规则（Detection Rules）

### 完整正则表达式模式库

```typescript
/**
 * 敏感信息检测模式库
 * 
 * 风险等级定义：
 * - 🔴 CRITICAL: 必须立即修复（可能导致直接的安全漏洞）
 * - 🟠 HIGH: 应尽快修复（增加攻击面）
 * - 🟡 MEDIUM: 计划修复（不符合最佳实践）
 * - 🔵 LOW: 可选优化（提升防御深度）
 */

export const SENSITIVE_PATTERNS = {
  // 🔴 CRITICAL: OAuth 凭证
  OAUTH_CLIENT_ID: {
    pattern: /client_id\s*[:=]\s*['"]([a-z0-9]{20,})['"]/gi,
    description: 'OAuth Client ID (硬编码)',
    riskLevel: 'CRITICAL' as const,
    example: 'clientId: "abc123def456..."',
  },
  
  OAUTH_CLIENT_SECRET: {
    pattern: /client_secret\s*[:=]\s*['"]([a-zA-Z0-9_\-]{20,})['"]/gi,
    description: 'OAuth Client Secret (硬编码)',
    riskLevel: 'CRITICAL' as const,
    example: 'clientSecret: "secret_value_here"',
  },
  
  // 🔴 CRITICAL: API 密钥
  OPENAI_API_KEY: {
    pattern: /sk-[a-zA-Z0-9]{48}/g,
    description: 'OpenAI API Key',
    riskLevel: 'CRITICAL' as const,
  },
  
  ANTHROPIC_API_KEY: {
    pattern: /sk-ant-api03-[a-zA-Z0-9\-_]{90,}/g,
    description: 'Anthropic/Claude API Key',
    riskLevel: 'CRITICAL' as const,
  },
  
  // 🟠 HIGH: 数据库连接串
  DATABASE_URL: {
    pattern: /(mysql|postgresql|mongodb|redis):\/\/[^:]+:[^@]+@/gi,
    description: 'Database Connection String with Password',
    riskLevel: 'HIGH' as const,
  },
  
  // 🟠 HIGH: JWT Secret
  JWT_SECRET: {
    pattern: /jwt_secret\s*[:=]\s*['"][a-zA-Z0-9]{32,}['"]/gi,
    description: 'JWT Secret (硬编码)',
    riskLevel: 'HIGH' as const,
  },
  
  // 🟡 MEDIUM: AWS 凭证
  AWS_ACCESS_KEY: {
    pattern: /AKIA[0-9A-Z]{16}/g,
    description: 'AWS Access Key ID',
    riskLevel: 'MEDIUM' as const,
  },
  
  // 🔵 LOW: IP 地址（可选）
  PRIVATE_IP: {
    pattern: /\b(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3})\b/g,
    description: 'Private IP Address',
    riskLevel: 'LOW' as const,
  },
}
```

### 使用示例

```typescript
import { SENSITIVE_PATTERNS } from './security-patterns'

function scanCodeForSecrets(code: string): Array<{
  type: string
  line: number
  match: string
  riskLevel: string
}> {
  const findings = []
  const lines = code.split('\n')
  
  for (const [patternName, config] of Object.entries(SENSITIVE_PATTERNS)) {
    lines.forEach((line, index) => {
      const matches = line.match(config.pattern)
      if (matches) {
        findings.push({
          type: config.description,
          line: index + 1,
          match: matches[0],
          riskLevel: config.riskLevel
        })
      }
    })
  }
  
  return findings
}
```

---

## 3. 安全扫描脚本（Security Scanner Script）

### 文件位置
`skills/security/security-scan.sh`

### 完整脚本

```bash
#!/bin/bash
# ============================================================
# AgentPit Skills 安全扫描工具
# ============================================================
#
# 用途：检测项目中的敏感信息泄露风险
# 
# 使用方式：
#   ./skills/security/security-scan.sh                    # 扫描当前目录
#   ./skills/security/security-scan.sh ./src              # 扫描指定目录
#   ./skills/security/security-scan.sh --strict           # 严格模式（发现问题即退出码 2）
#   ./skills/security/security-scan.sh --report           # 生成 Markdown 报告
#   ./skills/security/security-scan.sh --fix              # 自动修复（仅限简单情况）
#   ./skills/security/security-scan.sh --help             # 显示帮助
#
# 输出格式：
#   ✅ PASS  - 无敏感信息发现
#   ⚠️  WARN  - 发现低风险项
#   ❌ FAIL  - 发现高风险/严重问题
#
# 退出码：
#   0 - 全部通过
#   1 - 发现警告（--strict 时也视为失败）
#   2 - 发现严重问题
#
# 作者: AgentPit Security Team
# 版本: v1.0.0
# 最后更新: 2026-04-10
# ============================================================

set -euo pipefail

# ==================== 配置区 ====================

# 要扫描的文件扩展名
FILE_EXTENSIONS="md ts tsx js jsx vue json yaml yml env example"

# 排除的目录（正则模式）
EXCLUDE_DIRS="node_modules|.git|dist|build|.next|coverage"

# 白名单：允许的模式（占位符格式）
WHITELIST_PATTERNS=(
    '\[CLIENT_ID\]'
    '\[CLIENT_SECRET\]'
    '\[API_KEY\]'
    '\[SECRET\]'
    '\[PLACEHOLDER\]'
    '\[YOUR_\w*\]'
    '<your-\w*-here>'
    'process\.env\.\w+'
)

# ==================== 颜色定义 ====================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ==================== 全局变量 ====================

TOTAL_FILES_SCANNED=0
TOTAL_ISSUES_FOUND=0
CRITICAL_COUNT=0
HIGH_COUNT=0
MEDIUM_COUNT=0
LOW_COUNT=0
ISSUES_FILE=$(mktemp)
STRICT_MODE=false
GENERATE_REPORT=false
TARGET_DIR="."

# ==================== 函数定义 ====================

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✅ PASS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[⚠️  WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[❌ FAIL]${NC} $1"
}

show_help() {
    cat << 'EOF'
AgentPit Security Scanner v1.0.0

用法:
  security-scan.sh [选项] [目录]

选项:
  --strict     严格模式：任何问题都导致非零退出码
  --report     生成 Markdown 格式的详细报告
  --fix        自动修复简单的占位符问题（实验性）
  -h, --help   显示此帮助信息

示例:
  ./security-scan.sh                      # 扫描当前目录
  ./security-scan.sh ./src                # 扫描 src 目录
  ./security-scan.sh --strict ./skills    # 严格模式扫描 skills
  ./security-scan.sh --report > report.md # 生成报告

支持的检测类型:
  🔴 CRITICAL: OAuth Client ID/Secret, API Keys
  🟠 HIGH: Database URLs with passwords, JWT Secrets
  🟡 MEDIUM: AWS/GCP Credentials, Private Keys
  🔵 LOW: Private IPs, Internal endpoints

白名单（自动忽略）:
  - [CLIENT_ID], [CLIENT_SECRET], [API_KEY] 等占位符
  - process.env.XXX 引用
  - <your-value-here> 模板格式

EOF
}

is_excluded_dir() {
    local dir="$1"
    for exclude in ${EXCLUDE_DIRS//|/ }; do
        if [[ "$dir" == *"$exclude"* ]]; then
            return 0
        fi
    done
    return 1
}

is_whitelisted() {
    local content="$1"
    for pattern in "${WHITELIST_PATTERNS[@]}"; do
        if echo "$content" | grep -qE "$pattern"; then
            return 0
        fi
    done
    return 1
}

scan_file() {
    local file="$1"
    
    # 检查文件扩展名
    local ext="${file##*.}"
    if ! echo "$FILE_EXTENSIONS" | grep -qw "$ext"; then
        return
    fi
    
    ((TOTAL_FILES_SCANNED++)) || true
    
    # === 检测 1: OAuth Client ID ===
    if grep -qiE "client_id\s*[:=]\s*['\"]?[a-z0-9]{20,}['\"]?" "$file" 2>/dev/null; then
        while IFS=: read -r line_num content; do
            if ! is_whitelisted "$content"; then
                log_error "OAuth Client ID 可能泄露: $file:$line_num"
                echo "CRITICAL|$file|$line_num|OAuth Client ID|$content" >> "$ISSUES_FILE"
                ((CRITICAL_COUNT++)) || true
                ((TOTAL_ISSUES_FOUND++)) || true
            fi
        done < <(grep -niE "client_id\s*[:=]\s*['\"]?[a-z0-9]{20,}['\"]?" "$file" 2>/dev/null || true)
    fi
    
    # === 检测 2: OAuth Client Secret ===
    if grep -qiE "client_secret\s*[:=]\s*['\"][a-zA-Z0-9_\-]{20,}['\"]" "$file" 2>/dev/null; then
        while IFS=: read -r line_num content; do
            if ! is_whitelisted "$content"; then
                log_error "OAuth Client Secret 可能泄露: $file:$line_num"
                echo "CRITICAL|$file|$line_num|OAuth Client Secret|$content" >> "$ISSUES_FILE"
                ((CRITICAL_COUNT++)) || true
                ((TOTAL_ISSUES_FOUND++)) || true
            fi
        done < <(grep -niE "client_secret\s*[:=]\s*['\"][a-zA-Z0-9_\-]{20,}['\"]" "$file" 2>/dev/null || true)
    fi
    
    # === 检测 3: OpenAI API Key ===
    if grep -qE "sk-[a-zA-Z0-9]{48}" "$file" 2>/dev/null; then
        while IFS=: read -r line_num content; do
            if ! is_whitelisted "$content"; then
                log_error "OpenAI API Key 可能泄露: $file:$line_num"
                echo "CRITICAL|$file|$line_num|OpenAI API Key|sk-****" >> "$ISSUES_FILE"
                ((CRITICAL_COUNT++)) || true
                ((TOTAL_ISSUES_FOUND++)) || true
            fi
        done < <(grep -nE "sk-[a-zA-Z0-9]{48}" "$file" 2>/dev/null || true)
    fi
    
    # === 检测 4: 数据库连接串含密码 ===
    if grep -qiE "(mysql|postgresql|mongodb|redis)://[^:]+:[^@]+@" "$file" 2>/dev/null; then
        while IFS=: read -r line_num content; do
            if ! is_whitelisted "$content"; then
                log_warning "数据库连接串可能含密码: $file:$line_num"
                echo "HIGH|$file|$line_num|Database URL|****" >> "$ISSUES_FILE"
                ((HIGH_COUNT++)) || true
                ((TOTAL_ISSUES_FOUND++)) || true
            fi
        done < <(grep -niE "(mysql|postgresql|mongodb|redis)://[^:]+:[^@]+@" "$file" 2>/dev/null || true)
    fi
    
    # === 检测 5: 硬编码的 JWT Secret ===
    if grep -qiE "(jwt_secret|JWT_SECRET)\s*[:=]\s*['\"][a-zA-Z0-9]{32,}['\"]" "$file" 2>/dev/null; then
        while IFS=: read -r line_num content; do
            if ! is_whitelisted "$content"; then
                log_warning "JWT Secret 可能硬编码: $file:$line_num"
                echo "HIGH|$file|$line_num|JWT Secret|****" >> "$ISSUES_FILE"
                ((HIGH_COUNT++)) || true
                ((TOTAL_ISSUES_FOUND++)) || true
            fi
        done < <(grep -niE "(jwt_secret|JWT_SECRET)\s*[:=]\s*['\"][a-zA-Z0-9]{32,}['\"]" "$file" 2>/dev/null || true)
    fi
    
    # === 检测 6: AWS Access Key ===
    if grep -qE "AKIA[0-9A-Z]{16}" "$file" 2>/dev/null; then
        while IFS=: read -r line_num content; do
            log_warning "AWS Access Key ID 发现: $file:$line_num"
            echo "MEDIUM|$file|$line_num|AWS Access Key|AKIA****" >> "$ISSUES_FILE"
            ((MEDIUM_COUNT++)) || true
            ((TOTAL_ISSUES_FOUND++)) || true
        done < <(grep -nE "AKIA[0-9A-Z]{16}" "$file" 2>/dev/null || true)
    fi
}

generate_report() {
    local report_file="${TARGET_DIR%/}/security-scan-report-$(date +%Y%m%d-%H%M%S).md"
    
    cat > "$report_file" << EOF
# AgentPit Security Scan Report

**扫描时间**: $(date '+%Y-%m-%d %H:%M:%S')  
**扫描目录**: $(cd "$TARGET_DIR" && pwd)  
**扫描工具**: AgentPit Security Scanner v1.0.0  

---

## 📊 执行摘要

| 指标 | 数量 |
|------|------|
| 扫描文件数 | $TOTAL_FILES_SCANNED |
| 发现问题总数 | $TOTAL_ISSUES_FOUND |
| 🔴 严重 (CRITICAL) | $CRITICAL_COUNT |
| 🟠 高风险 (HIGH) | $HIGH_COUNT |
| 🟡 中风险 (MEDIUM) | $MEDIUM_COUNT |
| 🔵 低风险 (LOW) | $LOW_COUNT |

---

## 📋 问题详情

$(if [ -s "$ISSUES_FILE" ]; then
    echo "| 严重程度 | 文件 | 行号 | 类型 | 内容 |"
    echo "|----------|------|------|------|------|"
    while IFS='|' read -r severity file line_type type content; do
        echo "| $severity | \`$file\` | $line_type | $type | \`$content\` |"
    done < "$ISSUES_FILE"
else
    echo "✅ 未发现安全问题！"
fi)

---

## ✅ 建议

$(
if [ "$CRITICAL_COUNT" -gt 0 ]; then
    echo "- 🔴 **立即行动**: 发现 $CRITICAL_COUNT 个严重问题，必须立即修复"
    echo "  - 将硬编码的凭证移至环境变量"
    echo "  - 使用 \`\[PLACEHOLDER]\`\` 格式的占位符"
    echo "  - 轮换已暴露的凭证"
fi

if [ "$HIGH_COUNT" -gt 0 ]; then
    echo "- 🟠 **尽快处理**: 发现 $HIGH_COUNT 个高风险问题"
    echo "  - 审查数据库连接串的安全性"
    echo "  - 确保 JWT Secret 通过环境变量注入"
fi

if [ "$TOTAL_ISSUES_FOUND" -eq 0 ]; then
    echo "- 🎉 **太棒了！** 当前未发现明显的敏感信息泄露"
    echo "  - 建议定期运行此扫描（如每周一次）"
    echo "  - 将此工具集成到 CI/CD 流水线"
fi
)

---

## 🔧 修复指南

### 1. OAuth 凭证泄露
\`\`\`typescript
// ❌ 错误：硬编码
const config = {
  clientId: 'real-client-id-here',
  clientSecret: 'real-secret-here',
}

// ✅ 正确：环境变量注入
const config = {
  clientId: process.env.OAUTH_CLIENT_ID || '[CLIENT_ID]',
  clientSecret: process.env.OAUTH_CLIENT_SECRET || '[CLIENT_SECRET]',
}
\`\`\`

### 2. 数据库连接串
\`\`\`bash
# ❌ 错误：包含密码
DATABASE_URL="postgresql://user:password123@localhost:5432/db"

# ✅ 正确：使用环境变量
DATABASE_URL="postgresql://user:\${DB_PASSWORD}@localhost:5432/db"
\`\`\`

---

**报告生成完成**: $(date)
EOF

    log_info "报告已生成: $report_file"
}

# ==================== 主程序 ====================

main() {
    # 解析参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            --strict)
                STRICT_MODE=true
                shift
                ;;
            --report)
                GENERATE_REPORT=true
                shift
                ;;
            --fix)
                log_warning "--fix 功能尚未实现（实验性）"
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                TARGET_DIR="$1"
                shift
                ;;
        esac
    done
    
    # 验证目标目录
    if [ ! -d "$TARGET_DIR" ]; then
        log_error "目录不存在: $TARGET_DIR"
        exit 2
    fi
    
    echo ""
    echo "========================================="
    echo "  AgentPit Security Scanner v1.0.0"
    echo "========================================="
    echo ""
    log_info "扫描目标: $TARGET_DIR"
    log_info "严格模式: $STRICT_MODE"
    echo ""
    
    # 开始扫描
    log_info "开始扫描..."
    echo ""
    
    while IFS= read -r -d '' file; do
        # 排除目录
        local relative_path="${file#$TARGET_DIR/}"
        local dir_name=$(dirname "$relative_path")
        
        if is_excluded_dir "$dir_name"; then
            continue
        fi
        
        scan_file "$file"
    done < <(find "$TARGET_DIR" -type f \( -name "*.md" -o -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" -o -name "*.vue" -o -name "*.json" -o -name "*.yaml" -o -name "*.yml" -o -name "*.env*" -o -name "*.example" \) -print0 2>/dev/null)
    
    # 输出统计
    echo ""
    echo "========================================="
    echo "  扫描结果汇总"
    echo "========================================="
    echo ""
    echo "📁 扫描文件数: $TOTAL_FILES_SCANNED"
    echo "🔍 发现问题数: $TOTAL_ISSUES_FOUND"
    echo ""
    echo "按严重程度分布:"
    echo "  🔴 严重 (CRITICAL):  $CRITICAL_COUNT"
    echo "  🟠 高风险 (HIGH):    $HIGH_COUNT"
    echo "  🟡 中风险 (MEDIUM):   $MEDIUM_COUNT"
    echo "  🔵 低风险 (LOW):     $LOW_COUNT"
    echo ""
    
    # 生成报告（如果请求）
    if [ "$GENERATE_REPORT" = true ]; then
        generate_report
    fi
    
    # 清理临时文件
    rm -f "$ISSUES_FILE"
    
    # 返回适当的退出码
    if [ "$CRITICAL_COUNT" -gt 0 ]; then
        echo ""
        log_error "❌ 发现严重安全问题！请立即修复！"
        exit 2
    elif [ "$TOTAL_ISSUES_FOUND" -gt 0 ] && [ "$STRICT_MODE" = true ]; then
        echo ""
        log_warning "⚠️  发现安全问题（严格模式下视为失败）"
        exit 1
    elif [ "$TOTAL_ISSUES_FOUND" -gt 0 ]; then
        echo ""
        log_warning "⚠️  发现一些问题，建议尽快修复"
        exit 1
    else
        echo ""
        log_success "✅ 安全扫描通过！未发现敏感信息泄露。"
        exit 0
    fi
}

main "$@"
```

### 脚本使用说明

#### 基本用法
```bash
# 赋予执行权限
chmod +x security-scan.sh

# 扫描当前目录
./security-scan.sh

# 扫描指定目录
./security-scan.sh ./src

# 严格模式（任何问题都返回非零退出码）
./security-scan.sh --strict

# 生成详细报告
./security-scan.sh --report > report.md
```

#### CI/CD 集成示例

```yaml
# GitHub Actions 示例
name: Security Scan
on: [push, pull_request]
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Security Scanner
        run: |
          chmod +x skills/security/security-scan.sh
          ./skills/security/security-scan.sh --strict --report
```

---

## 4. 日志脱敏工具函数（Log Masking Utilities）

### TypeScript 工具函数库

```typescript
/**
 * 日志脱敏工具函数
 * 
 * 用途：在记录日志时自动遮蔽敏感信息
 * 
 * 支持的脱敏策略：
 * - prefix: 显示前 N 位，其余遮蔽
 * - suffix: 显示后 N 位，其余遮蔽
 * - middle: 首尾各显示 N 位，中间遮蔽
 * - full: 完全遮蔽（仅显示 ****）
 */

type MaskStrategy = 'prefix' | 'suffix' | 'middle' | 'full'

interface MaskOptions {
  strategy?: MaskStrategy
  visibleChars?: number
  maskChar?: string
}

/**
 * 脱敏单个字符串值
 */
export function maskSensitive(
  value: string,
  options: MaskOptions = {}
): string {
  const {
    strategy = 'suffix',
    visibleChars = 4,
    maskChar = '*'
  } = options
  
  if (!value || value.length <= visibleChars * 2 && strategy !== 'full') {
    return maskChar.repeat(Math.min(value.length || 4, 8))
  }
  
  switch (strategy) {
    case 'prefix':
      return value.slice(0, visibleChars) + maskChar.repeat(value.length - visibleChars)
    
    case 'suffix':
      return maskChar.repeat(value.length - visibleChars) + value.slice(-visibleChars)
    
    case 'middle':
      return value.slice(0, visibleChars) + maskChar.repeat(value.length - visibleChars * 2) + value.slice(-visibleChars)
    
    case 'full':
    default:
      return maskChar.repeat(8) // 固定显示 8 个 *
  }
}

/**
 * 脱敏 URL 中的查询参数
 */
export function maskUrlQueryParams(url: string, paramsToMask: string[] = []): string {
  try {
    const urlObj = new URL(url)
    
    // 默认遮蔽常见敏感参数
    const sensitiveParams = new Set([
      'token', 'access_token', 'refresh_token',
      'api_key', 'apikey', 'key', 'secret',
      'password', 'passwd', 'credential',
      ...paramsToMask,
    ])
    
    sensitiveParams.forEach(param => {
      if (urlObj.searchParams.has(param)) {
        urlObj.searchParams.set(param, maskSensitive(urlObj.searchParams.get(param)!))
      }
    })
    
    return urlObj.toString()
  } catch {
    return url // 如果不是有效 URL，原样返回
  }
}

/**
 * 递归脱敏 JSON 对象中的深层字段
 */
export function maskJsonObject<T extends Record<string, any>>(
  obj: T,
  fieldsToMask: string[] = ['password', 'secret', 'token', 'apiKey', 'creditCard']
): T {
  const masked = { ...obj }
  
  for (const key of Object.keys(masked)) {
    if (fieldsToMask.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
      if (typeof masked[key] === 'string') {
        masked[key] = maskSensitive(masked[key])
      }
    } else if (typeof masked[key] === 'object' && masked[key] !== null && !Array.isArray(masked[key])) {
      masked[key] = maskJsonObject(masked[key], fieldsToMask)
    }
  }
  
  return masked
}

/**
 * 创建安全的日志记录器包装器
 */
export function createSecureLogger(originalLogger: Console) {
  return {
    log: (...args: any[]) => originalLogger.log(...args.map(arg => 
      typeof arg === 'string' ? maskSensitiveInString(arg) : maskJsonObject(arg)
    )),
    error: (...args: any[]) => originalLogger.error(...args),
    warn: (...args: any[]) => originalLogger.warn(...args),
  }
}

function maskSensitiveInString(str: string): string {
  // 简单的关键词匹配（生产环境应使用更完整的正则）
  const patterns = [
    /client_secret["']?\s*[:=]\s*["']([^"']+)["']/gi,
    /password["']?\s*[:=]\s*["']([^"']+)["']/gi,
    /token["']?\s*[:=]\s*["']([^"']{10,})["']/gi,
  ]
  
  let result = str
  for (const pattern of patterns) {
    result = result.replace(pattern, (match, captured) => 
      match.replace(captured, maskSensitive(captured))
    )
  }
  
  return result
}
```

### 使用示例

```typescript
// 基础字符串脱敏
maskSensitive('sk-abc123def45678901234567890123456789012345678901234')
// 输出: '****************************************901234'

// 自定义策略
maskSensitive('my-secret-token-value', { strategy: 'prefix', visibleChars: 3 })
// 输出: 'my*********************'

// URL 参数脱敏
maskUrlQueryParams('https://api.example.com?token=abc123&name=test')
// 输出: 'https://api.example.com?token=********&name=test'

// JSON 对象脱敏
const userData = {
  username: 'john_doe',
  password: 'super_secret_password',
  email: 'john@example.com',
  profile: {
    apiKey: 'sk-real-api-key-here'
  }
}

console.log(maskJsonObject(userData))
// 输出:
// {
//   username: 'john_doe',
//   password: '************************',
//   email: 'john@example.com',
//   profile: {
//     apiKey: '*******************here'
//   }
// }

// 创建安全日志记录器
const secureLogger = createSecureLogger(console)
secureLogger.log('User login:', { token: 'abc123', userId: 123 })
// 输出: User login: { token: '******', userId: 123 }
```

---

## 5. 环境变量安全管理规范（Environment Variable Guidelines）

### 命名规范

#### 命名约定
- 使用大写字母和下划线：`MY_VARIABLE_NAME`
- 按功能分组前缀：
  - `AGENTPIT_*` - AgentPit 平台相关
  - `DATABASE_*` - 数据库连接
  - `OAUTH_*` - OAuth 认证
  - `FEATURE_*` - 功能开关
  - `LOG_*` - 日志配置

#### 安全级别分类

| 级别 | 示例 | 存储 | 是否提交 Git |
|------|------|------|-------------|
| 🔴 机密 | CLIENT_SECRET, DB_PASSWORD | .env.local (gitignored) | ❌ 绝不提交 |
| 🟠 敏感 | API_BASE_URL (内网), WEBHOOK_SECRET | .env.staging (gitignored) | ❌ 不提交 |
| 🟡 配置 | PORT, NODE_ENV, LOG_LEVEL | .env.development (可提交) | ✅ 可提交 |
| 🔵 公开 | NEXT_PUBLIC_* (客户端) | 代码中硬编码或 .env.example | ✅ 可提交 |

### 多环境分离策略

```
.env.local           # 本地开发（个人，不提交）
.env.development     # 开发团队共享（可提交，无真实密钥）
.env.staging         # 预发布环境（CI/CD 注入）
.env.production      # 生产环境（CI/CD 注入或密钥管理服务）
.env.skills.template  # 技能模板（可提交，全占位符）
```

### 最佳实践示例

#### ✅ 正确做法

```typescript
// 使用环境变量（推荐）
const config = {
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/app',
    poolSize: parseInt(process.env.DB_POOL_SIZE || '10'),
  },
  oauth: {
    clientId: process.env.OAUTH_CLIENT_ID || '[CLIENT_ID]',
    clientSecret: process.env.OAUTH_CLIENT_SECRET || '[CLIENT_SECRET]',
  },
  features: {
    enableBeta: process.env.FEATURE_BETA === 'true',
  }
}
```

#### ❌ 错误做法

```typescript
// 硬编码凭证（绝对禁止）
const config = {
  oauth: {
    clientId: '1234567890abcdefghijklmnopqrstuvwxyz', // 危险！
    clientSecret: 'my-super-secret-key-that-should-not-be-here', // 危险！
  }
}
```

### Git 配置建议

```gitignore
# .gitignore 中必须包含
.env.local
.env.*.local
.env.production
.env.staging

# 允许提交模板文件
!.env.example
!.env.skills.template
```

### 环境变量验证

```typescript
// env.ts - 环境变量验证工具
interface EnvConfig {
  required: string[]
  optional: Record<string, string>
}

function validateEnv(config: EnvConfig): void {
  const missingVars: string[] = []
  
  for (const varName of config.required) {
    if (!process.env[varName]) {
      missingVars.push(varName)
    }
  }
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }
  
  // 设置默认值
  for (const [varName, defaultValue] of Object.entries(config.optional)) {
    if (!process.env[varName]) {
      process.env[varName] = defaultValue
    }
  }
}

// 应用启动时验证
validateEnv({
  required: [
    'DATABASE_URL',
    'OAUTH_CLIENT_ID',
    'OAUTH_CLIENT_SECRET',
  ],
  optional: {
    NODE_ENV: 'development',
    LOG_LEVEL: 'info',
    PORT: '3000',
  }
})
```

---

## 6. 快速参考卡（Quick Reference）

### 常用命令速查

| 操作 | 命令 |
|------|------|
| 运行安全扫描 | `./security-scan.sh` |
| 严格模式扫描 | `./security-scan.sh --strict` |
| 生成报告 | `./security-scan.sh --report` |
| 扫描指定目录 | `./security-scan.sh ./src` |

### 脱敏函数速查

| 函数 | 用途 | 返回值示例 |
|------|------|-----------|
| `maskSensitive(str)` | 字符串脱敏 | `'****value'` |
| `maskUrlQueryParams(url)` | URL 参数脱敏 | `'...?token=****'` |
| `maskJsonObject(obj)` | 对象递归脱敏 | `{ password: '******' }` |
| `createSecureLogger(console)` | 创建安全日志器 | 自动脱敏输出的 logger |

### 占位符格式标准

| 格式 | 使用场景 | 示例 |
|------|---------|------|
| `[UPPER_CASE_NAME]` | 通用占位符 | `[CLIENT_ID]`, `[API_KEY]` |
| `process.env.XXX` | 代码引用 | `process.env.DB_URL` |
| `<your-value-here>` | 文档/注释 | `<your-secret-here>` |

---

## 7. 故障排除（Troubleshooting）

### 常见问题

#### Q1: 扫描脚本报权限错误
```bash
# 解决方案：赋予执行权限
chmod +x security-scan.sh
```

#### Q2: 误报太多，影响效率
```bash
# 方案 1：添加白名单模式到 WHITELIST_PATTERNS 数组
# 方案 2：使用 --report 生成报告后手动审核
# 方案 3：对于确定的误报，在代码中使用 [PLACEHOLDER] 格式
```

#### Q3: Windows 环境无法直接运行 Shell 脚本
```powershell
# 使用 Git Bash 或 WSL 运行
# 或转换为 PowerShell 脚本（需要自行转换）
```

#### Q4: 日志脱敏影响性能
```typescript
// 仅在生产环境启用完整脱敏
const shouldMaskLogs = process.env.NODE_ENV === 'production'

export function safeLog(...args: any[]) {
  if (shouldMaskLogs) {
    console.log(...args.map(arg => 
      typeof arg === 'string' ? maskSensitiveInString(arg) : arg
    ))
  } else {
    console.log(...args)
  }
}
```

---

## 版本信息

- **版本**: v1.0.0
- **最后更新**: 2026-04-10
- **维护者**: AgentPit Security Team
- **许可证**: 与 AgentPit 项目保持一致

---

## 相关资源

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Secrets Scanning](https://docs.github.com/code-security/secret-scanning)
- [GitLeaks](https://github.com/gitleaks/gitleaks) - 更专业的秘密扫描工具参考
