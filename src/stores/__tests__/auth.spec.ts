import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const mocks = vi.hoisted(() => ({
  login: vi.fn(), logout: vi.fn(), profile: vi.fn(), conversations: vi.fn(),
}))
vi.mock('@/api', () => ({
  authApi: { login: mocks.login, logout: mocks.logout },
  userApi: { profile: mocks.profile },
  messageApi: { conversations: mocks.conversations },
}))
vi.mock('@/api/http', () => ({ TOKEN_KEY: 'gleam-market-session' }))

import { useAuthStore } from '../auth'

const session = { token: 'valid-token', userId: 1, nickname: 'Ada', role: 'USER' as const }
const profile = { id: 1, username: 'ada', nickname: 'Ada', role: 'USER', status: 'ACTIVE', createTime: '2026-01-01' }
const storage = new Map<string, string>()
Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    clear: () => storage.clear(),
    getItem: (key: string) => storage.get(key) ?? null,
    removeItem: (key: string) => storage.delete(key),
    setItem: (key: string, value: string) => storage.set(key, value),
  },
})

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    Object.values(mocks).forEach((mock) => mock.mockReset())
  })

  it('keeps the session when unread loading fails', async () => {
    localStorage.setItem('gleam-market-session', JSON.stringify(session))
    mocks.profile.mockResolvedValue(profile)
    mocks.conversations.mockRejectedValue(new Error('temporary failure'))
    const auth = useAuthStore()
    await auth.restore()
    expect(auth.isLoggedIn).toBe(true)
    expect(auth.unreadCount).toBe(0)
  })

  it('keeps the session when profile loading has a transient failure', async () => {
    localStorage.setItem('gleam-market-session', JSON.stringify(session))
    mocks.profile.mockRejectedValue(new Error('server unavailable'))
    mocks.conversations.mockResolvedValue([])
    const auth = useAuthStore()
    await auth.restore()
    expect(auth.isLoggedIn).toBe(true)
  })

  it('shares one in-progress restore between callers', async () => {
    localStorage.setItem('gleam-market-session', JSON.stringify(session))
    let resolveProfile!: (value: typeof profile) => void
    mocks.profile.mockImplementation(() => new Promise((resolve) => { resolveProfile = resolve }))
    mocks.conversations.mockResolvedValue([])
    const auth = useAuthStore()
    const first = auth.restore()
    const second = auth.restore()
    resolveProfile(profile)
    await Promise.all([first, second])
    expect(auth.isLoggedIn).toBe(true)
    expect(mocks.profile).toHaveBeenCalledTimes(1)
  })
})
