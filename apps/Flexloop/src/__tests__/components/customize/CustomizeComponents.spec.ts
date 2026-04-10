import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import {
  avatarLibrary,
  themeColors,
  abilities,
  agentTemplates,
  sampleAgents,
  defaultAgentConfig,
  categories,
  abilityPresets,
  analyticsData
} from '../../data/mockCustomize';

describe('mockCustomize 数据完整性', () => {
  it('应包含 32 个预设头像', () => {
    expect(avatarLibrary.length).toBe(32);
    avatarLibrary.forEach((avatar) => {
      expect(avatar).toHaveProperty('id');
      expect(avatar).toHaveProperty('emoji');
      expect(avatar).toHaveProperty('category');
      expect(avatar).toHaveProperty('name');
      expect(['person', 'animal', 'abstract', 'tech', 'nature', 'food']).toContain(avatar.category);
    });
  });

  it('应包含 12 种颜色主题配置', () => {
    expect(themeColors.length).toBe(12);
    themeColors.forEach((theme) => {
      expect(theme).toHaveProperty('id');
      expect(theme).toHaveProperty('name');
      expect(theme).toHaveProperty('primary');
      expect(theme).toHaveProperty('secondary');
      expect(theme).toHaveProperty('accent');
      expect(theme).toHaveProperty('background');
      expect(/^#[0-9A-Fa-f]{6}$/.test(theme.primary)).toBe(true);
    });
  });

  it('应包含 17 种能力/技能定义', () => {
    expect(abilities.length).toBe(17);
    abilities.forEach((ability) => {
      expect(ability).toHaveProperty('id');
      expect(ability).toHaveProperty('name');
      expect(ability).toHaveProperty('description');
      expect(ability).toHaveProperty('category');
      expect(['conversation', 'creative', 'analysis', 'tool', 'multimodal']).toContain(
        ability.category
      );
      expect(ability).toHaveProperty('defaultParams');
      expect(typeof ability.defaultParams).toBe('object');
    });
  });

  it('应包含 8 个智能体模板', () => {
    expect(agentTemplates.length).toBe(8);
    agentTemplates.forEach((template) => {
      expect(template).toHaveProperty('id');
      expect(template).toHaveProperty('name');
      expect(template).toHaveProperty('icon');
      expect(template.recommendedAbilities).toBeDefined();
      expect(Array.isArray(template.recommendedAbilities)).toBe(true);
    });
  });

  it('应包含 5-8 个已创建的智能体示例数据', () => {
    expect(sampleAgents.length).toBeGreaterThanOrEqual(5);
    expect(sampleAgents.length).toBeLessThanOrEqual(10);
    sampleAgents.forEach((agent) => {
      expect(agent).toHaveProperty('id');
      expect(agent).toHaveProperty('name');
      expect(agent).toHaveProperty('status');
      expect(['published', 'draft', 'disabled', 'reviewing']).toContain(agent.status);
      expect(agent.config).toBeDefined();
      expect(agent.stats).toBeDefined();
    });
  });

  it('默认配置应包含完整的结构', () => {
    expect(defaultAgentConfig).toHaveProperty('basicInfo');
    expect(defaultAgentConfig).toHaveProperty('appearance');
    expect(defaultAgentConfig).toHaveProperty('abilities');
    expect(defaultAgentConfig).toHaveProperty('businessModel');
    expect(defaultAgentConfig.basicInfo.tags).toEqual([]);
    expect(typeof defaultAgentConfig.appearance.fontSize).toBe('number');
  });

  it('分类选项应完整', () => {
    expect(categories.length).toBe(7);
    expect(categories.map((c) => c.value)).toContain('assistant');
    expect(categories.map((c) => c.value)).toContain('creative');
  });

  it('能力预设模板应有效', () => {
    expect(abilityPresets.length).toBe(4);
    abilityPresets.forEach((preset) => {
      expect(preset.abilities.length).toBeGreaterThan(0);
      preset.abilities.forEach((abilityId) => {
        const ability = abilities.find((a) => a.id === abilityId);
        expect(ability).toBeDefined();
      });
    });
  });

  it('分析统计数据结构正确', () => {
    expect(analyticsData).toHaveProperty('overview');
    expect(analyticsData).toHaveProperty('callTrend');
    expect(analyticsData).toHaveProperty('userSource');
    expect(analyticsData).toHaveProperty('topQuestions');
    expect(analyticsData.overview.todayCalls).toBeGreaterThan(0);
    expect(analyticsData.callTrend.length).toBeGreaterThan(0);
    expect(analyticsData.feedbacks.length).toBeGreaterThan(0);
    expect(analyticsData.performance.successRate).toBeGreaterThan(0);
  });
});

describe('技能依赖关系验证', () => {
  it('上下文记忆依赖对话理解', () => {
    const contextMemory = abilities.find((a) => a.id === 'context-memory');
    expect(contextMemory?.dependencies).toContain('conversation-understanding');
  });

  it('情感识别依赖对话理解', () => {
    const emotion = abilities.find((a) => a.id === 'emotion-recognition');
    expect(emotion?.dependencies).toContain('conversation-understanding');
  });

  it('内容摘要依赖对话理解', () => {
    const summarization = abilities.find((a) => a.id === 'summarization');
    expect(summarization?.dependencies).toContain('conversation-understanding');
  });

  it('创意写作依赖文本创作', () => {
    const creativeWriting = abilities.find((a) => a.id === 'creative-writing');
    expect(creativeWriting?.dependencies).toContain('text-generation');
  });
});

describe('智能体状态分布', () => {
  it('应至少有一个已发布的智能体', () => {
    const publishedCount = sampleAgents.filter((a) => a.status === 'published').length;
    expect(publishedCount).toBeGreaterThan(0);
  });

  it('应至少有一个草稿状态智能体', () => {
    const draftCount = sampleAgents.filter((a) => a.status === 'draft').length;
    expect(draftCount).toBeGreaterThan(0);
  });
});
