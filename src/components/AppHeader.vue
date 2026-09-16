<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Heart, LogOut, MessageCircle, Search, ShieldCheck, UserRound } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const initials = computed(() => (auth.profile?.nickname || auth.session?.nickname || '拾').slice(0, 1))

async function logout() {
  await auth.logout()
  router.push('/')
}
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <RouterLink class="brand" to="/" aria-label="拾光集市首页">
        <span class="brand-mark">拾</span>
        <span><strong>拾光集市</strong><small>让闲置与心意再次发光</small></span>
      </RouterLink>
      <nav class="desktop-nav" aria-label="主导航">
        <RouterLink to="/"><Search :size="17" />发现</RouterLink>
        <RouterLink to="/market">二手集市</RouterLink>
        <RouterLink to="/lost-found">失物招领</RouterLink>
      </nav>
      <div class="header-actions">
        <template v-if="auth.isLoggedIn">
          <el-tooltip content="我的收藏"><RouterLink class="icon-link" to="/favorites"><Heart :size="19" /></RouterLink></el-tooltip>
          <el-badge is-dot :hidden="!auth.unreadCount">
            <el-tooltip content="消息"><RouterLink class="icon-link" to="/messages"><MessageCircle :size="19" /></RouterLink></el-tooltip>
          </el-badge>
          <RouterLink v-if="auth.isAdmin" class="admin-link" to="/admin"><ShieldCheck :size="17" />管理后台</RouterLink>
          <el-dropdown trigger="click">
            <button class="avatar-button" aria-label="账户菜单">
              <el-avatar :size="32" :src="auth.profile?.avatar">{{ initials }}</el-avatar>
              <span>{{ auth.profile?.nickname || auth.session?.nickname }}</span>
            </button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="router.push('/me')"><UserRound :size="16" />个人中心</el-dropdown-item>
                <el-dropdown-item divided @click="logout"><LogOut :size="16" />退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <RouterLink class="text-link" to="/auth/login">登录</RouterLink>
          <el-button type="primary" @click="router.push('/auth/register')">注册</el-button>
        </template>
      </div>
    </div>
  </header>
</template>