<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  abilities as allAbilities,
  abilityPresets,
  type AgentConfig
} from '../../data/mockCustomize';

interface Props {
  modelValue: AgentConfig['abilities'];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: AgentConfig['abilities']];
}>();

const enabledAbilities = ref<
  Record<string, { enabled: boolean; proficiency: number; params: Record<string, unknown> }>
>(JSON.parse(JSON.stringify(props.modelValue.enabledAbilities)));
const expandedCategories = ref<Set<string>>(new Set(['conversation']));
const selectedAbilityId = ref<string | null>(null);

const categoryLabels: Record<string, string> = {
  conversation: '对话能力',
  creative: '创作能力',
  analysis: '分析能力',
  tool: '工具调用',
  multimodal: '多模态'
};

const categoryIcons: Record<string, string> = {
  conversation: '💬',
  creative: '✍️',
  analysis: '📊',
  tool: '⚙️',
  multimodal: '🎭'
};

const groupedAbilities = computed(() => {
  const groups: Record<string, typeof allAbilities> = {};
  allAbilities.forEach((ability) => {
    if (!groups[ability.category]) groups[ability.category] = [];
    groups[ability.category].push(ability);
  });
  return groups;
});

const totalEnabled = computed(
  () => Object.values(enabledAbilities.value).filter((a) => a.enabled).length
);
const categoryCounts = computed(() => {
  const counts: Record<string, number> = {};
  Object.entries(enabledAbilities.value).forEach(([id, config]) => {
    if (config.enabled) {
      const ability = allAbilities.find((a) => a.id === id);
      if (ability) {
        counts[ability.category] = (counts[ability.category] || 0) + 1;
      }
    }
  });
  return counts;
});

const selectedAbility = computed(() => {
  if (!selectedAbilityId.value) return null;
  return allAbilities.find((a) => a.id === selectedAbilityId.value) || null;
});

const selectedAbilityConfig = computed(() => {
  if (!selectedAbilityId.value) return null;
  return enabledAbilities.value[selectedAbilityId.value] || null;
});

const isDependencyMet = (abilityId: string): boolean => {
  const ability = allAbilities.find((a) => a.id === abilityId);
  if (!ability?.dependencies?.length) return true;
  return ability.dependencies.every((dep) => enabledAbilities.value[dep]?.enabled === true);
};

const getUnmetDependencies = (abilityId: string): string[] => {
  const ability = allAbilities.find((a) => a.id === abilityId);
  if (!ability?.dependencies) return [];
  return ability.dependencies.filter((dep) => !enabledAbilities.value[dep]?.enabled);
};

const toggleCategory = (category: string) => {
  if (expandedCategories.value.has(category)) {
    expandedCategories.value.delete(category);
  } else {
    expandedCategories.value.add(category);
  }
};

const toggleAbility = (abilityId: string) => {
  if (!isDependencyMet(abilityId)) return;
  if (!enabledAbilities.value[abilityId]) {
    const ability = allAbilities.find((a) => a.id === abilityId);
    enabledAbilities.value[abilityId] = {
      enabled: true,
      proficiency: 70,
      params: ability ? { ...ability.defaultParams } : {}
    };
  } else {
    enabledAbilities.value[abilityId].enabled = !enabledAbilities.value[abilityId].enabled;
    if (enabledAbilities.value[abilityId].enabled && !selectedAbilityId.value) {
      selectedAbilityId.value = abilityId;
    }
  }
  emitUpdate();
};

const updateProficiency = (abilityId: string, value: number) => {
  if (enabledAbilities.value[abilityId]) {
    enabledAbilities.value[abilityId].proficiency = value;
    emitUpdate();
  }
};

const updateParam = (abilityId: string, paramKey: string, value: unknown) => {
  if (enabledAbilities.value[abilityId]) {
    enabledAbilities.value[abilityId].params[paramKey] = value;
    emitUpdate();
  }
};

const applyPreset = (presetId: string) => {
  const preset = abilityPresets.find((p) => p.id === presetId);
  if (!preset) return;
  allAbilities.forEach((ability) => {
    const isEnabled = preset.abilities.includes(ability.id);
    if (!enabledAbilities.value[ability.id]) {
      enabledAbilities.value[ability.id] = {
        enabled: isEnabled,
        proficiency: isEnabled ? 75 : 50,
        params: { ...ability.defaultParams }
      };
    } else {
      enabledAbilities.value[ability.id].enabled = isEnabled;
    }
  });
  emitUpdate();
};

const emitUpdate = () => {
  emit('update:modelValue', {
    enabledAbilities: { ...enabledAbilities.value },
    presetTemplate: undefined
  });
};

watch(
  () => props.modelValue,
  (val) => {
    enabledAbilities.value = JSON.parse(JSON.stringify(val.enabledAbilities));
  },
  { deep: true }
);

watch(selectedAbilityId, () => {
  if (selectedAbilityId.value) {
    expandedCategories.value.add(
      allAbilities.find((a) => a.id === selectedAbilityId.value)?.category || ''
    );
  }
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-semibold text-gray-800 dark:text-gray-200">技能树配置</h3>
      <span class="text-sm text-gray-500 dark:text-gray-400">
        已选择 <span class="font-bold text-blue-600 dark:text-blue-400">{{ totalEnabled }}</span> /
        {{ allAbilities.length }} 个技能
      </span>
    </div>

    <div class="flex gap-2 flex-wrap">
      <button
        v-for="preset in abilityPresets"
        :key="preset.id"
        type="button"
        class="px-3 py-1.5 rounded-full text-xs font-medium border transition-all hover:shadow-sm border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        @click="applyPreset(preset.id)"
      >
        {{ preset.icon }} {{ preset.name }}
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-3">
        <div
          v-for="(groupAbilities, category) in groupedAbilities"
          :key="category"
          class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
        >
          <button
            type="button"
            class="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
            :aria-expanded="expandedCategories.has(category)"
            @click="toggleCategory(category)"
          >
            <div class="flex items-center gap-2.5">
              <span class="text-lg">{{ categoryIcons[category] }}</span>
              <span class="font-medium text-gray-800 dark:text-gray-200">{{
                categoryLabels[category]
              }}</span>
              <span
                class="text-xs px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-500 dark:text-gray-400"
                >{{ groupAbilities.length }}</span
              >
              <span
                v-if="categoryCounts[category]"
                class="text-xs px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded font-medium"
              >
                {{ categoryCounts[category] }}
              </span>
            </div>
            <svg
              class="w-4 h-4 text-gray-400 transition-transform"
              :class="{ 'rotate-180': expandedCategories.has(category) }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <Transition name="expand">
            <div
              v-show="expandedCategories.has(category)"
              class="divide-y divide-gray-100 dark:divide-gray-700/50"
            >
              <div
                v-for="ability in groupAbilities"
                :key="ability.id"
                class="px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                :class="{ 'bg-blue-50/50 dark:bg-blue-900/10': selectedAbilityId === ability.id }"
                @click="selectedAbilityId = ability.id"
              >
                <div class="pt-0.5">
                  <button
                    type="button"
                    class="relative w-10 h-5.5 rounded-full transition-colors"
                    :class="
                      enabledAbilities[ability.id]?.enabled
                        ? 'bg-blue-500'
                        : isDependencyMet(ability.id)
                          ? 'bg-gray-300 dark:bg-gray-600'
                          : 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed opacity-60'
                    "
                    :disabled="!isDependencyMet(ability.id)"
                    :aria-label="`切换${ability.name}`"
                    :aria-checked="enabledAbilities[ability.id]?.enabled || false"
                    role="switch"
                    @click.stop="toggleAbility(ability.id)"
                  >
                    <span
                      class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform"
                      :class="{ 'translate-x-5': enabledAbilities[ability.id]?.enabled }"
                    ></span>
                  </button>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-base">{{ ability.icon }}</span>
                    <span class="font-medium text-sm text-gray-800 dark:text-gray-200">{{
                      ability.name
                    }}</span>
                    <span
                      v-if="ability.isPremium"
                      class="text-[10px] px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded font-medium"
                      >PRO</span
                    >
                  </div>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                    {{ ability.description }}
                  </p>
                  <div v-if="!isDependencyMet(ability.id)" class="mt-1 flex items-center gap-1">
                    <svg class="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span class="text-[10px] text-amber-600 dark:text-amber-400">
                      需要：{{
                        getUnmetDependencies(ability.id)
                          .map((d) => allAbilities.find((a) => a.id === d)?.name)
                          .join('、')
                      }}
                    </span>
                  </div>
                </div>

                <div v-if="enabledAbilities[ability.id]?.enabled" class="w-20 flex-shrink-0 pt-1">
                  <input
                    type="range"
                    :value="enabledAbilities[ability.id].proficiency"
                    min="0"
                    max="100"
                    step="5"
                    class="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    :aria-label="`${ability.name}熟练度`"
                    @input="
                      updateProficiency(
                        ability.id,
                        Number(($event.target as HTMLInputElement).value)
                      )
                    "
                    @click.stop
                  />
                  <p class="text-[10px] text-right text-gray-400 mt-0.5">
                    {{ enabledAbilities[ability.id].proficiency }}%
                  </p>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <div class="lg:col-span-1">
        <div
          v-if="selectedAbility && selectedAbilityConfig"
          class="sticky top-4 border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="text-xl">{{ selectedAbility.icon }}</span>
              <h4 class="font-semibold text-gray-800 dark:text-gray-200">
                {{ selectedAbility.name }}
              </h4>
            </div>
            <span
              class="text-[10px] px-1.5 py-0.5 rounded capitalize"
              :class="{
                'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400':
                  selectedAbility.category === 'conversation',
                'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400':
                  selectedAbility.category === 'creative',
                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400':
                  selectedAbility.category === 'analysis',
                'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400':
                  selectedAbility.category === 'tool',
                'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400':
                  selectedAbility.category === 'multimodal'
              }"
              >{{ categoryLabels[selectedAbility.category] }}</span
            >
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">
            {{ selectedAbility.description }}
          </p>

          <div class="space-y-3">
            <p
              class="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
            >
              参数配置
            </p>
            <div v-for="(value, key) in selectedAbilityConfig.params" :key="key" class="space-y-1">
              <label class="text-xs text-gray-600 dark:text-gray-400">{{ key }}</label>
              <component
                :is="
                  typeof value === 'number'
                    ? 'input'
                    : typeof value === 'boolean'
                      ? 'select'
                      : 'input'
                "
                :type="typeof value === 'number' ? 'number' : 'text'"
                :value="value"
                class="w-full px-2.5 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-blue-500 outline-none"
                @input="
                  updateParam(selectedAbility!.id, key, ($event.target as HTMLInputElement).value)
                "
                @change="
                  updateParam(selectedAbility!.id, key, ($event.target as HTMLSelectElement).value)
                "
              />
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-500">熟练度</span>
              <span class="font-bold text-blue-600 dark:text-blue-400"
                >{{ selectedAbilityConfig.proficiency }}%</span
              >
            </div>
            <div class="mt-2 w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-300"
                :style="{ width: `${selectedAbilityConfig.proficiency}%` }"
              ></div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="border border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center"
        >
          <span class="text-4xl block mb-2">👆</span>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            点击左侧技能项<br />查看和编辑详细参数
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 1000px;
}
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
