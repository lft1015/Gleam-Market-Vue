<script setup lang="ts">
import { Inbox, RotateCcw } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    loading?: boolean
    empty?: boolean
    error?: string
    emptyText?: string
  }>(),
  { emptyText: '暂时没有内容' },
)
defineEmits<{ retry: [] }>()
</script>
<template>
  <div v-if="loading" class="state-panel">
    <el-skeleton :rows="5" animated />
  </div>
  <div v-else-if="error" class="state-panel">
    <RotateCcw :size="32" />
    <strong>加载失败</strong>
    <span>{{ error }}</span>
    <el-button @click="$emit('retry')">重新加载</el-button>
  </div>
  <div v-else-if="empty" class="state-panel">
    <Inbox :size="34" />
    <strong>{{ emptyText }}</strong>
    <slot />
  </div>
  <slot v-else name="content" />
</template>