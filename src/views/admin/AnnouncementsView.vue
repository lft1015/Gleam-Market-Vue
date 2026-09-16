<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from 'lucide-vue-next'
import { adminApi } from '@/api'
import type { Announcement } from '@/types'
import { formatTime } from '@/utils/format'
const rows = ref<Announcement[]>([])
const loading = ref(true)
const page = ref(1)
const total = ref(0)
const open = ref(false)
const editingId = ref(0)
const saving = ref(false)
const form = reactive({ title: '', content: '', isActive: false })

async function load() {
  loading.value = true
  try {
    const data = await adminApi.announcements({ page: page.value, size: 10 })
    rows.value = data.records
    total.value = data.total
  } finally {
    loading.value = false
  }
}

function edit(row?: Announcement) {
  editingId.value = row?.id || 0
  Object.assign(form, {
    title: row?.title || '',
    content: row?.content || '',
    isActive: row?.isActive || false,
  })
  open.value = true
}

async function save() {
  if (!form.title.trim() || !form.content.trim())
    return ElMessage.warning('标题和内容不能为空')
  saving.value = true
  try {
    editingId.value
      ? await adminApi.updateAnnouncement(editingId.value, form)
      : await adminApi.createAnnouncement(form)
    ElMessage.success('公告已保存')
    open.value = false
    load()
  } finally {
    saving.value = false
  }
}

async function remove(row: Announcement) {
  await ElMessageBox.confirm(`确认删除公告"${row.title}"吗？`, '删除公告', {
    type: 'warning',
  })
  await adminApi.deleteAnnouncement(row.id)
  ElMessage.success('公告已删除')
  load()
}
onMounted(load)
</script>
<template>
  <div>
    <div class="page-heading">
      <div>
        <h1>公告管理</h1>
        <p>发布面向全体用户的平台通知</p>
      </div>
      <el-button type="primary" @click="edit()">
        <Plus :size="17" />新建公告
      </el-button>
    </div>
    <div class="surface table-surface">
      <el-table v-loading="loading" :data="rows">
        <el-table-column prop="title" label="标题" min-width="180" align="center" />
        <el-table-column align="center" prop="content" label="内容" min-width="260" show-overflow-tooltip />
        <el-table-column align="center" label="发布状态" width="100">
          <template #default="{row}">
            <el-tag :type="row.isActive?'success':'info'">
              {{ row.isActive?'已发布':'未发布' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="更新时间" width="150">
          <template #default="{row}">
            {{ formatTime(row.updateTime) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180" fixed="right">
          <template #default="{row}">
            <el-button text type="primary" @click="edit(row)">
              编辑
            </el-button>
            <el-button text type="danger" @click="remove(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination v-model:current-page="page" layout="prev,pager,next" :page-size="10" :total="total" @current-change="load" />
      </div>
    </div>
    <el-dialog v-model="open" :title="editingId?'编辑公告':'新建公告'" width="min(620px,92vw)">
      <el-form label-position="top">
        <el-form-item label="公告标题" required>
          <el-input v-model="form.title" maxlength="255" show-word-limit />
        </el-form-item>
        <el-form-item label="公告内容" required>
          <el-input v-model="form.content" type="textarea" :rows="6" maxlength="3000" show-word-limit />
        </el-form-item>
        <el-form-item v-if="editingId" label="立即发布">
          <el-switch v-model="form.isActive" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="open=false">
          取消
        </el-button>
        <el-button type="primary" :loading="saving" @click="save">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>