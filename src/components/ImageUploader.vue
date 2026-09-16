<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, X } from 'lucide-vue-next'
import { commonApi } from '@/api'

const props = withDefaults(defineProps<{ modelValue: string[]; limit?: number }>(), { limit: 6 })
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()
const uploading = ref(false)
const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

async function choose(event: Event) {
  const input = event.target as HTMLInputElement
  const rawFiles = Array.from(input.files || [])
  const unsupported = rawFiles.find((file) => !ALLOWED_TYPES.has(file.type))
  if (unsupported) {
    ElMessage.warning(`图片“${unsupported.name}”格式不受支持，请选择 JPEG、PNG、WebP 或 GIF 图片`)
    input.value = ''
    return
  }
  const oversize = rawFiles.find((file) => file.size > MAX_SIZE)
  if (oversize) {
    ElMessage.warning(`图片「${oversize.name}」超过 5MB，请压缩后重新选择`)
    input.value = ''
    return
  }
  const files = rawFiles.slice(0, props.limit - props.modelValue.length)
  if (!files.length) return
  uploading.value = true
  try {
    const uploaded = await Promise.all(files.map((file) => commonApi.upload(file)))
    emit('update:modelValue', [...props.modelValue, ...uploaded.map((item) => item.url)])
  } catch { /* 错误提示已在 http 拦截器中统一处理 */ }
  finally { uploading.value = false; input.value = '' }
}

function remove(index: number) {
  emit('update:modelValue', props.modelValue.filter((_, current) => current !== index))
}
</script>
<template>
  <div class="uploader-list" v-loading="uploading">
    <div v-for="(image, index) in modelValue" :key="image" class="upload-tile"><img :src="image" alt="已上传图片" /><button class="upload-remove" type="button" aria-label="删除图片" @click="remove(index)"><X :size="15" /></button></div>
    <label v-if="modelValue.length < limit" class="upload-tile upload-add"><Plus :size="24" /><span>上传图片</span><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple @change="choose" /></label>
  </div>
</template>
