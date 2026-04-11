# DAO Apps

[![CI Pipeline](https://github.com/daoApps/daoApps/actions/workflows/ci.yml/badge.svg)](https://github.com/daoApps/daoApps/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/daoApps/daoApps)](https://github.com/daoApps/daoApps/blob/main/LICENSE)
![GitHub repo size](https://img.shields.io/github/repo-size/daoApps/daoApps)

> 基于《道德经》"道"的哲学思想，构建道法自然的智能化应用生态。

## 📖 项目概述

> **术语说明**：本项目中的 **DAO** **并非**指编程语言中常见的"数据访问对象"(Data Access Object)，而是源自**帛书版《道德经》**中"道"(DAO)这一核心哲学概念。项目名称以"道"为名，秉承"道法自然"的编程哲学。

**DAO Apps** 是一个基于 **monorepo** 架构的开源项目集合，旨在构建一个开放、可扩展，顺应自然之道的应用生态系统。项目汇集了多个独立的前端应用和 Python 工具库，秉承"道法自然"的设计理念，支持 AI 智能体协作、深度研究、社区互动、生活方式管理等多种场景。

### 哲学背景

"道"是道家哲学的核心范畴：
- **道法自然**：意味着顺应事物的本然规律，不强求、不造作
- **有无相生**：强调虚实结合、模块化设计的灵活性
- **万物生于有，有生于无**：倡导从简单出发，逐步演化生长
- **无为而治**：追求简洁优雅的设计，减少不必要的复杂性

### 项目愿景

- 🌐 **开放生态**：构建人人可参与的"道"系应用开发生态
- 🤖 **AI 原生**：深度集成大语言模型，打造智能协作体验
- 🧩 **模块化设计**：每个应用独立可部署，顺应有无相生的灵活性
- 🚀 **开发者友好**：使用现代技术栈，提供完整的开发工具链
- 💭 **道法自然**：秉承道家哲学，追求简洁自然的设计美学

## ✨ 核心功能

### 🎯 主应用模块

| 应用 | 描述 | 状态 |
|------|------|------|
| **Flexloop** | AI 智能体协作平台，支持多智能体任务分工、深度研究、Sphinx AI 网站生成 | ✅ 活跃开发 |
| **DaoMind** | "道"心智能治理核心框架，提供智能体注册、调度、反馈机制 | ✅ 核心框架 |
| **daoNexus** | 应用中心门户，展示所有可用应用，提供统一入口 | ✅ 基础完成 |
| **forum** | "道"社区论坛模块，支持话题讨论 | ✅ 开发中 |
| **config-center** | 集中配置管理中心，管理多应用配置和权限 | ✅ 开发中 |
| **oauth-admin** | OAuth 认证与管理员后台 | ✅ 开发中 |

### 🌟 生活方式应用

| 应用 | 描述 |
|------|------|
| **habit-tracker** | 习惯追踪应用，帮助养成良好习惯 |
| **moodflow** | 心情记录与情绪分析 |
| **time-capsule** | 时间胶囊，记录时光记忆 |
| **growth-tracker** | 个人成长追踪 |
| **xinyu** | 心语社区，分享生活感悟 |

### 🔧 工具与技能

- **DeepResearch** - 深度研究工具，支持 AI 驱动的系统性文献调研
- **flexloop (taolib)** - Python 工具库，提供「道法自然」编程哲学基础设施
- **daoSkills** - "道"技能注册表，支持技能市场和技能匹配

## 🛠 技术栈选型

### 前端技术

| 技术 | 版本 | 用途 |
|------|------|------|
| **Vue 3** | ^3.5.32 | 主框架（Flexloop）|
| **React** | ^18 | 部分应用框架 |
| **TypeScript** | ~6.0.2 | 类型系统 |
| **Vite** | ^8.0.4 | 构建工具 |
| **Tailwind CSS** | ^4.2.2 | CSS 框架 |
| **Pinia** | ^3.0.2 | 状态管理 |
| **Vue Router** | ^4.5.0 | 路由管理 |
| **Vitest** | ^2.1.8 | 单元测试 |
| **Playwright** | - | E2E 测试 |

### 后端/工具技术

| 技术 | 版本 | 用途 |
|------|------|------|
| **Python** | >= 3.14 | Python 工具开发 |
| **PDM** | latest | Python 包管理 |
| **Ruff** | ^0.6 | Python 代码检查 |
| **pytest** | ^8.3 | Python 测试框架 |
| **Sphinx** | ^8.2.3 | 文档生成 |

### 开发工具

- **ESLint** - 代码质量检查
- **Prettier** - 代码格式化
- **Husky** - Git 钩子管理
- **GitHub Actions** - CI/CD

## 📋 环境配置要求

### 开发环境

- **Node.js**: 20.x 或更高版本（推荐 24.x）
- **Python**: 3.14 或更高版本
- **包管理器**: npm 或 pnpm
- **PDM**: Python 依赖管理工具（推荐）
- **Git**: 版本控制

### 生产服务器

- **操作系统**: Ubuntu/Debian 或 CentOS/RHEL
- **内存**: 至少 2GB RAM（推荐 4GB+）
- **存储**: 至少 10GB 可用空间
- **网络**: 开放 22/80/443 端口
- **权限**: root 或 sudo 权限

## 🚀 安装与部署

### 本地开发部署

#### 1. 克隆仓库

```bash
git clone https://github.com/daoApps/daoApps.git
cd daoApps
git submodule update --init --recursive
```

#### 2. 安装前端依赖

```bash
# 进入 Flexloop 应用目录
cd apps/Flexloop
npm install
```

#### 3. 安装 Python 依赖（可选，用于工具开发）

```bash
# 回到项目根目录
cd ../..
pdm install
```

#### 4. 配置环境变量

```bash
# 复制环境变量模板
cd apps/Flexloop
cp .env.example .env.development
```

编辑 `.env.development`，根据需要修改配置。

#### 5. 启动开发服务器

```bash
npm run dev
```

开发服务器默认运行在 `http://localhost:5173`

### 生产部署

项目提供一键自动化部署脚本，支持部署到远程服务器。详细部署指南请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)。

#### 快速部署

```bash
# 1. 在目标服务器准备环境
scp scripts/deployment/prepare-server.sh root@your-server:/tmp/
ssh root@your-server
chmod +x /tmp/prepare-server.sh
sudo /tmp/prepare-server.sh
exit

# 2. 在本地配置部署环境
cp deploy/.env.production deploy/.env.production.local
nano deploy/.env.production.local  # 填写服务器信息

# 3. 执行一键部署
chmod +x deploy.sh
./deploy.sh
```

更多选项和故障排查请参阅 [DEPLOYMENT.md](./DEPLOYMENT.md)。

### Docker/Podman 部署（Flexloop）

Flexloop 支持容器化部署，详细请参考 [apps/Flexloop/README_PODMAN.md](./apps/Flexloop/README_PODMAN.md)

```bash
cd apps/Flexloop
./deploy-podman.sh
```

## 📖 使用指南

### Flexloop AI 智能体平台

Flexloop 是项目核心应用，提供以下功能：

1. **AI 聊天**: 与 AI 智能体对话交流
2. **智能协作**: 多个 AI 智能体分工协作完成复杂任务
3. **深度研究**: 集成 DeepResearch 工具进行系统性研究
4. **AI 建站 (Sphinx)**: 使用 AI 快速生成文档网站
5. **智能体市场**: 发现和分享第三方智能体
6. **记忆管理**: 持久化存储对话记忆和知识
7. **变现系统**: 支持智能体付费和提现
8. **社交功能**: 好友系统、社交匹配、协作空间

#### 启动 Flexloop

```bash
cd apps/Flexloop
npm run dev
# 访问 http://localhost:5173
```

### 其他应用启动

每个应用都是独立的 Vite 项目，进入对应目录后：

```bash
cd apps/<app-name>
npm install
npm run dev
```

### Python 工具使用

安装 PDM 环境后：

```bash
# 运行 Python 测试
pdm run test

# 代码检查
pdm run lint

# 格式化代码
pdm run format
```

## 📁 项目结构

```
daoApps/
├── apps/                    # 前端应用集合
│   ├── Flexloop/           # AI 智能体协作平台（核心）
│   │   ├── src/           # 源代码
│   │   ├── packages/      # 共享 UI 组件库
│   │   ├── skills/        # Skill 扩展
│   │   └── docs/          # 文档
│   ├── DaoMind/           # "道"心智能治理框架
│   ├── daoNexus/          # 应用中心门户
│   ├── forum/             # 社区论坛
│   ├── config-center/     # 配置中心
│   ├── oauth-admin/       # 认证管理后台
│   ├── habit-tracker/     # 习惯追踪
│   ├── moodflow/          # 心情记录
│   ├── time-capsule/      # 时间胶囊
│   ├── growth-tracker/    # 成长追踪
│   └── xinyu/             # 心语社区
├── skills/                 # "道"技能集合
│   └── daoSkilLs/         # "道"技能库
├── tools/                  # Python 工具库
│   ├── DeepResearch/      # 深度研究工具
│   └── flexloop/          # flexloop Python 库（taolib）
├── src/                    # 公共 Python 源代码
├── deploy/                 # 部署配置模板
├── scripts/                # 部署脚本
│   └── deployment/         # 自动化部署工具
├── .github/
│   └── workflows/          # GitHub Actions CI/CD
├── DEPLOYMENT.md           # 详细部署指南
├── pyproject.toml          # Python 项目配置
└── LICENSE                 # 许可证
```

## 🔌 API 接口说明

当前前端应用主要通过后端 API 服务进行数据交互。API 客户端定义在：

- **Flexloop API 客户端**: [apps/Flexloop/src/services/api/](./apps/Flexloop/src/services/api/)

主要端点分类：

| 模块 | 说明 |
|------|------|
| `chat.ts` | 聊天消息接口 |
| `home.ts` | 首页数据接口 |
| `sphinx.ts` | AI 网站生成接口 |
| `monetization.ts` | 支付变现接口 |

### 环境变量配置

Flexloop 使用以下环境变量：

```bash
# API 基础地址
VITE_API_BASE_URL=http://localhost:3000/api

# 其他配置...
```

详见 [apps/Flexloop/.env.example](./apps/Flexloop/.env.example)

## 🤝 贡献规范

我们欢迎任何形式的贡献！

### 开发流程

1. **Fork** 本仓库
2. **Clone** 你 fork 的仓库到本地
3. 创建新分支：`git checkout -b feature/your-feature-name` 或 `fix/issue-description`
4. 进行修改，保持代码风格一致
5. 运行测试和代码检查：
   ```bash
   # 前端代码检查
   cd apps/Flexloop
   npm run lint:check
   npm run format:check
   npm run type-check
   npm run test:run
   ```
   ```bash
   # Python 代码检查
   pdm run lint
   pdm run type-check
   pdm run test
   ```
6. 提交变更：`git commit -m "Add some feature"`
7. 推送到你的分支：`git push origin feature/your-feature-name`
8. 创建 **Pull Request**

### 代码风格

- **前端**: 使用 ESLint + Prettier，提交前会自动格式化（通过 Husky）
- **Python**: 使用 Ruff 格式化，遵循 PEP 8
- **提交信息**: 遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范

### 分支策略

- `main` - 主分支，对应生产环境
- `dev` - 开发分支，接受功能合并
- `feature/*` - 功能开发分支
- `fix/*` - 问题修复分支

### 报告问题

- 发现 Bug 请 [提交 Issue](https://github.com/daoApps/daoApps/issues)
- 请包含复现步骤、预期行为和实际行为
- 最好附上截图和环境信息

## 📄 许可证

本项目采用 [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) 开源许可证。

详见 [LICENSE](./LICENSE) 文件。

## 📬 联系方式与反馈

- **GitHub**: [github.com/daoApps/daoApps](https://github.com/daoApps/daoApps)
- **Issues**: [提交问题](https://github.com/daoApps/daoApps/issues)
- **作者**: [xinetzone](https://github.com/xinetzone) <735613050@qq.com>
- **维护者**: [xinetzone](https://github.com/xinetzone)

## 🙏 致谢

感谢所有为项目做出贡献的开发者！

---

⭐ 如果这个项目对你有帮助，请给我们一个 Star！
