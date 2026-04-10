<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ModuleCard from '@/components/home/ModuleCard.vue';
import MainLayout from '@/components/layout/MainLayout.vue';
import { coreModules, extraModules } from '@/data/mockHome';

const isLoaded = ref(false);

const mainTitle = 'AgentPit 智能体平台';
const titleChars = computed(() => mainTitle.split(''));

const subtitle = '打造您的自动赚钱平台 ✨';
const secondaryTitle = '更多精彩功能 🌟';

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
});

const statistics = ref([
  { label: '活跃用户', value: '1,234', color: '#6366f1' },
  { label: '智能体数量', value: '567', color: '#10b981' },
  { label: '交易额', value: '89K', color: '#3b82f6' },
  { label: '系统可用性', value: '99.9%', color: '#f59e0b' }
]);
</script>

<template>
  <MainLayout>
    <div class="home-page">
      <!-- 背景渐变和装饰 -->
      <div class="bg-gradient" />
      <div class="bg-decoration">
        <div class="decoration-circle circle-1" />
        <div class="decoration-circle circle-2" />
        <div class="decoration-circle circle-3" />
      </div>

      <!-- 主内容区域 -->
      <div class="main-content">
        <!-- Hero Section -->
        <section class="hero-section" :class="{ 'hero-visible': isLoaded }">
          <h1 class="hero-title">
            <TransitionGroup name="stagger" tag="span" appear>
              <span
                v-for="(char, index) in titleChars"
                :key="index"
                class="title-char"
                :style="{ animationDelay: `${index * 50}ms` }"
              >
                {{ char }}
              </span>
            </TransitionGroup>
          </h1>

          <p class="hero-subtitle">{{ subtitle }}</p>

          <div class="divider-line" />
        </section>

        <!-- 核心模块网格 -->
        <section class="modules-section">
          <TransitionGroup name="card-list" appear tag="div" class="modules-grid">
            <ModuleCard
              v-for="(module, index) in coreModules"
              :key="module.id"
              v-bind="module"
              :style="{ animationDelay: `${index * 100}ms` }"
            />
          </TransitionGroup>
        </section>

        <!-- 额外功能模块 -->
        <section class="extra-modules-section" :class="{ 'extra-visible': isLoaded }">
          <h2 class="section-title">{{ secondaryTitle }}</h2>

          <TransitionGroup
            name="card-list"
            appear
            tag="div"
            class="modules-grid modules-grid-small"
          >
            <ModuleCard
              v-for="(module, index) in extraModules"
              :key="module.id"
              v-bind="module"
              :style="{ animationDelay: (coreModules.length + index) * 100 + 'ms' }"
            />
          </TransitionGroup>
        </section>

        <!-- 统计数据 -->
        <section class="statistics-section" :class="{ 'stats-visible': isLoaded }">
          <div class="stats-grid">
            <div
              v-for="(stat, index) in statistics"
              :key="stat.label"
              class="stat-card"
              :style="{
                animationDelay: `${(coreModules.length + extraModules.length + index) * 80}ms`
              }"
            >
              <div class="stat-value" :style="{ color: stat.color }">
                {{ stat.value }}
              </div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </section>

        <!-- 底部提示 -->
        <footer class="footer-hint" :class="{ 'footer-visible': isLoaded }">
          <p>点击任意模块开始您的智能体之旅 →</p>
        </footer>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.home-page {
  position: relative;
  min-height: calc(100vh - 64px);
  overflow: hidden;
}

/* 背景渐变 */
.bg-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1e1b4b 0%, #581c87 50%, #1e40af 100%);
  z-index: 0;
}

/* 装饰性圆圈 */
.bg-decoration {
  position: absolute;
  inset: 0;
  opacity: 0.3;
  z-index: 1;
  pointer-events: none;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  animation: pulse-glow 4s ease-in-out infinite;
}

.circle-1 {
  top: 10%;
  left: 5%;
  width: 280px;
  height: 280px;
  background: #3b82f6;
  animation-delay: 0s;
}

.circle-2 {
  top: 25%;
  right: 8%;
  width: 300px;
  height: 300px;
  background: #a855f7;
  animation-delay: 1s;
}

.circle-3 {
  bottom: 15%;
  left: 45%;
  width: 260px;
  height: 260px;
  background: #ec4899;
  animation-delay: 2s;
}

@keyframes pulse-glow {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.05);
  }
}

/* 主内容 */
.main-content {
  position: relative;
  z-index: 10;
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 24px;
  box-sizing: border-box;
}

/* Hero Section */
.hero-section {
  text-align: center;
  margin-bottom: 48px;
  opacity: 0;
  transform: translateY(-20px);
  transition: all 1s ease-out;
}

.hero-visible {
  opacity: 1;
  transform: translateY(0);
}

.hero-title {
  font-size: clamp(28px, 5vw, 52px);
  font-weight: 800;
  color: white;
  margin-bottom: 16px;
  line-height: 1.2;
  display: inline-block;
}

.title-char {
  display: inline-block;
  background: linear-gradient(135deg, #fbbf24 0%, #f472b6 50%, #0ea5e9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
}

.hero-subtitle {
  font-size: clamp(16px, 2.5vw, 22px);
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-bottom: 24px;
  line-height: 1.4;
}

.divider-line {
  width: 120px;
  height: 3px;
  margin: 0 auto;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  border-radius: 2px;
}

/* 模块网格 */
.modules-section {
  margin-bottom: 48px;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 32px 24px;
  padding: 16px 0;
}

.modules-grid-small {
  max-width: 900px;
  margin: 0 auto;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
}

/* 额外模块区域 */
.extra-modules-section {
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  margin-bottom: 48px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease-out 0.7s;
}

.extra-visible {
  opacity: 1;
  transform: translateY(0);
}

.section-title {
  font-size: 26px;
  font-weight: 700;
  color: white;
  text-align: center;
  margin-bottom: 32px;
}

/* 统计数据 */
.statistics-section {
  margin-bottom: 40px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease-out 1s;
}

.stats-visible {
  opacity: 1;
  transform: translateY(0);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.stat-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  opacity: 0;
  animation: slideInUp 0.5s ease-out forwards;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
}

.stat-value {
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 800;
  margin-bottom: 8px;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 500;
  line-height: 1.2;
}

/* 底部提示 */
.footer-hint {
  text-align: center;
  padding: 24px 0;
  opacity: 0;
  transform: translateY(20px);
  transition: all 1s ease-out 1.2s;
}

.footer-visible {
  opacity: 1;
  transform: translateY(0);
}

.footer-hint p {
  color: rgba(255, 255, 255, 0.65);
  font-size: 14px;
  font-weight: 500;
}

/* 动画定义 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* TransitionGroup 动画类 */
.stagger-enter-active {
  animation: fadeInUp 0.6s ease-out forwards;
}

.card-list-enter-active {
  animation: slideInUp 0.5s ease-out forwards;
}

.card-list-leave-active {
  animation: slideOutDown 0.3s ease-in forwards;
}

@keyframes slideOutDown {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
}

/* 响应式设计 */
@media (max-width: 1280px) {
  .main-content {
    padding: 40px 24px;
  }
}

@media (max-width: 1024px) {
  .modules-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 28px 20px;
  }

  .main-content {
    padding: 36px 20px;
  }

  .hero-title {
    font-size: clamp(24px, 4vw, 42px);
  }

  .hero-subtitle {
    font-size: clamp(14px, 2vw, 20px);
  }
}

@media (max-width: 768px) {
  .modules-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px 16px;
  }

  .modules-grid-small {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .stat-value {
    font-size: 28px;
  }

  .main-content {
    padding: 24px 16px;
  }

  .hero-section {
    margin-bottom: 36px;
  }

  .extra-modules-section {
    margin-bottom: 36px;
  }

  .hero-title {
    font-size: clamp(20px, 5vw, 32px);
  }

  .hero-subtitle {
    font-size: clamp(12px, 2.5vw, 18px);
  }

  .section-title {
    font-size: 22px;
  }
}

@media (max-width: 480px) {
  .modules-grid,
  .modules-grid-small {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .hero-title {
    font-size: clamp(18px, 6vw, 28px);
  }

  .hero-subtitle {
    font-size: clamp(11px, 3vw, 16px);
  }

  .section-title {
    font-size: 20px;
  }

  .stat-value {
    font-size: 24px;
  }

  .stat-label {
    font-size: 12px;
  }
}

/* 浏览器兼容性修复 */
@supports not (aspect-ratio: 1 / 1.15) {
  .hexagon {
    height: 0;
    padding-bottom: 115%;
  }
}

/* 确保颜色混合在旧浏览器中正常工作 */
@supports not (color-mix(in srgb, var(--card-color) 60%, black)) {
  .hexagon {
    background: linear-gradient(
      135deg,
      var(--card-color) 0%,
      #000 100%
    );
  }
}
</style>
