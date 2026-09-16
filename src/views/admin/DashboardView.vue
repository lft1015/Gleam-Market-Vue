<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ClipboardCheck, Flag, PackageOpen, Users } from 'lucide-vue-next'
import { adminApi } from '@/api'
import type { Dashboard } from '@/types'
const data=ref<Dashboard>();const loading=ref(true)
onMounted(async()=>{try{data.value=await adminApi.dashboard()}finally{loading.value=false}})
const metrics=[{key:'totalUsers',label:'注册用户',icon:Users},{key:'totalItems',label:'商品总量',icon:PackageOpen},{key:'pendingReviews',label:'待审核内容',icon:ClipboardCheck},{key:'pendingReports',label:'待处理举报',icon:Flag}] as const
</script>
<template><div><div class="page-heading"><div><h1>数据概览</h1><p>查看平台当前的业务规模与待处理事项</p></div></div><div class="metric-grid" v-loading="loading"><div v-for="item in metrics" :key="item.key" class="surface metric"><span class="metric-icon"><component :is="item.icon" :size="22" /></span><div><strong>{{ data?.[item.key] ?? '--' }}</strong><span>{{ item.label }}</span></div></div></div><div class="section-heading"><h2>运营待办</h2></div><div class="surface table-surface"><el-row :gutter="16"><el-col :xs="24" :sm="12"><el-result icon="warning" title="内容审核" :sub-title="`${data?.pendingReviews||0} 条内容等待审核`"><template #extra><el-button type="primary" @click="$router.push('/admin/reviews')">立即处理</el-button></template></el-result></el-col><el-col :xs="24" :sm="12"><el-result icon="info" title="举报处理" :sub-title="`${data?.pendingReports||0} 条举报等待处理`"><template #extra><el-button @click="$router.push('/admin/reports')">查看举报</el-button></template></el-result></el-col></el-row></div></div></template>
