<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from 'lucide-vue-next'
import { adminApi } from '@/api'
import type { Category } from '@/types'
const rows=ref<Category[]>([]);const loading=ref(true);const open=ref(false);const editingId=ref(0);const saving=ref(false);const form=reactive({name:'',sortOrder:0})
async function load(){loading.value=true;try{rows.value=await adminApi.categories()}finally{loading.value=false}}
function edit(row?:Category){editingId.value=row?.id||0;Object.assign(form,{name:row?.name||'',sortOrder:row?.sortOrder||0});open.value=true}
async function save(){if(!form.name.trim())return ElMessage.warning('分类名称不能为空');saving.value=true;try{editingId.value?await adminApi.updateCategory(editingId.value,form):await adminApi.createCategory(form);ElMessage.success('分类已保存');open.value=false;load()}finally{saving.value=false}}
async function remove(row:Category){await ElMessageBox.confirm(`确认删除分类“${row.name}”吗？`,'删除分类',{type:'warning'});await adminApi.deleteCategory(row.id);ElMessage.success('分类已删除');load()}
onMounted(load)
</script>
<template><div><div class="page-heading"><div><h1>分类管理</h1><p>维护商品发布与筛选使用的分类</p></div><el-button type="primary" @click="edit()"><Plus :size="17" />新建分类</el-button></div><div class="surface table-surface"><el-table v-loading="loading" :data="rows"><el-table-column prop="name" label="分类名称" min-width="180" /><el-table-column prop="sortOrder" label="排序" width="100" /><el-table-column prop="createTime" label="创建时间" min-width="150" /><el-table-column label="操作" width="150"><template #default="{row}"><el-button text type="primary" @click="edit(row)">编辑</el-button><el-button text type="danger" @click="remove(row)">删除</el-button></template></el-table-column></el-table></div><el-dialog v-model="open" :title="editingId?'编辑分类':'新建分类'" width="min(430px,92vw)"><el-form label-position="top"><el-form-item label="分类名称" required><el-input v-model="form.name" maxlength="100" /></el-form-item><el-form-item label="排序"><el-input-number v-model="form.sortOrder" :min="0" /></el-form-item></el-form><template #footer><el-button @click="open=false">取消</el-button><el-button type="primary" :loading="saving" @click="save">保存</el-button></template></el-dialog></div></template>
