import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    {
      path: '/', component: () => import('@/layouts/SiteLayout.vue'), children: [
        { path: '', name: 'home', component: () => import('@/views/HomeView.vue') },
        { path: 'market', name: 'market', component: () => import('@/views/MarketView.vue') },
        { path: 'market/publish', name: 'item-create', component: () => import('@/views/ItemFormView.vue'), meta: { auth: true } },
        { path: 'market/:id/edit', name: 'item-edit', component: () => import('@/views/ItemFormView.vue'), meta: { auth: true } },
        { path: 'market/:id', name: 'item-detail', component: () => import('@/views/ItemDetailView.vue') },
        { path: 'lost-found', name: 'lost-found', component: () => import('@/views/LostFoundView.vue') },
        { path: 'lost-found/publish', name: 'lost-create', component: () => import('@/views/LostFoundFormView.vue'), meta: { auth: true } },
        { path: 'lost-found/:id/edit', name: 'lost-edit', component: () => import('@/views/LostFoundFormView.vue'), meta: { auth: true } },
        { path: 'lost-found/:id', name: 'lost-detail', component: () => import('@/views/LostFoundDetailView.vue') },
        { path: 'messages/:conversationId?', name: 'messages', component: () => import('@/views/MessagesView.vue'), meta: { auth: true } },
        { path: 'favorites', name: 'favorites', component: () => import('@/views/FavoritesView.vue'), meta: { auth: true } },
        { path: 'reports', name: 'reports', component: () => import('@/views/ReportsView.vue'), meta: { auth: true } },
        { path: 'me', name: 'me', component: () => import('@/views/UserCenterView.vue'), meta: { auth: true } },
        { path: 'profile', name: 'profile', component: () => import('@/views/ProfileView.vue'), meta: { auth: true } },
      ],
    },
    { path: '/auth/:mode(login|register)', name: 'auth', component: () => import('@/views/AuthView.vue') },
    {
      path: '/admin', component: () => import('@/layouts/AdminLayout.vue'), meta: { auth: true, admin: true }, children: [
        { path: '', name: 'admin-dashboard', component: () => import('@/views/admin/DashboardView.vue') },
        { path: 'reviews', name: 'admin-reviews', component: () => import('@/views/admin/ReviewsView.vue') },
        { path: 'reports', name: 'admin-reports', component: () => import('@/views/admin/AdminReportsView.vue') },
        { path: 'claims', name: 'admin-claims', component: () => import('@/views/admin/ClaimsView.vue') },
        { path: 'users', name: 'admin-users', component: () => import('@/views/admin/UsersView.vue') },
        { path: 'categories', name: 'admin-categories', component: () => import('@/views/admin/CategoriesView.vue') },
        { path: 'announcements', name: 'admin-announcements', component: () => import('@/views/admin/AnnouncementsView.vue') },
        { path: 'audit-logs', name: 'admin-audit', component: () => import('@/views/admin/AuditLogsView.vue') },
      ],
    },
    { path: '/forbidden', name: 'forbidden', component: () => import('@/views/ForbiddenView.vue') },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  await auth.restore()
  if (to.meta.auth && !auth.isLoggedIn) return { name: 'auth', params: { mode: 'login' }, query: { redirect: to.fullPath } }
  if (to.meta.admin && !auth.isAdmin) return { name: 'forbidden' }
  if (to.name === 'auth' && auth.isLoggedIn) return auth.isAdmin ? { name: 'admin-dashboard' } : { name: 'home' }
})

export default router
