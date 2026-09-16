<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { favoriteApi } from '@/api'
import type { Item } from '@/types'
import ItemCard from '@/components/ItemCard.vue'
import PageState from '@/components/PageState.vue'

const items = ref<Item[]>([])
const loading = ref(true)
const error = ref('')
const page = ref(1)
const total = ref(0)

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data = await favoriteApi.list({ page: page.value, size: 12 })
    items.value = data.records
    total.value = data.total
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
<template>
  <div>
    <div class="page-heading">
      <div>
        <h1>我的收藏</h1>
        <p>把喜欢的好物留在这里，随时回来看看</p>
      </div>
    </div>
    <PageState :loading="loading" :error="error" :empty="!items.length" empty-text="还没有收藏商品" @retry="load">
      <el-button type="primary" @click="$router.push('/market')">去逛集市</el-button>
      <template #content>
        <div class="product-grid">
          <ItemCard v-for="item in items" :key="item.id" :item="item" />
        </div>
        <div class="pagination">
          <el-pagination
            v-model:current-page="page"
            layout="prev, pager, next"
            :page-size="12"
            :total="total"
            @current-change="load"
          />
        </div>
      </template>
    </PageState>
  </div>
</template>