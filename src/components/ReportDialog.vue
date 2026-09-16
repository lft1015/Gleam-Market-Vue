<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { reportApi } from '@/api'

const props = defineProps<{ targetType: 'ITEM' | 'LOST_FOUND' | 'USER'; targetId: number }>()
const open = defineModel<boolean>({ required: true })
const submitting = ref(false)
const form = reactive({ reason: '', riskLevel: 'MEDIUM', description: '' })
const reasons = ['虚假信息', '违禁内容', '欺诈风险', '骚扰辱骂', '其他问题']
async function submit() {
  if (!form.reason) return ElMessage.warning('请选择举报原因')
  submitting.value = true
  try { await reportApi.create({ ...form, targetType: props.targetType, targetId: props.targetId }); ElMessage.success('举报已提交，平台会尽快处理'); open.value = false; Object.assign(form, { reason: '', riskLevel: 'MEDIUM', description: '' }) }
  finally { submitting.value = false }
}
</script>
<template>
  <el-dialog v-model="open" title="提交举报" width="min(480px, 92vw)">
    <el-form label-position="top">
      <el-form-item label="举报原因" required><el-select v-model="form.reason" style="width:100%"><el-option v-for="reason in reasons" :key="reason" :label="reason" :value="reason" /></el-select></el-form-item>
      <el-form-item label="风险等级"><el-segmented v-model="form.riskLevel" :options="[{label:'低',value:'LOW'},{label:'中',value:'MEDIUM'},{label:'高',value:'HIGH'}]" /></el-form-item>
      <el-form-item label="问题说明"><el-input v-model="form.description" type="textarea" :rows="4" maxlength="500" show-word-limit /></el-form-item>
    </el-form>
    <template #footer><el-button @click="open = false">取消</el-button><el-button type="primary" :loading="submitting" @click="submit">提交举报</el-button></template>
  </el-dialog>
</template>
