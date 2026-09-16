import { http, unwrap } from './http'
import type { AdminUser, Announcement, AuditLog, Category, Claim, Conversation, Dashboard, Item, LostFound, Message, PageResult, Report, Review, Session, UploadResult, UserProfile } from '@/types'

type Params = Record<string, unknown>
export const authApi = {
  login: (body: { username: string; password: string }) => unwrap<Session>(http.post('/auth/login', body)),
  register: (body: { username: string; password: string; nickname: string }) => unwrap<void>(http.post('/auth/register', body)),
  logout: () => unwrap<void>(http.post('/auth/logout')),
}
export const userApi = {
  profile: () => unwrap<UserProfile>(http.get('/users/me')),
  update: (body: Partial<UserProfile>) => unwrap<void>(http.put('/users/me', body)),
}
export const commonApi = {
  categories: () => unwrap<Category[]>(http.get('/categories')),
  announcements: (params: Params = {}) => unwrap<PageResult<Announcement>>(http.get('/announcements', { params })),
  upload: (file: File) => { const body = new FormData(); body.append('file', file); return unwrap<UploadResult>(http.post('/media/images', body)) },
}
export const itemApi = {
  list: (params: Params) => unwrap<PageResult<Item>>(http.get('/items', { params })),
  mine: (params: Params) => unwrap<PageResult<Item>>(http.get('/items/my', { params })),
  get: (id: number) => unwrap<Item>(http.get(`/items/${id}`)),
  create: (body: Params) => unwrap<void>(http.post('/items', body)),
  update: (id: number, body: Params) => unwrap<void>(http.put(`/items/${id}`, body)),
  status: (id: number, status: string) => unwrap<void>(http.put(`/items/${id}/status`, null, { params: { status } })),
}
export const lostFoundApi = {
  list: (params: Params) => unwrap<PageResult<LostFound>>(http.get('/lost-found', { params })),
  mine: (params: Params) => unwrap<PageResult<LostFound>>(http.get('/lost-found/my', { params })),
  get: (id: number) => unwrap<LostFound>(http.get(`/lost-found/${id}`)),
  create: (body: Params) => unwrap<void>(http.post('/lost-found', body)),
  update: (id: number, body: Params) => unwrap<void>(http.put(`/lost-found/${id}`, body)),
  status: (id: number, status: string) => unwrap<void>(http.put(`/lost-found/${id}/status`, null, { params: { status } })),
  claim: (id: number, body: Params) => unwrap<void>(http.post(`/lost-found/${id}/claims`, body)),
}
export const favoriteApi = {
  list: (params: Params) => unwrap<PageResult<Item>>(http.get('/favorites', { params })),
  check: (id: number) => unwrap<boolean>(http.get(`/favorites/check/${id}`)),
  count: (id: number) => unwrap<number>(http.get(`/favorites/count/${id}`)),
  add: (id: number) => unwrap<void>(http.post(`/favorites/${id}`)),
  remove: (id: number) => unwrap<void>(http.delete(`/favorites/${id}`)),
}
export const messageApi = {
  conversations: () => unwrap<Conversation[]>(http.get('/messages/conversations')),
  messages: (id: number) => unwrap<Message[]>(http.get(`/messages/conversations/${id}`)),
  send: (body: { itemId: number; receiverId: number; content: string }) => unwrap<Message>(http.post('/messages', body)),
  read: (id: number) => unwrap<void>(http.put(`/messages/conversations/${id}/read`)),
}
export const reportApi = {
  create: (body: Params) => unwrap<void>(http.post('/reports', body)),
  mine: (params: Params) => unwrap<PageResult<Report>>(http.get('/reports/my', { params })),
}
export const claimApi = { mine: (params: Params) => unwrap<PageResult<Claim>>(http.get('/claims/my', { params })) }
export const adminApi = {
  dashboard: () => unwrap<Dashboard>(http.get('/admin/dashboard')),
  users: (params: Params) => unwrap<PageResult<AdminUser>>(http.get('/admin/users', { params })),
  setUserStatus: (id: number, body: Params) => unwrap<void>(http.put(`/admin/users/${id}/status`, body)),
  reviews: (params: Params) => unwrap<PageResult<Review>>(http.get('/admin/reviews', { params })),
  decideReview: (id: number, body: Params) => unwrap<void>(http.post(`/admin/reviews/${id}/decision`, body)),
  reports: (params: Params) => unwrap<PageResult<Report>>(http.get('/reports/admin', { params })),
  handleReport: (id: number, body: Params) => unwrap<void>(http.put(`/reports/admin/${id}`, body)),
  claims: (params: Params) => unwrap<PageResult<Claim>>(http.get('/admin/claims', { params })),
  decideClaim: (id: number, approved: boolean, reviewNote: string) => unwrap<void>(http.put(`/admin/claims/${id}/${approved ? 'approve' : 'reject'}`, { reviewNote })),
  categories: () => unwrap<Category[]>(http.get('/admin/categories')),
  createCategory: (body: Params) => unwrap<void>(http.post('/admin/categories', body)),
  updateCategory: (id: number, body: Params) => unwrap<void>(http.put(`/admin/categories/${id}`, body)),
  deleteCategory: (id: number) => unwrap<void>(http.delete(`/admin/categories/${id}`)),
  announcements: (params: Params) => unwrap<PageResult<Announcement>>(http.get('/admin/announcements', { params })),
  createAnnouncement: (body: Params) => unwrap<void>(http.post('/admin/announcements', body)),
  updateAnnouncement: (id: number, body: Params) => unwrap<void>(http.put(`/admin/announcements/${id}`, body)),
  deleteAnnouncement: (id: number) => unwrap<void>(http.delete(`/admin/announcements/${id}`)),
  auditLogs: (params: Params) => unwrap<PageResult<AuditLog>>(http.get('/admin/audit-logs', { params })),
}
