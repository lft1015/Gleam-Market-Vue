<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Image as ImageIcon } from 'lucide-vue-next'

const props = defineProps<{ images: string[]; alt: string }>()
const active = ref(props.images[0] || '')

watch(
  () => props.images,
  (value) => {
    active.value = value[0] || ''
  },
)

const hasImages = computed(() => props.images.length > 0)
</script>
<template>
  <div class="gallery">
    <div class="gallery-main">
      <img v-if="hasImages" :src="active" :alt="alt" />
      <div v-else class="image-fallback">
        <ImageIcon :size="48" />
        <span>暂无物品图片</span>
      </div>
    </div>
    <div v-if="images.length > 1" class="gallery-thumbs">
      <button
        v-for="image in images"
        :key="image"
        :class="{ active: active === image }"
        @click="active = image"
      >
        <img :src="image" :alt="alt" />
      </button>
    </div>
  </div>
</template>