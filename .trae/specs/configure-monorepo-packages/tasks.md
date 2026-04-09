# daoApps Monorepo 包配置 - 实现计划

## [ ] 任务 1: 验证包路径和配置
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 验证 DeepResearch 和 flexloop 目录是否存在有效的 pyproject.toml 文件
  - 确认包的名称和版本配置
- **Acceptance Criteria Addressed**: 需求 2 (包路径验证)
- **Test Requirements**:
  - `programmatic` TR-1.1: 验证 DeepResearch 目录存在 pyproject.toml 文件
  - `programmatic` TR-1.2: 验证 flexloop 目录存在 pyproject.toml 文件
  - `human-judgment` TR-1.3: 检查包名称和版本配置是否正确
- **Notes**: 确保路径正确，包名称与配置一致

## [ ] 任务 2: 更新根项目 pyproject.toml 配置
- **Priority**: P0
- **Depends On**: 任务 1
- **Description**: 
  - 在 `[tool.pdm.dev-dependencies]` 中添加 DeepResearch 和 flexloop 作为本地可编辑包
  - 使用 `-e` 可编辑模式和 `file:///${PROJECT_ROOT}/` 路径格式
- **Acceptance Criteria Addressed**: 需求 1 (Monorepo 包配置)
- **Test Requirements**:
  - `programmatic` TR-2.1: 验证配置语法正确
  - `human-judgment` TR-2.2: 检查路径格式和包名称是否正确
- **Notes**: 参考 pdm-example-monorepo 的配置格式

## [ ] 任务 3: 验证配置完整性
- **Priority**: P1
- **Depends On**: 任务 2
- **Description**: 
  - 验证 TOML 语法正确性
  - 确保所有配置项完整
- **Acceptance Criteria Addressed**: 需求 3 (依赖关系管理)
- **Test Requirements**:
  - `programmatic` TR-3.1: 验证 TOML 文件语法正确
  - `human-judgment` TR-3.2: 检查配置项是否完整
- **Notes**: 确保配置符合 PDM 要求
