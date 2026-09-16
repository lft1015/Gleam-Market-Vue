<script setup lang="ts">
import { CalendarDays, MapPin } from 'lucide-vue-next'
import type { LostFound } from '@/types'
import { formatTime, parseImages } from '@/utils/format'
import ImageThumb from './ImageThumb.vue'
import StatusTag from './StatusTag.vue'

defineProps<{ record: LostFound; showStatus?: boolean }>()
</script>
<template>
  <RouterLink class="lost-card" :to="`/lost-found/${record.id}`">
    <ImageThumb :src="parseImages(record.images)[0]" :alt="record.title" />
    <div class="lost-card-body">
      <div style="display: flex; gap: 7px; align-items: center">
        <el-tag
          :type="record.type === 'LOST' ? 'warning' : 'success'"
          size="small"
        >
          {{ record.type === 'LOST' ? '寻物' : '招领' }}
        </el-tag>
        <StatusTag v-if="showStatus" :status="record.status" />
      </div>
      <h3>{{ record.title }}</h3>
      <div class="meta-line">
        <MapPin :size="14" />{{ record.location }}
      </div>
      <div class="meta-line">
        <CalendarDays :size="14" />{{ formatTime(record.lostTime, 'MM-DD HH:mm') }}
      </div>
    </div>
  </RouterLink>
</template>