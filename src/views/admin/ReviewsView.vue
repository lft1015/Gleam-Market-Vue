<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { adminApi } from '@/api'
import type { Review } from '@/types'
import { formatTime } from '@/utils/format'
import StatusTag from '@/components/StatusTag.vue'

const rows = ref<Review[]>([])
const loading = ref(true)
const total = ref(0)
const page = ref(1)
const status = ref('PENDING')
const open = ref(false)
const submitting = ref(false)
const selected = ref<Review>()
const decision = reactive({ status: 'APPROVED', reviewNote: '' })

async function load() {
  loading.value = true
  try {
    const data = await adminApi.reviews({
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

function decide(row: Review, value: string) {
  selected.value = row
  decision.status = value
  decision.reviewNote = ''
  open.value = true
}

async function submit() {
  if (!selected.value) return
  submitting.value = true
  try {
    await adminApi.decideReview(selected.value.id, decision)
    ElMessage.success('审核结果已提交')
    open.value = false
    load()
  } finally {
    submitting.value = false
  }
}

onMounted(load)
</script>
<template>
  <div>
    <div class="page-heading">
      <div>
        <h1>内容审核</h1>
        <p>审核商品与失物信息，维护公开内容质量</p>
      </div>
    </div>
    <div class="surface table-surface">
      <div class="data-toolbar">
        <el-radio-group
          v-model="status"
          @change="page = 1; load()"
        >
          <el-radio-button value="PENDING">待审核</el-radio-button>
          <el-radio-button value="APPROVED">已通过</el-radio-button>
          <el-radio-button value="REJECTED">已拒绝</el-radio-button>
          <el-radio-button value="">全部</el-radio-button>
        </el-radio-group>
      </div>
      <el-table v-loading="loading" :data="rows" height="calc(100vh - 300px)">
        <el-table-column
          prop="targetTitle"
          label="内容"
          min-width="180"
          align="center"
        >
          <template #default="{ row }">
            {{ row.targetTitle || `${row.targetType} #${row.targetId}` }}
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100" align="center">
          <template #default="{ row }">
            {{ row.targetType === 'ITEM' ? '商品' : '失物信息' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <StatusTag :status="row.status" />
          </template>
        </el-table-column>
        <el-table-column label="提交时间" width="150" align="center">
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="reviewNote"
          label="审核备注"
          min-width="160"
          align="center"
        />
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default="{ row }">
            <template v-if="row.status === 'PENDING'">
              <el-button
                text
                type="success"
                @click="decide(row, 'APPROVED')"
              >
                通过
              </el-button>
              <el-button
                text
                type="danger"
                @click="decide(row, 'REJECTED')"
              >
                拒绝
              </el-button>
            </template>
            <el-button
              v-else
              text
              @click="$router.push(
                row.targetType === 'ITEM'
                  ? `/market/${row.targetId}`
                  : `/lost-found/${row.targetId}`
              )"
            >
              查看
            </el-button>
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
    <el-dialog
      v-model="open"
      :title="decision.status === 'APPROVED' ? '通过审核' : '拒绝内容'"
      width="min(480px, 92vw)"
    >
      <el-input
        v-model="decision.reviewNote"
        type="textarea"
        :rows="4"
        maxlength="500"
        :placeholder="decision.status === 'REJECTED' ? '请填写拒绝原因' : '可填写审核备注'"
      />
      <template #footer>
        <el-button @click="open = false">取消</el-button>
        <el-button
          :type="decision.status === 'APPROVED' ? 'primary' : 'danger'"
          :loading="submitting"
          @click="submit"
        >
          确认提交
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>