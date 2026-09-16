import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { authApi, messageApi, userApi } from '@/api'
import { TOKEN_KEY } from '@/api/http'
import type { Session, UserProfile } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const session = ref<Session | null>(null)
  const profile = ref<UserProfile | null>(null)
  const unreadCount = ref(0)
  const restoring = ref(false)
  let restorePromise: Promise<void> | null = null

  const isLoggedIn = computed(() => Boolean(session.value?.token))
  const isAdmin = computed(() => ['ADMIN', 'SUPER_ADMIN'].includes(session.value?.role || ''))
  const isMuted = computed(() => profile.value?.status === 'MUTED')

  function persist(value: Session | null) {
    session.value = value
    value
      ? localStorage.setItem(TOKEN_KEY, JSON.stringify(value))
      : localStorage.removeItem(TOKEN_KEY)
  }

  async function login(username: string, password: string) {
    persist(await authApi.login({ username, password }))
    try {
      await loadProfile()
    } catch (error) {
      if (!session.value) throw error
    }
  }

  async function loadProfile() {
    profile.value = await userApi.profile()
    if (session.value) {
      persist({ ...session.value, nickname: profile.value.nickname })
    }
  }

  async function loadUnread() {
    if (isLoggedIn.value) {
      unreadCount.value = (await messageApi.conversations()).reduce(
        (sum, item) => sum + (item.unreadCount || 0),
        0,
      )
    }
  }

  async function restore() {
    if (session.value) return
    if (restorePromise) return restorePromise
    restoring.value = true
    restorePromise = (async () => {
      const raw = localStorage.getItem(TOKEN_KEY)
      if (!raw) return
      let savedSession: Session
      try {
        savedSession = JSON.parse(raw) as Session
      } catch {
        clear()
        return
      }
      if (!savedSession?.token) {
        clear()
        return
      }
      persist(savedSession)
      try {
        await loadProfile()
      } catch {
        if (!session.value) return
      }
      await loadUnread().catch(() => {
        unreadCount.value = 0
      })
    })()
    try {
      await restorePromise
    } finally {
      restoring.value = false
      restorePromise = null
    }
  }

  async function logout() {
    try {
      await authApi.logout()
    } finally {
      clear()
    }
  }

  function clear() {
    persist(null)
    profile.value = null
    unreadCount.value = 0
  }

  window.addEventListener('gleam:unauthorized', clear)

  return {
    session,
    profile,
    unreadCount,
    restoring,
    isLoggedIn,
    isAdmin,
    isMuted,
    login,
    logout,
    restore,
    loadProfile,
    loadUnread,
    clear,
  }
})