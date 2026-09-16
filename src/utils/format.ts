import dayjs from 'dayjs'

export const formatMoney = (value?: number) =>
  value == null ? '--' : `¥${Number(value).toFixed(2)}`

export const formatTime = (value?: string, pattern = 'YYYY-MM-DD HH:mm') =>
  value ? dayjs(value).format(pattern) : '--'

export function parseImages(raw?: string): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (url): url is string => typeof url === 'string' && Boolean(url.trim()),
      )
    }
  } catch {
    /* legacy format */
  }
  return raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
}

export const statusLabels: Record<string, string> = {
  ACTIVE: '正常',
  WARNED: '已警告',
  MUTED: '已禁言',
  BANNED: '已封禁',
  DRAFT: '草稿',
  PENDING: '待处理',
  PENDING_REVIEW: '待审核',
  APPROVED: '已通过',
  REJECTED: '已拒绝',
  ON_SALE: '在售',
  TRADING: '交易中',
  SOLD: '已售出',
  OFF_SHELF: '已下架',
  IN_PROGRESS: '进行中',
  PROCESSING: '处理中',
  FOUND: '已找回',
  RETURNED: '已归还',
  CLOSED: '已关闭',
  RESOLVED: '已处理',
  DISMISSED: '已忽略',
  LOST: '寻物',
  LOW: '低风险',
  MEDIUM: '中风险',
  HIGH: '高风险',
}

export function statusType(status: string) {
  if (
    ['ON_SALE', 'IN_PROGRESS', 'ACTIVE', 'APPROVED', 'RESOLVED', 'RETURNED', 'FOUND'].includes(
      status,
    )
  )
    return 'success'
  if (
    ['PENDING', 'PENDING_REVIEW', 'TRADING', 'PROCESSING', 'WARNED', 'MEDIUM'].includes(status)
  )
    return 'warning'
  if (['REJECTED', 'BANNED', 'HIGH'].includes(status)) return 'danger'
  return 'info'
}