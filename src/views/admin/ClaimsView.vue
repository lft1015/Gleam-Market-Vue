<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminApi } from '@/api'
import type { Claim } from '@/types'
import { formatTime } from '@/utils/format'
import StatusTag from '@/components/StatusTag.vue'

const rows = ref<Claim[]>([])
const loading = ref(true)
const page = ref(1)
const total = ref(0)
const status = ref('PENDING')

async function load() {
  loading.value = true
  try {
    const data = await adminApi.claims({
      page: page.value,
      size: 10,
      status: status.value || undefined,
    })
    rows.value = data.records
    total.value = data.total
  } finally {
    loading.value = false
  }
}

async function decide(row: Claim, approved: boolean) {
  const result = await ElMessageBox.prompt(
    approved ? '可填写通过备注' : '请填写拒绝原因',
    approved ? '通过认领' : '拒绝认领',
    {
      inputType: 'textarea',
      confirmButtonText: '确认',
      cancelButtonText: '取消',
    },
  )
  await adminApi.decideClaim(row.id, approved, result.value)
  ElMessage.success('认领申请已处理')
  load()
}

onMounted(load)
</script>
<template>
  <div>
    <div class="page-heading">
      <div>
        <h1>认领审批</h1>
        <p>核对认领说明与私密验证信息</p>
      </div>
    </div>
    <div class="surface table-surface">
      <div class="data-toolbar">
        <el-radio-group
          v-model="status"
          @change="page = 1; load()"
        >
          <el-radio-button value="PENDING">待审批</el-radio-button>
          <el-radio-button value="APPROVED">已通过</el-radio-button>
          <el-radio-button value="REJECTED">已拒绝</el-radio-button>
          <el-radio-button value="">全部</el-radio-button>
        </el-radio-group>
      </div>
      <el-table v-loading="loading" :data="rows">
        <el-table-column
          prop="lostFoundTitle"
          label="失物信息"
          min-width="170"
          align="center"
        >
          <template #default="{ row }">
            <el-link
              type="primary"
              @click="$router.push(`/lost-found/${row.lostFoundId}`)"
            >
              {{ row.lostFoundTitle || `失物 #${row.lostFoundId}` }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="claimantNickname"
          label="申请人"
          width="120"
          align="center"
        >
          <template #default="{ row }">
            {{ row.claimantNickname || `用户 ${row.claimantId}` }}
          </template>
        </el-table-column>
        <el-table-column
          prop="message"
          label="认领说明"
          min-width="180"
          show-overflow-tooltip
          align="center"
        />
        <el-table-column
          prop="verification"
          label="私密验证"
          min-width="180"
          show-overflow-tooltip
          align="center"
        />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <StatusTag :status="row.status" />
          </template>
        </el-table-column>
        <el-table-column label="申请时间" width="150" align="center">
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default="{ row }">
            <template v-if="row.status === 'PENDING'">
              <el-button text type="success" @click="decide(row, true)">
                通过
              </el-button>
              <el-button text type="danger" @click="decide(row, false)">
                拒绝
              </el-button>
            </template>
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
  </div>
</template>