import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import type { ApiResult } from '@/types'

const TOKEN_KEY = 'gleam-market-session'
export const http = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1', timeout: 15000 })

function clearMatchingSession(config?: InternalAxiosRequestConfig) {
  const authorization = config?.headers?.get('Authorization')
  const failedToken = typeof authorization === 'string' && authorization.startsWith('Bearer ')
    ? authorization.slice(7) : null
  if (!failedToken) return
  try {
    const currentToken = JSON.parse(localStorage.getItem(TOKEN_KEY) || 'null')?.token
    if (currentToken === failedToken) window.dispatchEvent(new Event('gleam:unauthorized'))
  } catch { localStorage.removeItem(TOKEN_KEY) }
}

http.interceptors.request.use((config) => {
  const raw = localStorage.getItem(TOKEN_KEY)
  if (raw) {
    try {
      const token = JSON.parse(raw).token
      if (token) config.headers.Authorization = `Bearer ${token}`
    } catch { localStorage.removeItem(TOKEN_KEY) }
  }
  return config
})

http.interceptors.response.use(
  (response) => {
    const result = response.data as ApiResult<unknown>
    if (result && typeof result.code === 'number' && result.code >= 400) {
      if (result.code === 401) clearMatchingSession(response.config)
      return Promise.reject(new Error(result.msg || '请求失败'))
    }
    return response
  },
  (error: AxiosError<ApiResult<unknown>>) => {
    const status = error.response?.status
    const message = error.response?.data?.msg || (error.code === 'ECONNABORTED' ? '请求超时，请稍后重试' : '网络连接失败')
    if (status === 401) clearMatchingSession(error.config)
    if (status !== 401) ElMessage.error(message)
    return Promise.reject(new Error(message))
  },
)

export async function unwrap<T>(promise: Promise<{ data: ApiResult<T> }>): Promise<T> {
  const response = await promise
  return response.data.data
}
export { TOKEN_KEY }
