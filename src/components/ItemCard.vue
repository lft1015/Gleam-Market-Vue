<script setup lang="ts">
import { Eye } from 'lucide-vue-next'
import type { Item } from '@/types'
import { formatMoney, formatTime, parseImages } from '@/utils/format'
import ImageThumb from './ImageThumb.vue'
import StatusTag from './StatusTag.vue'

defineProps<{ item: Item; showStatus?: boolean }>()
</script>
<template>
  <RouterLink class="item-card" :to="`/market/${item.id}`">
    <ImageThumb :src="parseImages(item.images)[0]" :alt="item.title" />
    <div class="item-card-body">
      <h3 class="item-card-title">{{ item.title }}</h3>
      <div>
        <span class="price">{{ formatMoney(item.price) }}</span>
        <span v-if="item.originalPrice" class="old-price">
          {{ formatMoney(item.originalPrice) }}
        </span>
      </div>
      <div class="card-footer">
        <span>{{ item.category }} · {{ formatTime(item.createTime, 'MM-DD') }}</span>
        <span><Eye :size="13" /> {{ item.viewCount || 0 }}</span>
        <StatusTag v-if="showStatus" :status="item.status" />
      </div>
    </div>
  </RouterLink>
</template>