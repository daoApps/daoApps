import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 技能文件路径 - 使用绝对路径
const skillsDir = join(__dirname, '../../../skills');

describe('Skills Integration Tests', () => {
  describe('Skill Naming Consistency', () => {
    it('should use consistent naming pattern (agentpit-*)', () => {
      const skillDirectories = fs.readdirSync(skillsDir).filter(dir => 
        fs.statSync(join(skillsDir, dir)).isDirectory() && 
        dir !== 'security' // 排除安全目录
      );

      skillDirectories.forEach(dir => {
        expect(dir).toMatch(/^agentpit-/, `Skill directory ${dir} should use agentpit-* naming pattern`);
      });
    });

    it('should have user-invocable: true in SKILL.md', () => {
      const skillDirectories = fs.readdirSync(skillsDir).filter(dir => 
        fs.statSync(join(skillsDir, dir)).isDirectory() && 
        dir !== 'security'
      );

      skillDirectories.forEach(dir => {
        const skillMdPath = join(skillsDir, dir, 'SKILL.md');
        if (fs.existsSync(skillMdPath)) {
          const content = fs.readFileSync(skillMdPath, 'utf8');
          expect(content).toContain('user-invocable: true', `SKILL.md in ${dir} should have user-invocable: true`);
        }
      });
    });
  });

  describe('SSO Skill', () => {
    it('should have correct OAuth endpoints', () => {
      const ssoSkillPath = join(skillsDir, 'agentpit-sso', 'SKILL.md');
      if (fs.existsSync(ssoSkillPath)) {
        const content = fs.readFileSync(ssoSkillPath, 'utf8');
        
        // 检查端点实现
        expect(content).toContain('app/api/auth/agentpit/callback/route.ts');
        expect(content).toContain('app/api/auth/agentpit/token/route.ts');
        expect(content).toContain('app/api/auth/agentpit/sso/route.ts');
        
        // 检查环境变量使用
        expect(content).toContain('AGENTPIT_CLIENT_ID');
        expect(content).toContain('AGENTPIT_CLIENT_SECRET');
        
        // 检查防循环机制
        expect(content).toContain('防循环重定向机制');
      }
    });
  });

  describe('Tokens Skill', () => {
    it('should have correct token endpoints', () => {
      const tokensSkillPath = join(skillsDir, 'agentpit-tokens', 'SKILL.md');
      if (fs.existsSync(tokensSkillPath)) {
        const content = fs.readFileSync(tokensSkillPath, 'utf8');
        
        // 检查端点实现
        expect(content).toContain('app/api/agentpit/tokens/route.ts');
        expect(content).toContain('app/api/agentpit/tokens/stats/route.ts');
        
        // 检查 Prisma 模型
        expect(content).toContain('model TokenUsage');
        expect(content).toContain('userId');
        expect(content).toContain('model');
        expect(content).toContain('promptTokens');
        expect(content).toContain('completionTokens');
      }
    });
  });

  describe('Deploy Skill', () => {
    it('should have deploy script with proper configuration', () => {
      const deploySkillPath = join(skillsDir, 'agentpit-deploy', 'deploy.sh');
      if (fs.existsSync(deploySkillPath)) {
        const content = fs.readFileSync(deploySkillPath, 'utf8');
        
        // 检查脚本结构
        expect(content).toContain('check_local_env');
        expect(content).toContain('build_project');
        expect(content).toContain('check_server_env');
        expect(content).toContain('upload_files');
        expect(content).toContain('configure_nginx');
        expect(content).toContain('request_ssl');
        expect(content).toContain('verify_deployment');
      }
    });
  });

  describe('Security Skill', () => {
    it('should have security validation script', () => {
      const securitySkillPath = join(skillsDir, 'security', 'validate-security.sh');
      if (fs.existsSync(securitySkillPath)) {
        const content = fs.readFileSync(securitySkillPath, 'utf8');
        
        // 检查安全检测项目
        expect(content).toContain('明文 OAuth 凭证');
        expect(content).toContain('硬编码 API Key');
        expect(content).toContain('数据库连接串安全性');
        expect(content).toContain('JWT Secret 处理');
        expect(content).toContain('占位符格式一致性');
        expect(content).toContain('.gitignore 覆盖范围');
      }
    });
  });

  describe('Security Best Practices', () => {
    it('should use environment variables and placeholders', () => {
      const skillFiles = fs.readdirSync(skillsDir, { recursive: true })
        .filter(file => file.endsWith('.md') || file.endsWith('.ts'));

      skillFiles.forEach(file => {
        const filePath = join(skillsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 检查是否使用环境变量 - 忽略示例代码
        if (!content.includes('示例') && !content.includes('example') && !content.includes('危险！')) {
          expect(content).not.toContain('clientSecret: "', `File ${file} should not have hardcoded client secret`);
          expect(content).not.toContain('clientId: "', `File ${file} should not have hardcoded client id`);
        }
        
        // 只检查 SSO 技能文件的占位符
        if (file.includes('sso')) {
          expect(content).toContain('[CLIENT_ID]', `File ${file} should use [CLIENT_ID] placeholder`);
          expect(content).toContain('[CLIENT_SECRET]', `File ${file} should use [CLIENT_SECRET] placeholder`);
        }
      });
    });
  });
});
