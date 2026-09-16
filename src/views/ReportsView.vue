<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { reportApi } from '@/api'
import type { Report } from '@/types'
import { formatTime, statusLabels } from '@/utils/format'
import PageState from '@/components/PageState.vue'
import StatusTag from '@/components/StatusTag.vue'

const records = ref<Report[]>([])
const loading = ref(true)
const page = ref(1)
const total = ref(0)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    const data = await reportApi.mine({ page: page.value, size: 10 })
    records.value = data.records
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
        <h1>我的举报</h1>
        <p>查看已提交问题的处理进度与平台反馈</p>
      </div>
    </div>
    <PageState
      :loading="loading"
      :error="error"
      :empty="!records.length"
      empty-text="还没有提交过举报"
      @retry="load"
    >
      <template #content>
        <div class="surface table-surface">
          <el-table :data="records" height="calc(100vh - 330px)">
            <el-table-column prop="targetLabel" label="举报对象" min-width="180" align="center">
              <template #default="{ row }">
                {{ row.targetLabel || `${row.targetType} #${row.targetId}` }}
              </template>
            </el-table-column>
            <el-table-column prop="reason" label="原因" min-width="120" align="center" />
            <el-table-column label="风险" width="90" align="center">
              <template #default="{ row }"><StatusTag :status="row.riskLevel" /></template>
            </el-table-column>
            <el-table-column label="状态" width="100" align="center">
              <template #default="{ row }"><StatusTag :status="row.status" /></template>
            </el-table-column>
            <el-table-column label="提交时间" width="150" align="center">
              <template #default="{ row }">{{ formatTime(row.createTime) }}</template>
            </el-table-column>
            <el-table-column label="处理反馈" min-width="180" align="center">
              <template #default="{ row }">
                {{ row.reviewNote || (row.status === 'PENDING' ? '等待平台处理' : '暂无备注') }}
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              v-model:current-page="page"
              layout="prev, pager, next"
              :page-size="10"
              :total="total"
              @current-change="load"
            />
          </div>
        </div>
      </template>
    </PageState>
  </div>
</template>