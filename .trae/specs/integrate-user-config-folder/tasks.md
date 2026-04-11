# Tasks
- [x] Task 1: 修改配置目录查找逻辑，优先检测 src/deepresearch/.config
  - [x] 修改 base.py 中 ConfigManager.get_config_dir() 方法
  - [x] 在环境变量之后添加对 src/deepresearch/.config 的检测
  - [x] 确保优先级：自定义 > 环境变量 > src/deepresearch/.config > 默认 config
- [x] Task 2: 实现配置文件变更监听机制
  - [x] 在 base.py 中添加文件系统监听功能
  - [x] 使用 watchdog 库监控配置目录文件变更
  - [x] 检测到变更时自动清除缓存并重新加载配置
- [x] Task 3: 处理配置冲突情况
  - [x] 确保当多个配置目录都存在时优先级正确
  - [x] 验证文件不存在时能够正确回退
  - [x] 不会覆盖或删除原有配置文件
- [x] Task 4: 验证配置加载准确性
  - [x] 创建测试用例验证配置目录检测逻辑
  - [x] 测试不同场景下配置加载是否正确
  - [x] 验证优先级顺序是否符合预期
- [x] Task 5: 验证自动识别和热加载功能
  - [x] 测试配置文件变更后是否自动重新加载
  - [x] 验证加载的配置是否是最新值
  - [x] 检查内存中的配置是否正确更新

# Task Dependencies
- [Task 1] 没有依赖，可以独立执行
- [Task 2] 依赖 [Task 1] 完成
- [Task 3] 依赖 [Task 1] 完成
- [Task 4] 依赖 [Task 1, Task 3] 完成
- [Task 5] 依赖 [Task 1, Task 2] 完成
