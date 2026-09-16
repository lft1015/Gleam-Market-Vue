<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Bell, HeartHandshake, PackageOpen, Search, ShieldCheck } from 'lucide-vue-next'
import { commonApi, itemApi, lostFoundApi } from '@/api'
import type { Announcement, Item, LostFound } from '@/types'
import ItemCard from '@/components/ItemCard.vue'
import LostFoundCard from '@/components/LostFoundCard.vue'

const router = useRouter()
const keyword = ref('')
const announcements = ref<Announcement[]>([])
const items = ref<Item[]>([])
const lostFound = ref<LostFound[]>([])
const loading = ref(true)

function search() {
  router.push({ path: '/market', query: keyword.value ? { keyword: keyword.value } : {} })
}

onMounted(async () => {
  try {
    const [noticePage, itemPage, lostPage] = await Promise.all([
      commonApi.announcements({ page: 1, size: 3 }),
      itemApi.list({ page: 1, size: 8 }),
      lostFoundApi.list({ page: 1, size: 6 }),
    ])
    announcements.value = noticePage.records
    items.value = itemPage.records
    lostFound.value = lostPage.records
  } finally { loading.value = false }
})
</script>
<template>
  <div>
    <div v-if="announcements[0]" class="announcement-strip">
      <Bell :size="17" />
      <strong>平台公告</strong>
      <span>{{ announcements[0].title }}：{{ announcements[0].content }}</span>
    </div>
    <section class="hero-band">
      <div class="hero-copy">
        <h1>拾光集市</h1>
        <p>让闲置物品找到新主人，也让每一件遗失的物品有机会回家。</p>
        <div class="hero-search">
          <el-input
            v-model="keyword"
            size="large"
            placeholder="搜索数码、书籍、生活用品"
            clearable
            @keyup.enter="search"
          >
            <template #prefix><Search :size="18" /></template>
          </el-input>
          <el-button size="large" type="primary" @click="search">搜索集市</el-button>
        </div>
      </div>
      <div class="hero-visual">
        <RouterLink class="hero-tile" to="/market">
          <PackageOpen :size="28" />
          <strong>二手好物</strong>
          <span>轻松淘到心仪闲置</span>
        </RouterLink>
        <RouterLink class="hero-tile" to="/lost-found">
          <HeartHandshake :size="28" />
          <strong>失物招领</strong>
          <span>连接每一份善意</span>
        </RouterLink>
        <RouterLink class="hero-tile" to="/market/publish">
          <ArrowRight :size="28" />
          <strong>发布闲置</strong>
          <span>让物品继续发光</span>
        </RouterLink>
        <RouterLink class="hero-tile" to="/reports">
          <ShieldCheck :size="28" />
          <strong>社区共治</strong>
          <span>真实、安全、有序</span>
        </RouterLink>
      </div>
    </section>
    <div class="section-heading">
      <h2>新鲜上架</h2>
      <RouterLink to="/market">查看全部 <ArrowRight :size="15" /></RouterLink>
    </div>
    <el-skeleton v-if="loading" :rows="4" animated />
    <div v-else-if="items.length" class="product-grid">
      <ItemCard v-for="item in items" :key="item.id" :item="item" />
    </div>
    <el-empty v-else description="暂时没有在售商品" />
    <div class="section-heading">
      <h2>失物与招领</h2>
      <RouterLink to="/lost-found">查看全部 <ArrowRight :size="15" /></RouterLink>
    </div>
    <div v-if="lostFound.length" class="lost-grid">
      <LostFoundCard v-for="record in lostFound" :key="record.id" :record="record" />
    </div>
    <el-empty v-else description="暂时没有失物信息" />
  </div>
</template>