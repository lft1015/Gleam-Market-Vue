<script setup lang="ts">
import { statusLabels, statusType } from '@/utils/format'
defineProps<{ status: string }>()
</script>
<template><el-tag :type="statusType(status)" effect="light" size="small">{{ statusLabels[status] || status }}</el-tag></template>
