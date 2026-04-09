<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { avatarLibrary, categories, type AgentConfig } from '../../data/mockCustomize'

interface Props {
  modelValue: AgentConfig['basicInfo']
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: AgentConfig['basicInfo']]
}>()

const schema = yup.object({
  name: yup.string().required('名称为必填项').min(2, '名称至少 2 个字符').max(50, '名称最多 50 个字符'),
  description: yup.string().max(500, '描述最多 500 字符').default(''),
  avatarId: yup.string().default(''),
  tags: yup.array().of(yup.string()).max(10, '最多 10 个标签').default([]),
  category: yup.string().required('请选择分类').default('assistant')
})

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
  initialValues: props.modelValue
})

const { value: name } = useField<string>('name')
const { value: description } = useField<string>('description')
const { value: avatarId } = useField<string>('avatarId')
const { value: tags } = useField<string[]>('tags')
const { value: category } = useField<string>('category')

const tagInput = ref('')
const showAvatarPicker = ref(false)
const uploadedAvatar = ref<string | null>(null)
const showMarkdownPreview = ref(false)

const nameLength = computed(() => name.value?.length ?? 0)
const descLength = computed(() => description.value?.length ?? 0)
const selectedAvatar = computed(() => {
  if (uploadedAvatar.value) return uploadedAvatar.value
  const avatar = avatarLibrary.find(a => a.id === avatarId.value)
  return avatar?.emoji || ''
})

const groupedAvatars = computed(() => {
  const groups: Record<string, typeof avatarLibrary> = {}
  avatarLibrary.forEach(avatar => {
    if (!groups[avatar.category]) groups[avatar.category] = []
    groups[avatar.category].push(avatar)
  })
  return groups
})

const categoryLabels: Record<string, string> = {
  person: '人物',
  animal: '动物',
  abstract: '抽象',
  tech: '科技',
  nature: '自然',
  food: '美食'
}

const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !tags.value?.includes(tag) && (tags.value?.length ?? 0) < 10) {
    tags.value = [...(tags.value || []), tag]
    tagInput.value = ''
  }
}

const removeTag = (index: number) => {
  tags.value = tags.value?.filter((_, i) => i !== index) ?? []
}

const handleTagKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    addTag()
  }
}

const selectAvatar = (id: string) => {
  avatarId.value = id
  uploadedAvatar.value = null
  showAvatarPicker.value = false
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      alert('文件大小不能超过 2MB')
      return
    }
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alert('仅支持 JPG、PNG 或 WebP 格式')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedAvatar.value = e.target?.result as string
      showAvatarPicker.value = false
    }
    reader.readAsDataURL(file)
  }
}

const onSubmit = handleSubmit((values) => {
  emit('update:modelValue', values as AgentConfig['basicInfo'])
})
</script>

<template>
  <div class="space-y-6" @submit.prevent="onSubmit">
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        智能体名称 <span class="text-red-500">*</span>
      </label>
      <input
        v-model="name"
        type="text"
        placeholder="请输入智能体名称（2-50个字符）"
        class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
        :class="{ 'border-red-500': errors.name }"
        maxlength="50"
        aria-label="智能体名称"
      />
      <div class="flex justify-between mt-1">
        <p v-if="errors.name" class="text-red-500 text-xs">{{ errors.name }}</p>
        <p v-else class="text-xs text-gray-400"></p>
        <p class="text-xs text-gray-400">{{ nameLength }}/50</p>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        描述信息
      </label>
      <textarea
        v-model="description"
        placeholder="请描述您的智能体功能和特点（支持 Markdown 格式）..."
        rows="4"
        class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
        :class="{ 'border-red-500': errors.description }"
        maxlength="500"
        aria-label="智能体描述"
      ></textarea>
      <div class="flex justify-between mt-1">
        <div class="flex items-center gap-2">
          <p v-if="errors.description" class="text-red-500 text-xs">{{ errors.description }}</p>
          <button
            type="button"
            @click="showMarkdownPreview = !showMarkdownPreview"
            class="text-xs text-blue-500 hover:text-blue-600 transition-colors"
          >
            {{ showMarkdownPreview ? '隐藏预览' : '预览 Markdown' }}
          </button>
        </div>
        <p class="text-xs text-gray-400">{{ descLength }}/500</p>
      </div>
      <div
        v-if="showMarkdownPreview && description"
        class="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none"
      >
        {{ description }}
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        头像设置
      </label>
      <div class="flex items-center gap-4">
        <div
          @click="showAvatarPicker = !showAvatarPicker"
          class="w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors bg-gray-50 dark:bg-gray-800 overflow-hidden"
        >
          <span v-if="!selectedAvatar" class="text-3xl text-gray-400">+</span>
          <span v-else class="text-4xl">{{ selectedAvatar }}</span>
        </div>
        <div class="flex-1">
          <p class="text-sm text-gray-600 dark:text-gray-400">点击选择头像或上传自定义图片</p>
          <p class="text-xs text-gray-400 mt-0.5">支持 JPG/PNG/WebP，最大 2MB</p>
        </div>
        <label class="cursor-pointer px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
          上传图片
          <input type="file" accept=".jpg,.jpeg,.png,.webp" class="hidden" @change="handleFileUpload" />
        </label>
      </div>

      <Transition name="slide-fade">
        <div v-if="showAvatarPicker" class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">选择预设头像</h4>
          <div v-for="(group, cat) in groupedAvatars" :key="cat" class="mb-3 last:mb-0">
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">{{ categoryLabels[cat] || cat }}</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="avatar in group"
                :key="avatar.id"
                type="button"
                @click="selectAvatar(avatar.id)"
                class="w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all hover:scale-110"
                :class="
                  avatarId === avatar.id
                    ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500'
                    : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                "
                :aria-label="`选择${avatar.name}头像`"
              >
                {{ avatar.emoji }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        标签（最多 10 个）
      </label>
      <div class="flex flex-wrap gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 min-h-[44px]">
        <span
          v-for="(tag, index) in tags"
          :key="index"
          class="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium"
        >
          {{ tag }}
          <button
            type="button"
            @click="removeTag(index)"
            class="hover:text-red-500 transition-colors"
            aria-label="删除标签"
          >×</button>
        </span>
        <input
          v-model="tagInput"
          type="text"
          placeholder="输入标签后按回车添加..."
          class="flex-1 min-w-[140px] px-2 py-1 text-sm bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
          :disabled="(tags?.length ?? 0) >= 10"
          @keydown="handleTagKeydown"
          aria-label="标签输入"
        />
      </div>
      <p v-if="errors.tags" class="text-red-500 text-xs mt-1">{{ errors.tags }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        分类 <span class="text-red-500">*</span>
      </label>
      <select
        v-model="category"
        class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
        :class="{ 'border-red-500': errors.category }"
        aria-label="智能体分类"
      >
        <option v-for="cat in categories" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
      </select>
      <p v-if="errors.category" class="text-red-500 text-xs mt-1">{{ errors.category }}</p>
    </div>
  </div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.25s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}
</style>
