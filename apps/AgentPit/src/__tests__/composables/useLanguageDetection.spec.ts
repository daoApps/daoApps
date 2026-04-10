import { describe, it, expect, beforeEach } from 'vitest'
import { useLanguageDetection } from '@/composables/useLanguageDetection'

describe('useLanguageDetection', () => {
  let languageDetection: ReturnType<typeof useLanguageDetection>

  beforeEach(() => {
    languageDetection = useLanguageDetection()
  })

  describe('Initial State', () => {
    it('should initialize with unknown language', () => {
      expect(languageDetection.detectedLanguage.value).toBe('unknown')
    })

    it('should initialize with zero confidence', () => {
      expect(languageDetection.confidence.value).toBe(0)
    })
  })

  describe('detectLanguage', () => {
    describe('Empty Text', () => {
      it('should return unknown for empty string', () => {
        const result = languageDetection.detectLanguage('')
        expect(result.language).toBe('unknown')
        expect(result.confidence).toBe(0)
        expect(languageDetection.detectedLanguage.value).toBe('unknown')
        expect(languageDetection.confidence.value).toBe(0)
      })

      it('should return unknown for whitespace only', () => {
        const result = languageDetection.detectLanguage('   ')
        expect(result.language).toBe('unknown')
        expect(result.confidence).toBe(0)
      })

      it('should return unknown for tabs and newlines', () => {
        const result = languageDetection.detectLanguage('\t\n\r')
        expect(result.language).toBe('unknown')
        expect(result.confidence).toBe(0)
      })
    })

    describe('Chinese Text', () => {
      it('should detect pure Chinese text', () => {
        const result = languageDetection.detectLanguage('你好世界')
        expect(result.language).toBe('zh')
        expect(result.confidence).toBeGreaterThan(0)
        expect(languageDetection.detectedLanguage.value).toBe('zh')
      })

      it('should detect Chinese with punctuation', () => {
        const result = languageDetection.detectLanguage('你好，世界！')
        expect(result.language).toBe('zh')
        expect(result.confidence).toBeGreaterThan(0)
      })

      it('should detect Chinese with numbers', () => {
        const result = languageDetection.detectLanguage('你好123世界')
        expect(result.language).toBe('zh')
        expect(result.confidence).toBeGreaterThan(0)
      })

      it('should detect Chinese when Chinese ratio is higher', () => {
        const result = languageDetection.detectLanguage('你好你好你好你好world')
        expect(result.language).toBe('zh')
        expect(result.confidence).toBeGreaterThan(0)
      })

      it('should detect single Chinese character', () => {
        const result = languageDetection.detectLanguage('好')
        expect(result.language).toBe('zh')
        expect(result.confidence).toBeGreaterThan(0)
      })

      it('should detect CJK Unified Ideographs Extension A', () => {
        const result = languageDetection.detectLanguage('㐀㐁㐂')
        expect(result.language).toBe('zh')
        expect(result.confidence).toBeGreaterThan(0)
      })

      it('should detect CJK Compatibility Ideographs', () => {
        const result = languageDetection.detectLanguage('豈更車')
        expect(result.language).toBe('zh')
        expect(result.confidence).toBeGreaterThan(0)
      })
    })

    describe('English Text', () => {
      it('should detect pure English text', () => {
        const result = languageDetection.detectLanguage('Hello World')
        expect(result.language).toBe('en')
        expect(result.confidence).toBeGreaterThan(0)
        expect(languageDetection.detectedLanguage.value).toBe('en')
      })

      it('should detect English with punctuation', () => {
        const result = languageDetection.detectLanguage('Hello, World!')
        expect(result.language).toBe('en')
        expect(result.confidence).toBeGreaterThan(0)
      })

      it('should detect English with numbers', () => {
        const result = languageDetection.detectLanguage('Hello 123 World')
        expect(result.language).toBe('en')
        expect(result.confidence).toBeGreaterThan(0)
      })

      it('should detect mixed English and Chinese when English is dominant', () => {
        const result = languageDetection.detectLanguage('Hello 你好 World')
        expect(result.language).toBe('en')
        expect(result.confidence).toBeGreaterThan(0)
      })

      it('should detect single English word', () => {
        const result = languageDetection.detectLanguage('Hi')
        expect(result.language).toBe('en')
        expect(result.confidence).toBeGreaterThan(0)
      })

      it('should detect uppercase English', () => {
        const result = languageDetection.detectLanguage('HELLO WORLD')
        expect(result.language).toBe('en')
        expect(result.confidence).toBeGreaterThan(0)
      })

      it('should detect mixed case English', () => {
        const result = languageDetection.detectLanguage('hElLo WoRlD')
        expect(result.language).toBe('en')
        expect(result.confidence).toBeGreaterThan(0)
      })
    })

    describe('Mixed or Unknown Text', () => {
      it('should return en for mixed text with more English', () => {
        const result = languageDetection.detectLanguage('Hello Hello 你好')
        expect(result.language).toBe('en')
      })

      it('should return en for very low Chinese ratio', () => {
        const result = languageDetection.detectLanguage('Hello world and test 你')
        expect(result.language).toBe('en')
      })

      it('should handle non-Chinese non-English text', () => {
        const result = languageDetection.detectLanguage('مرحبا بالعالم')
        expect(result.language).toBeDefined()
      })

      it('should return unknown for emoji only', () => {
        const result = languageDetection.detectLanguage('😀🎉🚀')
        expect(result.language).toBe('unknown')
      })

      it('should return unknown for symbols only', () => {
        const result = languageDetection.detectLanguage('@#$%^&*')
        expect(result.language).toBe('unknown')
      })
    })

    describe('Confidence Scores', () => {
      it('should have higher confidence for pure Chinese', () => {
        const result = languageDetection.detectLanguage('你好世界')
        expect(result.confidence).toBeGreaterThan(0.5)
      })

      it('should have higher confidence for pure English', () => {
        const result = languageDetection.detectLanguage('Hello world')
        expect(result.confidence).toBeGreaterThan(0.5)
      })

      it('should have lower confidence for mixed text', () => {
        const result = languageDetection.detectLanguage('你好Hello')
        expect(result.confidence).toBeLessThan(0.8)
      })

      it('should cap confidence at 1', () => {
        const result = languageDetection.detectLanguage('你好世界你好世界你好世界')
        expect(result.confidence).toBeLessThanOrEqual(1)
      })
    })
  })

  describe('Computed Properties', () => {
    describe('languageLabel', () => {
      it('should return 中文 for zh', () => {
        languageDetection.detectLanguage('你好')
        expect(languageDetection.languageLabel.value).toBe('中文')
      })

      it('should return English for en', () => {
        languageDetection.detectLanguage('Hello')
        expect(languageDetection.languageLabel.value).toBe('English')
      })

      it('should return 未知 for unknown', () => {
        expect(languageDetection.languageLabel.value).toBe('未知')
      })
    })

    describe('languageIcon', () => {
      it('should return 🇨🇳 for zh', () => {
        languageDetection.detectLanguage('你好')
        expect(languageDetection.languageIcon.value).toBe('🇨🇳')
      })

      it('should return 🇺🇸 for en', () => {
        languageDetection.detectLanguage('Hello')
        expect(languageDetection.languageIcon.value).toBe('🇺🇸')
      })

      it('should return ❓ for unknown', () => {
        expect(languageDetection.languageIcon.value).toBe('❓')
      })
    })
  })

  describe('shouldReplyInEnglish', () => {
    it('should return true for English with high confidence', () => {
      languageDetection.detectLanguage('Hello world this is a test')
      expect(languageDetection.shouldReplyInEnglish()).toBe(true)
    })

    it('should return false for Chinese', () => {
      languageDetection.detectLanguage('你好世界')
      expect(languageDetection.shouldReplyInEnglish()).toBe(false)
    })

    it('should return false for unknown', () => {
      expect(languageDetection.shouldReplyInEnglish()).toBe(false)
    })
  })
})
