# Checklist

- [x] ConfigManager.get_config_dir() 方法已正确修改，优先检测 src/deepresearch/.config
- [x] 配置目录优先级顺序正确：自定义 > 环境变量 > src/deepresearch/.config > 默认 config
- [x] 当 src/deepresearch/.config 不存在时能正确回退到原有逻辑
- [x] 配置文件变更监听机制已实现
- [x] 使用 watchdog 监控配置目录文件变更
- [x] 检测到变更时自动清除缓存并重新加载配置
- [x] 多个配置目录共存时优先级正确，不会发生冲突
- [x] 不会覆盖或删除原有配置文件
- [x] 向后兼容性保持，原有配置加载逻辑仍然有效
- [x] 配置加载准确性测试通过，不同场景下都能正确加载
- [x] 配置变更后自动重新加载功能正常工作
- [x] 自动加载后的配置是最新值，内存中的配置已正确更新
