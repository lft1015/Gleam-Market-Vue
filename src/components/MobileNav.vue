<script setup lang="ts">
import { Home, MessageCircle, Search, UserRound } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>

<template>
  <nav class="mobile-nav" aria-label="移动端导航">
    <RouterLink to="/"><Home :size="20" /><span>发现</span></RouterLink>
    <RouterLink to="/market"><Search :size="20" /><span>集市</span></RouterLink>
    <RouterLink :to="auth.isLoggedIn ? '/messages' : '/auth/login'"><MessageCircle :size="20" /><span>消息</span></RouterLink>
    <RouterLink :to="auth.isLoggedIn ? '/me' : '/auth/login'"><UserRound :size="20" /><span>我的</span></RouterLink>
  </nav>
</template>
