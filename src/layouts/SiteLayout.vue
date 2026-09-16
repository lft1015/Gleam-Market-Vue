<script setup lang="ts">
import { AlertTriangle, Info } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import MobileNav from '@/components/MobileNav.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const auth = useAuthStore()
</script>

<template>
  <div class="site-shell">
    <AppHeader />
    <div v-if="auth.profile?.status === 'WARNED'" class="account-notice warning"><AlertTriangle :size="17" />您的账号收到平台警告，请遵守社区规则。</div>
    <div v-if="auth.profile?.status === 'MUTED'" class="account-notice info"><Info :size="17" />账号当前处于只读状态，发布与互动功能暂不可用。</div>
    <main class="site-main"><RouterView /></main>
    <footer v-if="route.name !== 'messages'" class="site-footer"><span>拾光集市 · 校园与社区闲置流转平台</span><span>安全交易，从真诚沟通开始</span></footer>
    <MobileNav />
  </div>
</template>