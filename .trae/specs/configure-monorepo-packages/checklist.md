# daoApps Monorepo 包配置 - 验证检查清单

## 包路径验证
- [x] DeepResearch 目录存在有效的 pyproject.toml 文件
- [x] flexloop 目录存在有效的 pyproject.toml 文件
- [x] 包名称配置正确（DeepResearch 包名为 "DeepResearch"，flexloop 包名为 "taolib"）
- [x] 包路径格式正确（使用 `file:///${PROJECT_ROOT}/` 格式）

## 配置完整性检查
- [x] `[tool.pdm.dev-dependencies]` 部分已添加本地包配置
- [x] 使用 `-e` 可编辑模式
- [x] 路径指向正确的工具目录
- [x] TOML 语法验证通过
- [x] 配置符合 PDM monorepo 最佳实践

## 依赖关系检查
- [x] 根项目能够正确解析包依赖
- [x] 包之间的依赖关系配置正确
- [x] 可编辑模式配置正确
