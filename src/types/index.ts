export interface ApiResult<T> { code: number; msg: string; data: T }
export interface PageResult<T> { records: T[]; total: number; size: number; current: number; pages: number }
export interface Session { token: string; userId: number; nickname: string; role: 'USER' | 'ADMIN' | 'SUPER_ADMIN' }
export interface UserProfile { id: number; username: string; nickname: string; email?: string; phone?: string; avatar?: string; role: string; status: 'ACTIVE' | 'WARNED' | 'MUTED' | 'BANNED'; createTime: string }
export interface Category { id: number; name: string; sortOrder: number; createTime?: string; updateTime?: string }
export interface Announcement { id: number; title: string; content: string; isActive: boolean; createTime: string; updateTime: string }
export interface Item { id: number; userId: number; title: string; description?: string; price: number; originalPrice?: number; category: string; status: string; images?: string; viewCount: number; createTime: string; updateTime: string; publisherNickname?: string; publisherAvatar?: string }
export interface LostFound { id: number; userId: number; title: string; description?: string; type: 'LOST' | 'FOUND'; location: string; contact: string; images?: string; status: string; lostTime: string; createTime: string; updateTime: string; publisherNickname?: string; publisherAvatar?: string }
export interface Claim { id: number; lostFoundId: number; claimantId: number; claimantNickname?: string; lostFoundTitle?: string; lostFoundType?: string; message: string; contact: string; verification?: string; status: string; reviewerId?: number; reviewNote?: string; createTime: string; updateTime: string }
export interface Conversation { id: number; itemId: number; user1Id: number; user2Id: number; lastMessage?: string; lastTime?: string; unreadCount: number; otherUserId: number; otherNickname: string; otherAvatar?: string }
export interface Message { id: number; conversationId: number; senderId: number; receiverId: number; content: string; type: string; isRead: boolean; createTime: string }
export interface Report { id: number; reporterId: number; targetType: 'ITEM' | 'LOST_FOUND' | 'USER'; targetId: number; targetLabel?: string; reason: string; riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'; description?: string; status: string; reviewerId?: number; reviewNote?: string; createTime: string; updateTime: string }
export interface Review { id: number; targetType: 'ITEM' | 'LOST_FOUND'; targetId: number; targetTitle?: string; targetStatus?: string; submitterId: number; reviewerId?: number; status: string; reviewNote?: string; createTime: string; updateTime: string }
export interface AdminUser extends UserProfile { banUntil?: string }
export interface Dashboard { totalUsers: number; totalItems: number; pendingReviews: number; pendingReports: number }
export interface AuditLog { id: number; adminId: number; action: string; targetType: string; targetId?: number; detail?: string; createTime: string }
export interface UploadResult { url: string; originalName: string; size: number }
