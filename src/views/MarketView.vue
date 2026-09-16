<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Plus, Search } from 'lucide-vue-next'
import { commonApi, itemApi } from '@/api'
import type { Category, Item } from '@/types'
import ItemCard from '@/components/ItemCard.vue'
import PageState from '@/components/PageState.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const error = ref('')
const items = ref<Item[]>([])
const total = ref(0)
const categories = ref<Category[]>([])
const filters = reactive({
  keyword: String(route.query.keyword || ''),
  category: String(route.query.category || ''),
  minPrice: String(route.query.minPrice || ''),
  maxPrice: String(route.query.maxPrice || ''),
  page: Number(route.query.page || 1),
  size: 12,
})

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data = await itemApi.list(filters)
    items.value = data.records
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

onMounted(async () => {
  categories.value = await commonApi.categories().catch(() => [])
  load()
})
</script>
<template>
  <div>
    <div class="page-heading">
      <div>
        <h1>二手集市</h1>
        <p>发现身边真实、实用的闲置好物</p>
      </div>
      <el-button type="primary" @click="$router.push('/market/publish')">
        <Plus :size="17" />发布闲置
      </el-button>
    </div>
    <form class="filter-bar" @submit.prevent="apply()">
      <el-input v-model="filters.keyword" placeholder="搜索标题或描述" clearable>
        <template #prefix><Search :size="17" /></template>
      </el-input>
      <el-select v-model="filters.category" placeholder="全部分类" clearable>
        <el-option v-for="item in categories" :key="item.id" :label="item.name" :value="item.name" />
      </el-select>
      <el-input v-model="filters.minPrice" type="number" min="0" placeholder="最低价格" />
      <el-input v-model="filters.maxPrice" type="number" min="0" placeholder="最高价格" />
      <el-button native-type="submit" type="primary">筛选</el-button>
    </form>
    <PageState
      :loading="loading"
      :error="error"
      :empty="!items.length"
      empty-text="没有找到符合条件的商品"
      @retry="load"
    >
      <template #content>
        <div class="product-grid">
          <ItemCard v-for="item in items" :key="item.id" :item="item" />
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