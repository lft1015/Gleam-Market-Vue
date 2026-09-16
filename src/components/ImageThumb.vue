<script setup lang="ts">
import { Image as ImageIcon } from 'lucide-vue-next'

defineProps<{ src?: string; alt: string }>()
</script>
<template>
  <div class="image-thumb">
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      loading="lazy"
      @error="($event.currentTarget as HTMLImageElement).style.display = 'none'"
    />
    <div class="image-fallback">
      <ImageIcon :size="28" />
      <span>拾光图片</span>
    </div>
  </div>
</template>