# Tasks

- [x] Task 1: Update core configuration and HTML title
  - [x] Update `package.json`: change project name from "agent" to "flexloop"
  - [x] Update `index.html`: change page title to "Flexloop - 玄环"

- [x] Task 2: Update main page branding (HomePage.vue)
  - [x] Change main title from "AgentPit 智能体平台" to "Flexloop 玄环"
  - [x] Change subtitle from "打造您的自动赚钱平台 ✨" to "道法自然，柔性循环，智能共生 ✨"
  - [x] Update footer hint text if needed

- [x] Task 3: Update Header component branding
  - [x] Change default logoText prop from "AgentPit" to "Flexloop"
  - [x] Change tagline from "智能体协作平台" to "柔性循环智能平台"
  - [x] Update AP initials in logo box → FL (Flexloop)

- [x] Task 4: Update Footer component branding
  - [x] Change brand name from "AgentPit" to "Flexloop"
  - [x] Change description from "智能体协作平台，为您提供全方位的AI解决方案" to "柔性循环智能平台，循道而行，自然而然"
  - [x] Update copyright from "© {{ currentYear }} AgentPit. All rights reserved." to "© {{ currentYear }} Flexloop. All rights reserved."

- [x] Task 5: Update HelpCenter component
  - [x] Change version info copyright from "© 2026 AgentPit Team. All rights reserved." to "© 2026 Flexloop Team. All rights reserved."

- [x] Task 6: Update deployment scripts
  - [x] Update `deploy.sh`: replace all "AgentPit" with "Flexloop"
  - [x] Update `deploy.ps1`: replace all "AgentPit" with "Flexloop"
  - [x] Update `deploy-podman.sh`: replace all "AgentPit" with "Flexloop"
  - [x] Update `healthcheck.sh`: replace all "AgentPit" with "Flexloop"
  - [x] Update `init-container.sh`: replace all "AgentPit" with "Flexloop"
  - [x] Update `Podmanfile`: replace all "AgentPit" with "Flexloop"
  - [x] Update `podman-compose.yml`: replace all "AgentPit" with "Flexloop"
  - [x] Update `Makefile`: replace all "AgentPit" with "Flexloop"

- [x] Task 7: Update environment configuration files
  - [x] Update `.env.development`: change header comment to "Flexloop 开发环境配置"
  - [x] Update `.env.production.example`: change header comment to "Flexloop 生产环境配置模板"

- [x] Task 8: Update skills documentation
  - [x] Update `skills/agentpit-deploy/SKILL.md`: replace all "AgentPit" with "Flexloop"
  - [x] Update `skills/agentpit-deploy/deploy.sh`: replace all "AgentPit" with "Flexloop"
  - [x] Update `skills/agentpit-sso/SKILL.md`: replace all "AgentPit" with "Flexloop"
  - [x] Update `skills/agentpit-tokens/SKILL.md`: replace all "AgentPit" with "Flexloop"
  - [x] Update `skills/security/SKILL.md`: replace all "AgentPit" with "Flexloop"
  - [x] Update `skills/security/validate-security.sh`: replace all "AgentPit" with "Flexloop"

- [x] Task 9: Update project documentation
  - [x] Update `SECURITY_CHECKLIST.md`: replace all "AgentPit" with "Flexloop"
  - [x] Update `VALIDATION_CHECKLIST.md`: replace all "AgentPit" with "Flexloop"
  - [x] Update `docs/DEPLOYMENT_GUIDE.md`: replace all "AgentPit" with "Flexloop"
  - [x] Update all other docs in `docs/`: replace "AgentPit" with "Flexloop"
  - [x] Update `README.md` (if it contains AgentPit references)

- [x] Task 10: Verification - check all occurrences
  - [x] Search entire codebase for any remaining "AgentPit" occurrences
  - [x] Verify that all changes are consistent
  - [x] Run type check to ensure no compilation errors

# Task Dependencies

- All tasks after Task 1 can be executed in parallel
- Task 10 depends on all previous tasks being completed
