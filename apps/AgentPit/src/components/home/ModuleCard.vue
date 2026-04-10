<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';

interface Props {
  id: string;
  title: string;
  description: string;
  icon: string;
  routePath: string;
  color?: string;
  badge?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  color: '#6366f1',
  badge: undefined
});

const router = useRouter();
const isHovered = ref(false);
const showRipple = ref(false);
const rippleX = ref(0);
const rippleY = ref(0);

const iconMap: Record<string, any> = {
  Wallet: defineAsyncComponent(() => import('@/components/icons/IconWallet.vue')),
  Build: defineAsyncComponent(() => import('@/components/icons/IconBuild.vue')),
  Chat: defineAsyncComponent(() => import('@/components/icons/IconChat.vue')),
  Users: defineAsyncComponent(() => import('@/components/icons/IconUsers.vue')),
  ShoppingCart: defineAsyncComponent(() => import('@/components/icons/IconShoppingCart.vue')),
  UsersCog: defineAsyncComponent(() => import('@/components/icons/IconUsersCog.vue')),
  Database: defineAsyncComponent(() => import('@/components/icons/IconDatabase.vue')),
  UserCog: defineAsyncComponent(() => import('@/components/icons/IconUserCog.vue')),
  Cpu: defineAsyncComponent(() => import('@/components/icons/IconCpu.vue')),
  LifeRing: defineAsyncComponent(() => import('@/components/icons/IconLifeRing.vue')),
  Cog: defineAsyncComponent(() => import('@/components/icons/IconCog.vue'))
};

const IconComponent = computed(() => iconMap[props.icon]);

const handleMouseEnter = () => {
  isHovered.value = true;
};

const handleMouseLeave = () => {
  isHovered.value = false;
};

const handleClick = (event: MouseEvent) => {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  rippleX.value = event.clientX - rect.left;
  rippleY.value = event.clientY - rect.top;
  showRipple.value = true;

  setTimeout(() => {
    showRipple.value = false;
    router.push(props.routePath);
  }, 300);
};
</script>

<template>
  <div
    class="module-card"
    :class="{ 'card-hover': isHovered }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
  >
    <div class="hexagon">
      <div class="card-content">
        <Transition name="icon-fade" mode="out-in">
          <div :key="props.id" class="icon-wrapper">
            <component :is="IconComponent" class="module-icon" />
          </div>
        </Transition>

        <h3 class="module-title">{{ title }}</h3>
        <p class="module-description">{{ description }}</p>

        <Transition name="hint-fade">
          <div v-if="isHovered" class="hover-hint">点击进入 →</div>
        </Transition>

        <span v-if="badge" class="module-badge">
          {{ badge }}
        </span>
      </div>

      <Transition name="ripple">
        <div
          v-if="showRipple"
          class="ripple-effect"
          :style="{ left: `${rippleX}px`, top: `${rippleY}px` }"
        />
      </Transition>
    </div>

    <div class="glow-effect" />
  </div>
</template>

<style scoped>
.module-card {
  --card-color: v-bind('props.color');
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.hexagon {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1.15;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  background: linear-gradient(
    135deg,
    var(--card-color) 0%,
    color-mix(in srgb, var(--card-color) 60%, black) 100%
  );
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-content {
  position: absolute;
  inset: 8%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: inherit;
  clip-path: polygon(50% 2%, 96% 26%, 96% 74%, 50% 98%, 4% 74%, 4% 26%);
}

.icon-wrapper {
  width: 56px;
  height: 56px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.module-card:hover .icon-wrapper {
  transform: scale(1.1) rotate(3deg);
  background: rgba(255, 255, 255, 0.25);
}

.module-icon {
  width: 32px;
  height: 32px;
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.module-title {
  font-size: 14px;
  font-weight: 700;
  color: white;
  margin: 4px 0 2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

.module-description {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  opacity: 0.95;
  line-height: 1.3;
}

.hover-hint {
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  color: #fbbf24;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  white-space: nowrap;
}

.module-badge {
  position: absolute;
  top: 8%;
  right: 8%;
  min-width: 24px;
  height: 24px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ef4444;
  color: white;
  font-size: 11px;
  font-weight: 700;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
}

.glow-effect {
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, var(--card-color), transparent, var(--card-color));
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  opacity: 0;
  filter: blur(15px);
  z-index: -1;
  transition: opacity 0.3s ease;
}

.card-hover {
  transform: translateY(-8px) scale(1.05);
}

.card-hover .glow-effect {
  opacity: 0.6;
}

.card-hover .hexagon {
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.3);
}

.ripple-effect {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%) scale(0);
  animation: ripple 0.6s ease-out;
  pointer-events: none;
  z-index: 10;
}

@keyframes ripple {
  to {
    transform: translate(-50%, -50%) scale(8);
    opacity: 0;
  }
}

.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: all 0.3s ease;
}

.icon-fade-enter-from {
  opacity: 0;
  transform: scale(0.8) rotate(-10deg);
}

.icon-fade-leave-to {
  opacity: 0;
  transform: scale(1.2) rotate(10deg);
}

.hint-fade-enter-active {
  transition: all 0.25s ease-out;
}

.hint-fade-leave-active {
  transition: all 0.2s ease-in;
}

.hint-fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

.hint-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-5px);
}

.ripple-enter-active {
  animation: ripple 0.6s ease-out;
}
</style>
