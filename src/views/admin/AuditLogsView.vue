<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { adminApi } from '@/api'
import type { AuditLog } from '@/types'
import { formatTime } from '@/utils/format'

const rows = ref<AuditLog[]>([])
const loading = ref(true)
const page = ref(1)
const total = ref(0)
const action = ref('')

const actionLabels: Record<string, string> = {
  CREATE: '创建',
  UPDATE: '更新',
  DELETE: '删除',
  APPROVE: '审核通过',
  REJECT: '审核拒绝',
  BAN: '封禁',
  UNBAN: '解封',
  WARN: '警告',
  MUTE: '禁言',
  RESOLVE: '处理',
  DISMISS: '驳回',
}

const targetTypeLabels: Record<string, string> = {
  ITEM: '商品',
  USER: '用户',
  CATEGORY: '分类',
  ANNOUNCEMENT: '公告',
  REVIEW: '审核',
  REPORT: '举报',
  CLAIM: '认领',
  LOST_FOUND: '失物招领',
}

async function load() {
  loading.value = true
  try {
    const data = await adminApi.auditLogs({
      page: page.value,
      size: 15,
      action: action.value || undefined,
    })
    rows.value = data.records
    total.value = data.total
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
        <h1>操作日志</h1>
        <p>追踪管理员对平台数据执行的关键操作</p>
      </div>
    </div>
    <div class="surface table-surface">
      <form
        class="data-toolbar"
        @submit.prevent="page = 1; load()"
      >
        <span style="width:200px;flex-shrink:0">
          <el-select
            v-model="action"
            placeholder="按操作类型筛选"
            clearable
            style="width:100%"
          >
          <el-option
            v-for="(label, key) in actionLabels"
            :key="key"
            :label="label"
            :value="key"
          />
        </el-select>
        </span>
        <el-button native-type="submit" type="primary">
          查询
        </el-button>
      </form>
      <el-table v-loading="loading" :data="rows" height="calc(100vh - 300px)">
        <el-table-column
          prop="adminId"
          label="管理员 ID"
          width="110"
          align="center"
        />
        <el-table-column label="操作类型" min-width="150" align="center">
          <template #default="{ row }">
            {{ actionLabels[row.action] || row.action }}
          </template>
        </el-table-column>
        <el-table-column label="对象类型" width="120" align="center">
          <template #default="{ row }">
            {{ targetTypeLabels[row.targetType] || row.targetType }}
          </template>
        </el-table-column>
        <el-table-column
          prop="targetId"
          label="对象 ID"
          width="100"
          align="center"
        />
        <el-table-column
          prop="detail"
          label="操作详情"
          min-width="260"
          show-overflow-tooltip
          align="center"
        />
        <el-table-column label="操作时间" width="160" align="center">
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="page"
          layout="prev, pager, next"
          :page-size="15"
          :total="total"
          @current-change="load"
        />
      </div>
    </div>
  </div>
</template>