import { ref, computed } from 'vue';

export type DetectedLanguage = 'zh' | 'en' | 'unknown';

export function useLanguageDetection() {
  const detectedLanguage = ref<DetectedLanguage>('unknown');
  const confidence = ref(0);

  /**
   * 检测文本语言（基于字符范围判断）
   */
  const detectLanguage = (text: string): { language: DetectedLanguage; confidence: number } => {
    if (!text || !text.trim()) {
      detectedLanguage.value = 'unknown';
      confidence.value = 0;
      return { language: 'unknown', confidence: 0 };
    }

    let chineseChars = 0;
    let englishChars = 0;
    let totalChars = 0;

    for (const char of text) {
      const code = char.charCodeAt(0);

      // 中文字符范围：CJK 统一汉字
      if (
        (code >= 0x4e00 && code <= 0x9fff) ||
        (code >= 0x3400 && code <= 0x4dbf) ||
        (code >= 0x20000 && code <= 0x2a6df) ||
        (code >= 0x2a700 && code <= 0x2b73f) ||
        (code >= 0xf900 && code <= 0xfaff)
      ) {
        chineseChars++;
        totalChars++;
      }
      // 英文字符
      else if (
        (code >= 0x0041 && code <= 0x005a) || // A-Z
        (code >= 0x0061 && code <= 0x007a) || // a-z
        code === 0x0020
      ) {
        // 空格
        englishChars++;
        totalChars++;
      }
      // 其他字符（标点、数字等）不计入统计但计入总数用于计算比例
      else if (code !== 0x000d && code !== 0x000a && code !== 0x0009) {
        totalChars++;
      }
    }

    if (totalChars === 0) {
      detectedLanguage.value = 'unknown';
      confidence.value = 0;
      return { language: 'unknown', confidence: 0 };
    }

    const zhRatio = chineseChars / totalChars;
    const enRatio = englishChars / totalChars;

    let language: DetectedLanguage;
    let conf: number;

    if (zhRatio > enRatio && zhRatio > 0.1) {
      language = 'zh';
      conf = Math.min(zhRatio * 1.5, 1);
    } else if (enRatio > zhRatio && enRatio > 0.3) {
      language = 'en';
      conf = Math.min(enRatio, 1);
    } else if (chineseChars === 0 && englishChars > 0) {
      language = 'en';
      conf = Math.min(enRatio, 1);
    } else if (englishChars === 0 && chineseChars > 0) {
      language = 'zh';
      conf = Math.min(zhRatio * 1.5, 1);
    } else {
      language = 'unknown';
      conf = Math.max(zhRatio, enRatio) * 0.5;
    }

    detectedLanguage.value = language;
    confidence.value = conf;

    return { language, confidence: conf };
  };

  /**
   * 获取语言显示名称
   */
  const languageLabel = computed(() => {
    switch (detectedLanguage.value) {
      case 'zh':
        return '中文';
      case 'en':
        return 'English';
      default:
        return '未知';
    }
  });

  /**
   * 获取语言图标/Emoji
   */
  const languageIcon = computed(() => {
    switch (detectedLanguage.value) {
      case 'zh':
        return '🇨🇳';
      case 'en':
        return '🇺🇸';
      default:
        return '❓';
    }
  });

  /**
   * 判断是否应该使用英文回复
   */
  const shouldReplyInEnglish = (): boolean => {
    return detectedLanguage.value === 'en' && confidence.value > 0.5;
  };

  return {
    detectedLanguage,
    confidence,
    languageLabel,
    languageIcon,
    detectLanguage,
    shouldReplyInEnglish
  };
}
