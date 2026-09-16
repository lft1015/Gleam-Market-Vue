<script setup lang="ts">
import {
  BellRing,
  ClipboardCheck,
  Flag,
  FolderTree,
  LayoutDashboard,
  ListChecks,
  Megaphone,
  ScrollText,
  Users,
  X,
} from 'lucide-vue-next'
import { ref } from 'vue'

const mobileOpen = ref(false)
const nav = [
  { to: '/admin', label: '数据概览', icon: LayoutDashboard },
  { to: '/admin/reviews', label: '内容审核', icon: ClipboardCheck },
  { to: '/admin/reports', label: '举报处理', icon: Flag },
  { to: '/admin/claims', label: '认领审批', icon: ListChecks },
  { to: '/admin/users', label: '用户管理', icon: Users },
  { to: '/admin/categories', label: '分类管理', icon: FolderTree },
  { to: '/admin/announcements', label: '公告管理', icon: Megaphone },
  { to: '/admin/audit-logs', label: '操作日志', icon: ScrollText },
]
</script>
<template>
  <div class="admin-shell">
    <aside class="admin-sidebar" :class="{ open: mobileOpen }">
      <div class="admin-brand">
        <span class="brand-mark">拾</span>
        <div>
          <strong>拾光管理台</strong>
          <small>Gleam Market</small>
        </div>
        <button class="mobile-close" @click="mobileOpen = false">
          <X :size="20" />
        </button>
      </div>
      <nav>
        <RouterLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          :class="{ exact: item.to === '/admin' }"
          @click="mobileOpen = false"
        >
          <component :is="item.icon" :size="18" />
          {{ item.label }}
        </RouterLink>
      </nav>
      <RouterLink class="back-site" to="/">
        <BellRing :size="17" />返回用户端
      </RouterLink>
    </aside>
    <div class="admin-content">
      <header class="admin-topbar">
        <button class="menu-button" @click="mobileOpen = true">
          菜单
        </button>
        <div>
          <strong>平台运营与内容治理</strong>
          <span>保持社区信息真实、友善、有序</span>
        </div>
      </header>
      <main>
        <RouterView />
      </main>
    </div>
  </div>
</template>