<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { userApi } from '@/api'
import { useAuthStore } from '@/stores/auth'
import ImageUploader from '@/components/ImageUploader.vue'
import StatusTag from '@/components/StatusTag.vue'
import { formatTime } from '@/utils/format'
const auth=useAuthStore();const saving=ref(false);const avatars=ref<string[]>([]);const form=reactive({nickname:'',email:'',phone:'',avatar:''})
watch(avatars,(value)=>form.avatar=value[0]||'')
async function load(){await auth.loadProfile();const p=auth.profile!;Object.assign(form,{nickname:p.nickname,email:p.email||'',phone:p.phone||'',avatar:p.avatar||''});avatars.value=p.avatar?[p.avatar]:[]}
async function save(){if(!form.nickname.trim())return ElMessage.warning('昵称不能为空');saving.value=true;try{await userApi.update(form);await auth.loadProfile();ElMessage.success('资料已保存')}finally{saving.value=false}}
onMounted(load)
</script>
<template><div class="form-shell"><div class="page-heading"><div><h1>个人资料</h1><p>维护用于社区沟通的公开信息</p></div></div><div class="surface form-surface"><el-form label-position="top"><el-form-item label="头像"><ImageUploader v-model="avatars" :limit="1" /></el-form-item><el-form-item label="用户名"><el-input :model-value="auth.profile?.username" disabled /></el-form-item><el-form-item label="昵称" required><el-input v-model="form.nickname" maxlength="30" /></el-form-item><el-row :gutter="14"><el-col :xs="24" :sm="12"><el-form-item label="邮箱"><el-input v-model="form.email" type="email" maxlength="100" /></el-form-item></el-col><el-col :xs="24" :sm="12"><el-form-item label="手机号"><el-input v-model="form.phone" maxlength="20" /></el-form-item></el-col></el-row><div v-if="auth.profile" style="display:flex;gap:12px;align-items:center;margin-bottom:18px;color:var(--ink-500)"><StatusTag :status="auth.profile.status" /><span>注册于 {{ formatTime(auth.profile.createTime) }}</span></div><div class="form-actions"><el-button @click="$router.back()">返回</el-button><el-button type="primary" :loading="saving" @click="save">保存资料</el-button></div></el-form></div></div></template>
