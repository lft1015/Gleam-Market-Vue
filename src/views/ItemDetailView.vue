<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit3, Flag, Heart, MessageCircle, PackageCheck } from 'lucide-vue-next'
import { favoriteApi, itemApi, messageApi } from '@/api'
import type { Item } from '@/types'
import { formatMoney, formatTime, parseImages } from '@/utils/format'
import { useAuthStore } from '@/stores/auth'
import ImageGallery from '@/components/ImageGallery.vue'
import PageState from '@/components/PageState.vue'
import ReportDialog from '@/components/ReportDialog.vue'
import StatusTag from '@/components/StatusTag.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const item = ref<Item>()
const loading = ref(true)
const error = ref('')
const favorited = ref(false)
const favoriteCount = ref(0)
const reportOpen = ref(false)
const contactOpen = ref(false)
const firstMessage = ref('你好，请问这件物品还在吗？')
const sending = ref(false)
const itemId = Number(route.params.id)
const isOwner = computed(() => auth.session?.userId === item.value?.userId)

async function load() {
  loading.value = true
  error.value = ''
  try {
    item.value = await itemApi.get(itemId)
    favoriteCount.value = await favoriteApi.count(itemId).catch(() => 0)
    if (auth.isLoggedIn) favorited.value = await favoriteApi.check(itemId).catch(() => false)
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}

function requireLogin() {
  if (!auth.isLoggedIn) {
    router.push({ path: '/auth/login', query: { redirect: route.fullPath } })
    return false
  }
  return true
}

async function toggleFavorite() {
  if (!requireLogin()) return
  favorited.value ? await favoriteApi.remove(itemId) : await favoriteApi.add(itemId)
  favorited.value = !favorited.value
  favoriteCount.value += favorited.value ? 1 : -1
  ElMessage.success(favorited.value ? '已加入收藏' : '已取消收藏')
}

async function contact() {
  if (!requireLogin() || !item.value || isOwner.value) return
  contactOpen.value = true
}

async function sendFirst() {
  if (!item.value || !firstMessage.value.trim()) return
  sending.value = true
  try {
    const message = await messageApi.send({
      itemId,
      receiverId: item.value.userId,
      content: firstMessage.value.trim(),
    })
    contactOpen.value = false
    router.push(`/messages/${message.conversationId}`)
  } finally { sending.value = false }
}

async function changeStatus(status: string, label: string) {
  await ElMessageBox.confirm(`确认将商品标记为"${label}"吗？`, '更新商品状态', { type: 'warning' })
  await itemApi.status(itemId, status)
  ElMessage.success('状态已更新')
  load()
}

onMounted(load)
</script>
<template>
  <PageState :loading="loading" :error="error" :empty="!item" @retry="load">
    <template #content>
      <div v-if="item">
        <div class="detail-layout">
          <ImageGallery :images="parseImages(item.images)" :alt="item.title" />
          <aside class="detail-panel">
            <div style="display: flex; justify-content: space-between; gap: 10px">
              <StatusTag :status="item.status" />
              <span style="color: var(--ink-500)">浏览 {{ item.viewCount || 0 }}</span>
            </div>
            <h1>{{ item.title }}</h1>
            <div class="detail-price">
              {{ formatMoney(item.price) }}
              <span v-if="item.originalPrice" class="old-price">{{ formatMoney(item.originalPrice) }}</span>
            </div>
            <div class="detail-meta">
              <span>分类：{{ item.category }}</span>
              <span>发布：{{ formatTime(item.createTime, 'MM-DD HH:mm') }}</span>
            </div>
            <div class="owner-row">
              <el-avatar :src="item.publisherAvatar">
                {{ (item.publisherNickname || '用户').slice(0, 1) }}
              </el-avatar>
              <div>
                <strong>{{ item.publisherNickname || `用户 ${item.userId}` }}</strong>
                <div style="color: var(--ink-500); font-size: 12px">真实社区用户</div>
              </div>
            </div>
            <div v-if="!isOwner" class="detail-actions">
              <el-button type="primary" :disabled="auth.isMuted" @click="contact">
                <MessageCircle :size="17" />联系卖家
              </el-button>
              <el-button :type="favorited ? 'danger' : 'default'" @click="toggleFavorite">
                <Heart :size="17" :fill="favorited ? 'currentColor' : 'none'" />{{ favoriteCount }}
              </el-button>
              <el-button text @click="requireLogin() && (reportOpen = true)">
                <Flag :size="16" />举报
              </el-button>
            </div>
            <div v-else class="detail-actions">
              <el-button type="primary" @click="router.push(`/market/${itemId}/edit`)">
                <Edit3 :size="17" />编辑商品
              </el-button>
              <el-button v-if="item.status === 'ON_SALE'" @click="changeStatus('TRADING', '交易中')">
                <PackageCheck :size="17" />开始交易
              </el-button>
              <el-button
                v-if="['ON_SALE', 'TRADING'].includes(item.status)"
                @click="changeStatus('SOLD', '已售出')"
              >
                标记售出
              </el-button>
              <el-button
                v-if="['ON_SALE', 'TRADING'].includes(item.status)"
                @click="changeStatus('OFF_SHELF', '已下架')"
              >
                下架
              </el-button>
            </div>
          </aside>
        </div>
        <section class="description">
          <h2 style="font-size: 18px">商品描述</h2>
          {{ item.description || '发布者暂未填写详细描述。' }}
        </section>
        <ReportDialog v-model="reportOpen" target-type="ITEM" :target-id="item.id" />
        <el-dialog v-model="contactOpen" title="联系卖家" width="min(480px, 92vw)">
          <el-input
            v-model="firstMessage"
            type="textarea"
            :rows="4"
            maxlength="500"
            show-word-limit
          />
          <template #footer>
            <el-button @click="contactOpen = false">取消</el-button>
            <el-button type="primary" :loading="sending" @click="sendFirst">
              发送并进入会话
            </el-button>
          </template>
        </el-dialog>
      </div>
    </template>
  </PageState>
</template>