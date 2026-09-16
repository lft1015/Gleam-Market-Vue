<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Plus, Search } from 'lucide-vue-next'
import { lostFoundApi } from '@/api'
import type { LostFound } from '@/types'
import LostFoundCard from '@/components/LostFoundCard.vue'
import PageState from '@/components/PageState.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const error = ref('')
const records = ref<LostFound[]>([])
const total = ref(0)
const filters = reactive({
  keyword: String(route.query.keyword || ''),
  type: String(route.query.type || ''),
  location: String(route.query.location || ''),
  page: Number(route.query.page || 1),
  size: 12,
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data = await lostFoundApi.list(filters)
    records.value = data.records
    total.value = data.total
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}

function apply(reset = true) {
  if (reset) filters.page = 1
  const query = Object.fromEntries(
    Object.entries(filters).filter(([key, value]) => key !== 'size' && value !== '' && value !== 1)
  )
  router.replace({ query })
  load()
}

watch(() => filters.page, () => apply(false))

onMounted(load)
</script>
<template>
  <div>
    <div class="page-heading">
      <div>
        <h1>失物招领</h1>
        <p>发布线索，让遗失与善意在这里相遇</p>
      </div>
      <el-button type="primary" @click="$router.push('/lost-found/publish')">
        <Plus :size="17" />发布信息
      </el-button>
    </div>
    <form class="filter-bar" @submit.prevent="apply()">
      <el-input v-model="filters.keyword" placeholder="搜索物品关键词" clearable>
        <template #prefix><Search :size="17" /></template>
      </el-input>
      <el-select v-model="filters.type" placeholder="全部类型" clearable>
        <el-option label="寻物启事" value="LOST" />
        <el-option label="招领信息" value="FOUND" />
      </el-select>
      <el-input v-model="filters.location" placeholder="地点" clearable />
      <span></span>
      <el-button native-type="submit" type="primary">筛选</el-button>
    </form>
    <PageState
      :loading="loading"
      :error="error"
      :empty="!records.length"
      empty-text="没有找到相关信息"
      @retry="load"
    >
      <template #content>
        <div class="lost-grid">
          <LostFoundCard v-for="record in records" :key="record.id" :record="record" />
        </div>
        <div class="pagination">
          <el-pagination
            v-model:current-page="filters.page"
            layout="prev, pager, next"
            :page-size="filters.size"
            :total="total"
          />
        </div>
      </template>
    </PageState>
  </div>
</template>