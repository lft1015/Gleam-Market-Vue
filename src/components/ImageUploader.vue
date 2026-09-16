<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, X } from 'lucide-vue-next'
import { commonApi } from '@/api'

const props = withDefaults(defineProps<{ modelValue: string[]; limit?: number }>(), { limit: 6 })
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()
const uploading = ref(false)

async function choose(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || []).slice(0, props.limit - props.modelValue.length)
  if (!files.length) return
  uploading.value = true
  try {
    const uploaded = await Promise.all(files.map((file) => commonApi.upload(file)))
    emit('update:modelValue', [...props.modelValue, ...uploaded.map((item) => item.url)])
  } catch (error) { ElMessage.error((error as Error).message) }
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
