<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from 'lucide-vue-next'
import { adminApi } from '@/api'
import type { AdminUser } from '@/types'
import { formatTime } from '@/utils/format'
import StatusTag from '@/components/StatusTag.vue'

const rows = ref<AdminUser[]>([])
const loading = ref(true)
const page = ref(1)
const total = ref(0)
const keyword = ref('')
const open = ref(false)
const selected = ref<AdminUser>()
const saving = ref(false)
const form = reactive({ status: 'ACTIVE', banUntil: '', remark: '' })

async function load() {
  loading.value = true
  try {
    const data = await adminApi.users({
      page: page.value,
      size: 10,
      keyword: keyword.value || undefined,
    })
    rows.value = data.records
    total.value = data.total
  } finally {
    loading.value = false
  }
}

function manage(row: AdminUser) {
  selected.value = row
  Object.assign(form, {
    status: row.status,
    banUntil: row.banUntil || '',
    remark: '',
  })
  open.value = true
}

async function save() {
  if (!selected.value) return
  saving.value = true
  try {
    await adminApi.setUserStatus(selected.value.id, {
      ...form,
      banUntil: form.banUntil || null,
    })
    ElMessage.success('用户状态已更新')
    open.value = false
    load()
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>
<template>
  <div>
    <div class="page-heading">
      <div>
        <h1>用户管理</h1>
        <p>查询用户并执行警告、禁言或封禁</p>
      </div>
    </div>
    <div class="surface table-surface">
      <form
        class="data-toolbar"
        @submit.prevent="page = 1; load()"
      >
        <el-input
          v-model="keyword"
          placeholder="用户名或昵称"
          clearable
          style="max-width: 320px"
        >
          <template #prefix>
            <Search :size="16" />
          </template>
        </el-input>
        <el-button native-type="submit" type="primary">
          查询
        </el-button>
      </form>
      <el-table v-loading="loading" :data="rows" height="calc(100vh - 300px)">
        <el-table-column label="用户" min-width="180">
          <template #default="{ row }">
            <div style="display: flex; align-items: center; gap: 9px">
              <el-avatar :size="34" :src="row.avatar">
                {{ row.nickname.slice(0, 1) }}
              </el-avatar>
              <div>
                <strong>{{ row.nickname }}</strong>
                <div style="font-size: 12px; color: var(--ink-500)">
                  @{{ row.username }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" width="110" align="center" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <StatusTag :status="row.status" />
          </template>
        </el-table-column>
        <el-table-column label="邮箱" min-width="150" align="center">
          <template #default="{ row }">
            {{ row.email || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="注册时间" width="150" align="center">
          <template #default="{ row }">
            {{ formatTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default="{ row }">
            <el-button
              text
              type="primary"
              :disabled="['ADMIN', 'SUPER_ADMIN'].includes(row.role)"
              @click="manage(row)"
            >
              管理
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
      title="调整用户状态"
      width="min(500px, 92vw)"
    >
      <el-form label-position="top">
        <el-form-item label="账号状态">
          <el-select v-model="form.status" style="width: 100%">
            <el-option label="恢复正常" value="ACTIVE" />
            <el-option label="警告" value="WARNED" />
            <el-option label="禁言" value="MUTED" />
            <el-option label="封禁" value="BANNED" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="form.status === 'BANNED'"
          label="解封时间"
        >
          <el-date-picker
            v-model="form.banUntil"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="不填写代表永久封禁"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="操作说明">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            maxlength="300"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="open = false">
          取消
        </el-button>
        <el-button type="primary" :loading="saving" @click="save">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>