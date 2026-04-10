<#
.SYNOPSIS
    AgentPit Vue3 应用部署脚本（PowerShell 版本）
    用于 Podman 容器化部署

.DESCRIPTION
    功能完整的 Windows PowerShell 部署脚本，支持：
    - 部署 (deploy): 构建镜像并启动容器
    - 回滚 (rollback): 恢复到上一版本
    - 状态 (status): 显示容器运行状态
    - 清理 (clean): 清理未使用的资源
    - 备份: 自动备份当前镜像
    - 日志记录: 记录所有操作到 logs/deploy.log
    - 配置验证: 部署前检查必要文件
    - 参数化支持: 自定义端口、镜像名、环境等

.EXAMPLE
    .\deploy.ps1
    执行默认部署（生产环境，端口 8080）

.EXAMPLE
    .\deploy.ps1 -Environment development
    开发环境部署

.EXAMPLE
    .\deploy.ps1 -Port 3000 -ImageName myapp:v1
    自定义端口和镜像名部署

.EXAMPLE
    .\deploy.ps1 rollback
    回滚到上一版本

.EXAMPLE
    .\deploy.ps1 status
    查看容器运行状态

.EXAMPLE
    .\deploy.ps1 clean
    清理未使用的资源

.NOTES
    文件名:     deploy.ps1
    作者:       AgentPit Team
    兼容性:     PowerShell 5.1+ (Windows 10/11) 和 PowerShell 7+
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $false, HelpMessage = "自定义端口号")]
    [ValidateRange(1, 65535)]
    [int]$Port = 8080,

    [Parameter(Mandatory = $false, HelpMessage = "自定义镜像名称")]
    [string]$ImageName = "agentpit-vue3:latest",

    [Parameter(Mandatory = $false, HelpMessage = "选择环境: production 或 development")]
    [ValidateSet("production", "development")]
    [string]$Environment = "production",

    [Parameter(Mandatory = $false, HelpMessage = "要执行的命令: deploy, rollback, status, clean, help")]
    [ValidateSet("deploy", "rollback", "status", "clean", "help")]
    [string]$Command = "deploy"
)

# ============================================
# 错误处理配置
# ============================================
$ErrorActionPreference = "Stop"

# ============================================
# 全局配置变量
# ============================================
$Script:CONTAINER_NAME = "agentpit-frontend"
$Script:HEALTH_CHECK_URL = "http://localhost:${Port}/health"
$Script:MAX_WAIT_SECONDS = 30
$Script:WAIT_INTERVAL = 2
$Script:LOG_DIR = "logs"
$Script:LOG_FILE = Join-Path $Script:LOG_DIR "deploy.log"
$Script:BACKUP_TAG_FILE = ".last_backup_tag"

# ============================================
# 颜色定义函数（兼容 PS5.1 和 PS7+）
# ============================================
function Write-ColorOutput {
    param(
        [Parameter(Mandatory)]
        [string]$Message,

        [Parameter(Mandatory)]
        [ConsoleColor]$ForegroundColor
    )

    Write-Host $Message -ForegroundColor $ForegroundColor
}

function Write-Info {
    param([string]$Message)
    Write-ColorOutput -Message "[INFO] $Message" -ForegroundColor Cyan
    Write-Log -Level "INFO" -Message $Message
}

function Write-Success {
    param([string]$Message)
    Write-ColorOutput -Message "[SUCCESS] $Message" -ForegroundColor Green
    Write-Log -Level "SUCCESS" -Message $Message
}

function Write-WarningMsg {
    param([string]$Message)
    Write-Warning $Message
    Write-Log -Level "WARNING" -Message $Message
}

function Write-ErrorExit {
    param([string]$Message)
    Write-ColorOutput -Message "[ERROR] $Message" -ForegroundColor Red
    Write-Log -Level "ERROR" -Message $Message
    exit 1
}

# ============================================
# 日志记录函数
# ============================================
function Write-Log {
    param(
        [string]$Level,
        [string]$Message
    )

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"

    if (!(Test-Path $Script:LOG_DIR)) {
        New-Item -ItemType Directory -Path $Script:LOG_DIR -Force | Out-Null
    }

    Add-Content -Path $Script:LOG_FILE -Value $logEntry -Encoding UTF8
}

# ============================================
# 分隔线打印函数
# ============================================
function Write-Separator {
    Write-Host "=================================================="
}

# ============================================
# 显示帮助信息
# ============================================
function Show-Help {
    Write-Host ""
    Write-ColorOutput -Message "AgentPit 部署脚本帮助 (PowerShell)" -ForegroundColor Green
    Write-Host ""
    Write-Host "用法: .\deploy.ps1 [-选项] [-Command 命令]"
    Write-Host ""
    Write-Host "命令:"
    Write-Host "  deploy     执行完整部署流程（默认）"
    Write-Host "  rollback   回滚到上一版本"
    Write-Host "  status     显示容器运行状态"
    Write-Host "  clean      清理未使用的资源"
    Write-Host "  help       显示此帮助信息"
    Write-Host ""
    Write-Host "选项:"
    Write-Host "  -Port           自定义端口号（默认: 8080）"
    Write-Host "  -ImageName      自定义镜像名称（默认: agentpit-vue3:latest）"
    Write-Host "  -Environment    选择环境 production/development（默认: production）"
    Write-Host "  -Command        要执行的命令"
    Write-Host ""
    Write-Host "示例:"
    Write-Host "  .\deploy.ps1                          # 生产环境部署"
    Write-Host "  .\deploy.ps1 -Environment development  # 开发环境部署"
    Write-Host "  .\deploy.ps1 -Port 3000 -ImageName myapp:v1  # 自定义端口和镜像名"
    Write-Host "  .\deploy.ps1 -Command rollback         # 回滚到上一版本"
    Write-Host "  .\deploy.ps1 -Command status           # 查看状态"
    Write-Host "  .\deploy.ps1 -Command clean            # 清理资源"
    Write-Host ""
}

# ============================================
# 配置验证函数
# ============================================
function Validate-Configuration {
    Write-Separator
    Write-Info "验证配置文件..."
    Write-Separator

    $errors = 0

    if (!(Test-Path "Podmanfile")) {
        Write-ErrorExit "缺少 Podmanfile 文件！"
        $errors++
    } else {
        Write-Success "Podmanfile 存在"
    }

    if ($Environment -eq "production") {
        if (!(Test-Path ".env.production")) {
            Write-WarningMsg "生产环境文件 .env.production 不存在"
            if (!(Test-Path ".env.production.example")) {
                Write-ErrorExit "缺少 .env.production 和 .env.production.example 文件！"
                $errors++
            } else {
                Write-Info "找到 .env.production.example，请复制为 .env.production 并配置"
            }
        } else {
            Write-Success ".env.production 存在"
        }
    } else {
        if (!(Test-Path ".env.development")) {
            Write-ErrorExit "开发环境文件 .env.development 不存在！"
            $errors++
        } else {
            Write-Success ".env.development 存在"
        }
    }

    if (!(Test-Path "podman-compose.yml")) {
        Write-ErrorExit "缺少 podman-compose.yml 文件！"
        $errors++
    } else {
        Write-Success "podman-compose.yml 存在"
    }

    if (!(Test-Path "nginx.conf")) {
        Write-WarningMsg "nginx.conf 不存在，可能影响生产环境部署"
    } else {
        Write-Success "nginx.conf 存在"
    }

    if ($errors -gt 0) {
        Write-ErrorExit "配置验证失败，发现 ${errors} 个错误！请修复后重试。"
    }

    Write-Success "配置验证通过"
}

# ============================================
# 工具检查函数
# ============================================
function Test-PodmanInstalled {
    try {
        $version = podman --version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Podman 已安装: $version"
            return $true
        }
    } catch {
        # 忽略异常
    }
    
    Write-ErrorExit "Podman 未安装，请先安装 Podman"
    return $false
}

function Test-PodmanComposeInstalled {
    try {
        $result = podman-compose version 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Success "podman-compose 已安装"
            return $true
        }
    } catch {
        # 忽略异常
    }
    
    Write-ErrorExit "podman-compose 未安装，请先安装 podman-compose"
    return $false
}

function Test-CurlAvailable {
    try {
        $null = Get-Command curl -ErrorAction Stop
        return $true
    } catch {
        Write-WarningMsg "curl 未安装或不可用，健康检查功能将不可用"
        return $false
    }
}

# ============================================
# 备份机制
# ============================================
function Backup-CurrentImage {
    Write-Separator
    Write-Info "备份当前镜像..."
    Write-Separator

    $timestamp = Get-Date -Format "yyyyMMddHHmmss"
    $backupImageName = "${ImageName}-backup-${timestamp}"

    $imageExists = podman image exists $ImageName 2>&1
    if ($LASTEXITCODE -eq 0 -and $imageExists -match "true") {
        podman tag $ImageName $backupImageName | Out-Null
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "当前镜像已备份为: $backupImageName"
            
            # 保存最新备份标签用于回滚
            $backupImageName | Set-Content -Path $Script:BACKUP_TAG_FILE -Encoding UTF8
            Write-Log -Level "BACKUP" -Message "已创建备份: $backupImageName"
        } else {
            Write-WarningMsg "镜像备份失败，继续部署..."
        }
    } else {
        Write-Info "未找到现有镜像，跳过备份步骤"
    }
}

# ============================================
# 镜像构建函数
# ============================================
function Build-Image {
    Write-Separator
    Write-Info "开始构建 Docker 镜像..."
    Write-Separator

    $buildStartTime = Get-Date

    podman build -t $ImageName .

    if ($LASTEXITCODE -eq 0) {
        $buildEndTime = Get-Date
        $buildDuration = ($buildEndTime - $buildStartTime).TotalSeconds -as [int]
        Write-Success "镜像构建成功: $ImageName（耗时: $buildDuration 秒）"
        Write-Log -Level "BUILD" -Message "镜像构建成功: $ImageName, 耗时: ${buildDuration}s"
    } else {
        Write-ErrorExit "镜像构建失败！"
        Write-Log -Level "BUILD" -Message "镜像构建失败: $ImageName"
    }
}

# ============================================
# 容器管理函数
# ============================================
function Stop-OldContainer {
    Write-Separator
    Write-Info "检查并停止旧容器..."
    Write-Separator

    $containerList = podman ps -a --format "{{.Names}}" 2>&1
    if ($containerList -match "^$($Script:CONTAINER_NAME)$") {
        Write-WarningMsg "发现容器: $($Script:CONTAINER_NAME)"

        $containerStatus = podman inspect -f "{{.State.Status}}" $Script:CONTAINER_NAME 2>&1
        Write-Info "容器状态: $containerStatus"

        podman stop $Script:CONTAINER_NAME 2>&1 | Out-Null
        podman rm $Script:CONTAINER_NAME 2>&1 | Out-Null

        Write-Success "旧容器已停止并移除"
        Write-Log -Level "CONTAINER" -Message "已停止并移除旧容器: $($Script:CONTAINER_NAME)"
    } else {
        Write-Info "未发现运行中的旧容器"
    }
}

function Start-Container {
    Write-Separator
    Write-Info "启动新容器..."
    Write-Separator

    podman-compose --profile $Environment up -d

    if ($LASTEXITCODE -eq 0) {
        Write-Success "容器启动命令已执行"
        Write-Log -Level "CONTAINER" -Message "容器启动成功, 环境: $Environment"
    } else {
        Write-ErrorExit "容器启动失败！"
        Write-Log -Level "CONTAINER" -Message "容器启动失败"
    }
}

# ============================================
# 健康检查函数
# ============================================
function Wait-ForHealthy {
    Write-Separator
    Write-Info "等待应用启动并进行健康检查（最多 $($Script:MAX_WAIT_SECONDS) 秒）..."
    Write-Separator

    if (!(Test-CurlAvailable)) {
        Write-WarningMsg "curl 不可用，跳过健康检查"
        return
    }

    $elapsed = 0

    while ($elapsed -lt $Script:MAX_WAIT_SECONDS) {
        try {
            $response = Invoke-WebRequest -Uri $Script:HEALTH_CHECK_URL -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                Write-Success "应用已成功启动并通过健康检查！"
                Write-Log -Level "HEALTH" -Message "健康检查通过: $($Script:HEALTH_CHECK_URL)"
                return
            }
        } catch {
            # 继续等待
        }

        Write-Info "等待中... (${elapsed}/$($Script:MAX_WAIT_SECONDS) 秒)"
        Start-Sleep -Seconds $Script:WAIT_INTERVAL
        $elapsed += $Script:WAIT_INTERVAL
    }

    Write-ErrorExit "健康检查超时（$($Script:MAX_WAIT_SECONDS) 秒）！"
    Write-ErrorExit "请检查容器日志：podman logs $($Script:CONTAINER_NAME)"
    Write-Log -Level "HEALTH" -Message "健康检查超时 ($($Script:MAX_WAIT_SECONDS)s)"
}

# ============================================
# 回滚功能
# ============================================
function Invoke-Rollback {
    Write-Separator
    Write-ColorOutput -Message "              开始回滚操作              " -ForegroundColor Yellow
    Write-Separator

    if (!(Test-Path $Script:BACKUP_TAG_FILE)) {
        Write-ErrorExit "未找到备份记录文件 ($($Script:BACKUP_TAG_FILE))，无法回滚！"
        Write-ErrorExit "请确保之前已经执行过部署操作"
    }

    $backupImage = Get-Content -Path $Script:BACKUP_TAG_FILE -Raw -Encoding UTF8
    $backupImage = $backupImage.Trim()

    $imageCheck = podman image exists $backupImage 2>&1
    if ($LASTEXITCODE -ne 0 -or $imageCheck -notmatch "true") {
        Write-ErrorExit "备份镜像不存在: $backupImage"
        Write-ErrorExit "回滚失败！"
    }

    Write-Info "准备回滚到备份镜像: $backupImage"
    Write-WarningMsg "此操作将停止当前容器并使用备份镜像重启"

    $confirm = Read-Host "确认要回滚吗？(y/N)"
    if ($confirm -ne "y" -and $confirm -ne "Y") {
        Write-Info "回滚操作已取消"
        return
    }

    $rollbackStartTime = Get-Date

    Stop-OldContainer

    Write-Info "恢复备份镜像..."
    podman tag $backupImage $ImageName | Out-Null

    if ($LASTEXITCODE -ne 0) {
        Write-ErrorExit "镜像标签恢复失败！"
    }

    Start-Container
    Wait-ForHealthy

    $rollbackEndTime = Get-Date
    $rollbackDuration = ($rollbackEndTime - $rollbackStartTime).TotalSeconds -as [int]

    Write-Success "回滚完成！（耗时: $rollbackDuration 秒）"
    Write-Log -Level "ROLLBACK" -Message "成功回滚到: $backupImage, 耗时: ${rollbackDuration}s"

    Show-DeploymentStatus
}

# ============================================
# 状态显示功能
# ============================================
function Show-ContainerStatus {
    Write-Separator
    Write-ColorOutput -Message "              容器运行状态              " -ForegroundColor Cyan
    Write-Separator
    Write-Host ""

    $containerList = podman ps -a --format "{{.Names}}" 2>&1
    if ($containerList -notmatch "^$($Script:CONTAINER_NAME)$") {
        Write-WarningMsg "容器 $($Script:CONTAINER_NAME) 未找到"
        Write-Host ""
        Write-ColorOutput -Message "提示:" -ForegroundColor Cyan
        Write-Host "  使用 '.\deploy.ps1' 进行首次部署"
        Write-Host "  使用 '.\deploy.ps1 -Command status' 查看状态"
        Write-Host ""
        return
    }

    $containerInfo = podman inspect $Script:CONTAINER_NAME 2>&1
    
    if ([string]::IsNullOrWhiteSpace($containerInfo)) {
        Write-ErrorExit "无法获取容器信息"
        return
    }

    # 解析容器信息（PowerShell 方式）
    $containerData = $containerInfo | ConvertFrom-Json
    $status = $containerData.State.Status
    $image = $containerData.Config.Image
    $created = $containerData.Created
    $restartPolicy = $containerData.HostConfig.RestartPolicy.Name

    $portMapping = podman port $Script:CONTAINER_NAME 2>&1
    if ($LASTEXITCODE -ne 0) {
        $portMapping = "N/A"
    }

    Write-ColorOutput -Message "容器名称:   $($Script:CONTAINER_NAME)" -ForegroundColor Green
    Write-ColorOutput -Message "运行状态:   $status" -ForegroundColor Green
    Write-ColorOutput -Message "镜像名称:   $image" -ForegroundColor Green
    Write-ColorOutput -Message "端口映射:   $portMapping" -ForegroundColor Green
    Write-ColorOutput -Message "创建时间:   $created" -ForegroundColor Green
    Write-ColorOutput -Message "重启策略:   $restartPolicy" -ForegroundColor Green
    Write-Host ""

    if ($status -eq "running") {
        $healthStatus = Test-HealthStatus
        Write-ColorOutput -Message "健康状态:   $healthStatus" -ForegroundColor Green
    }

    Write-Host ""
    Write-ColorOutput -Message "资源使用情况:" -ForegroundColor Cyan
    podman stats --no-stream $Script:CONTAINER_NAME 2>&1 | Out-Host
    Write-Host ""

    Write-Log -Level "STATUS" -Message "查看容器状态: $($Script:CONTAINER_NAME), 状态: $status"
}

function Test-HealthStatus {
    if ((Test-CurlAvailable)) {
        try {
            $response = Invoke-WebRequest -Uri $Script:HEALTH_CHECK_URL -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                return "健康 ✓"
            }
        } catch {
            # 返回不健康
        }
    }
    return "不健康 ✗"
}

# ============================================
# 清理功能
# ============================================
function Clean-Resources {
    Write-Separator
    Write-ColorOutput -Message "              清理未使用的资源              " -ForegroundColor Yellow
    Write-Separator
    Write-Host ""

    Write-WarningMsg "此操作将清理以下资源："
    Write-Host "  - 停止的容器"
    Write-Host "  - 未使用的镜像（不包括正在使用的）"
    Write-Host "  - 未使用的卷"
    Write-Host "  - 未使用的网络"
    Write-Host ""

    $confirm = Read-Host "确认要清理吗？(y/N)"
    if ($confirm -ne "y" -and $confirm -ne "Y") {
        Write-Info "清理操作已取消"
        return
    }

    $cleanedContainers = 0
    $cleanedImages = 0
    $cleanedVolumes = 0
    $cleanedNetworks = 0

    Write-Host ""
    Write-Info "清理停止的容器..."
    $stoppedContainers = podman ps -aq -f status=exited -f status=created 2>&1
    if (![string]::IsNullOrWhiteSpace($stoppedContainers)) {
        foreach ($cid in ($stoppedContainers -split "`n")) {
            $cid = $cid.Trim()
            if (![string]::IsNullOrWhiteSpace($cid)) {
                podman rm $cid 2>&1 | Out-Null
                if ($LASTEXITCODE -eq 0) { $cleanedContainers++ }
            }
        }
        Write-Success "已清理 $cleanedContainers 个停止的容器"
    } else {
        Write-Info "没有需要清理的停止容器"
    }

    Write-Host ""
    Write-Info "清理未使用的镜像（dangling images）..."
    $danglingImages = podman images -f "dangling=true" -q 2>&1
    if (![string]::IsNullOrWhiteSpace($danglingImages)) {
        foreach ($iid in ($danglingImages -split "`n")) {
            $iid = $iid.Trim()
            if (![string]::IsNullOrWhiteSpace($iid)) {
                podman rmi $iid 2>&1 | Out-Null
                if ($LASTEXITCODE -eq 0) { $cleanedImages++ }
            }
        }
        Write-Success "已清理 $cleanedImages 个未使用的镜像"
    } else {
        Write-Info "没有需要清理的未使用镜像"
    }

    Write-Host ""
    Write-Info "清理未使用的卷..."
    $unusedVolumes = podman volume ls -q -f dangling=true 2>&1
    if (![string]::IsNullOrWhiteSpace($unusedVolumes)) {
        foreach ($vid in ($unusedVolumes -split "`n")) {
            $vid = $vid.Trim()
            if (![string]::IsNullOrWhiteSpace($vid)) {
                podman volume rm $vid 2>&1 | Out-Null
                if ($LASTEXITCODE -eq 0) { $cleanedVolumes++ }
            }
        }
        Write-Success "已清理 $cleanedVolumes 个未使用的卷"
    } else {
        Write-Info "没有需要清理的未使用卷"
    }

    Write-Host ""
    Write-Info "清理未使用的网络..."
    $unusedNetworks = podman network ls -q 2>&1 | Select-Object -First 10
    if (![string]::IsNullOrWhiteSpace($unusedNetworks)) {
        foreach ($nid in ($unusedNetworks -split "`n")) {
            $nid = $nid.Trim()
            if (![string]::IsNullOrWhiteSpace($nid)) {
                podman network rm $nid 2>&1 | Out-Null
                if ($LASTEXITCODE -eq 0) { $cleanedNetworks++ }
            }
        }
        Write-Success "已清理 $cleanedNetworks 个未使用的网络"
    } else {
        Write-Info "没有需要清理的未使用网络"
    }

    Write-Host ""
    Write-Success "资源清理完成！"
    Write-Log -Level "CLEAN" -Message "资源清理完成: 容器=$cleanedContainers, 镜像=$cleanedImages, 卷=$cleanedVolumes, 网络=$cleanedNetworks"
}

# ============================================
# 部署状态显示
# ============================================
function Show-DeploymentStatus {
    Write-Separator
    Write-ColorOutput -Message "              部署完成！              " -ForegroundColor Green
    Write-Separator
    Write-Host ""

    Write-ColorOutput -Message "访问地址:   http://localhost:$Port" -ForegroundColor Cyan
    Write-ColorOutput -Message "健康检查:   $($Script:HEALTH_CHECK_URL)" -ForegroundColor Cyan
    Write-ColorOutput -Message "环境类型:   $Environment" -ForegroundColor Cyan
    Write-ColorOutput -Message "镜像名称:   $ImageName" -ForegroundColor Cyan
    Write-Host ""

    Write-ColorOutput -Message "常用命令:" -ForegroundColor Cyan
    Write-Host "  查看日志：   podman logs -f $($Script:CONTAINER_NAME)"
    Write-Host "  查看状态：   .\deploy.ps1 -Command status"
    Write-Host "  停止服务：   podman-compose --profile $Environment down"
    Write-Host "  重启服务：   podman-compose --profile $Environment restart"
    Write-Host "  回滚版本：   .\deploy.ps1 -Command rollback"
    Write-Host "  清理资源：   .\deploy.ps1 -Command clean"
    Write-Host ""

    Write-Separator
}

# ============================================
# 主部署流程
# ============================================
function Invoke-Deployment {
    $deployStartTime = Get-Date

    Write-Host ""
    Write-ColorOutput -Message "============================================" -ForegroundColor Green
    Write-ColorOutput -Message "     AgentPit Vue3 应用自动部署脚本       " -ForegroundColor Green
    Write-ColorOutput -Message "============================================" -ForegroundColor Green
    Write-Host ""

    Write-ColorOutput -Message "部署配置:" -ForegroundColor Cyan
    Write-Host "  环境:       $Environment"
    Write-Host "  端口:       $Port"
    Write-Host "  镜像:       $ImageName"
    Write-Host "  容器名:     $($Script:CONTAINER_NAME)"
    Write-Host ""

    Write-Log -Level "DEPLOY" -Message "========== 开始部署 =========="
    Write-Log -Level "DEPLOY" -Message "环境: $Environment, 端口: $Port, 镜像: $ImageName"

    Validate-Configuration
    Test-PodmanInstalled
    Test-PodmanComposeInstalled
    Backup-CurrentImage
    Build-Image
    Stop-OldContainer
    Start-Container
    Wait-ForHealthy

    $deployEndTime = Get-Date
    $deployDuration = ($deployEndTime - $deployStartTime).TotalSeconds -as [int]

    Write-Log -Level "DEPLOY" -Message "========== 部署完成 =========="
    Write-Log -Level "DEPLOY" -Message "总耗时: ${deployDuration}s"

    Show-DeploymentStatus

    Write-Host ""
    Write-ColorOutput -Message "部署成功完成！（总耗时: $deployDuration 秒）" -ForegroundColor Green
    Write-Host ""
}

# ============================================
# 主入口点
# ============================================
try {
    switch ($Command) {
        "deploy" {
            Invoke-Deployment
        }
        "rollback" {
            Invoke-Rollback
        }
        "status" {
            Show-ContainerStatus
        }
        "clean" {
            Clean-Resources
        }
        "help" {
            Show-Help
        }
        default {
            Write-ErrorExit "未知命令: $Command"
            Show-Help
        }
    }
} catch {
    Write-ErrorExit "发生未预期的错误: $_"
}
