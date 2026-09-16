<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { adminApi } from '@/api'
import type { AuditLog } from '@/types'
import { formatTime } from '@/utils/format'
const rows=ref<AuditLog[]>([]);const loading=ref(true);const page=ref(1);const total=ref(0);const action=ref('')
async function load(){loading.value=true;try{const data=await adminApi.auditLogs({page:page.value,size:15,action:action.value||undefined});rows.value=data.records;total.value=data.total}finally{loading.value=false}}
onMounted(load)
</script>
<template><div><div class="page-heading"><div><h1>操作日志</h1><p>追踪管理员对平台数据执行的关键操作</p></div></div><div class="surface table-surface"><form class="data-toolbar" @submit.prevent="page=1;load()"><el-input v-model="action" placeholder="按操作类型筛选" clearable style="max-width:280px" /><el-button native-type="submit" type="primary">查询</el-button></form><el-table v-loading="loading" :data="rows"><el-table-column prop="adminId" label="管理员 ID" width="110" /><el-table-column prop="action" label="操作类型" min-width="150" /><el-table-column prop="targetType" label="对象类型" width="120" /><el-table-column prop="targetId" label="对象 ID" width="100" /><el-table-column prop="detail" label="操作详情" min-width="260" show-overflow-tooltip /><el-table-column label="操作时间" width="160"><template #default="{row}">{{ formatTime(row.createTime) }}</template></el-table-column></el-table><div class="pagination"><el-pagination v-model:current-page="page" layout="prev,pager,next" :page-size="15" :total="total" @current-change="load" /></div></div></div></template>
