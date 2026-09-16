<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Send } from 'lucide-vue-next'
import { messageApi } from '@/api'
import type { Conversation, Message } from '@/types'
import { formatTime } from '@/utils/format'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const conversations = ref<Conversation[]>([])
const messages = ref<Message[]>([])
const content = ref('')
const sending = ref(false)
const messagesEl = ref<HTMLElement>()
let timer: number | undefined

const activeId = computed(() => Number(route.params.conversationId || 0))
const active = computed(() => conversations.value.find((item) => item.id === activeId.value))

async function loadConversations() {
  conversations.value = await messageApi.conversations()
  auth.unreadCount = conversations.value.reduce((sum, item) => sum + (item.unreadCount || 0), 0)
}

async function loadMessages() {
  if (!activeId.value) return
  messages.value = await messageApi.messages(activeId.value)
  await messageApi.read(activeId.value)
  await loadConversations()
  nextTick(() => {
    if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  })
}

function select(id: number) {
  router.push(`/messages/${id}`)
}

async function send() {
  if (!content.value.trim() || !active.value) return
  sending.value = true
  try {
    await messageApi.send({
      itemId: active.value.itemId,
      receiverId: active.value.otherUserId,
      content: content.value.trim(),
    })
    content.value = ''
    await loadMessages()
  } finally { sending.value = false }
}

watch(activeId, loadMessages)

onMounted(async () => {
  await loadConversations()
  if (activeId.value) await loadMessages()
  timer = window.setInterval(() => {
    if (document.visibilityState === 'visible') {
      loadConversations()
      if (activeId.value) loadMessages()
    }
  }, 5000)
})

onBeforeUnmount(() => window.clearInterval(timer))
</script>
<template>
  <div class="surface message-shell" :class="{ 'has-chat': activeId }">
      <aside class="conversation-list">
        <button
          v-for="item in conversations"
          :key="item.id"
          class="conversation-item"
          :class="{ active: item.id === activeId }"
          @click="select(item.id)"
        >
          <el-avatar :src="item.otherAvatar">
            {{ (item.otherNickname || '用').slice(0, 1) }}
          </el-avatar>
          <div class="conversation-main">
            <strong>{{ item.otherNickname || `用户 ${item.otherUserId}` }}</strong>
            <span>{{ item.lastMessage || '暂无消息' }}</span>
          </div>
          <div>
            <el-badge :value="item.unreadCount" :hidden="!item.unreadCount" />
            <small>{{ formatTime(item.lastTime, 'MM-DD') }}</small>
          </div>
        </button>
        <el-empty v-if="!conversations.length" description="还没有会话" />
      </aside>
      <section class="chat-panel">
        <div v-if="active" class="chat-title">
          {{ active.otherNickname || `用户 ${active.otherUserId}` }} · 商品 #{{ active.itemId }}
        </div>
        <div v-else class="chat-title">选择一个会话</div>
        <div ref="messagesEl" class="messages">
          <div
            v-for="message in messages"
            :key="message.id"
            class="bubble-row"
            :class="{ mine: message.senderId === auth.session?.userId }"
          >
            <div class="bubble">
              {{ message.content }}
              <small>{{ formatTime(message.createTime) }}</small>
            </div>
          </div>
          <el-empty v-if="active && !messages.length" description="开始第一条消息吧" />
        </div>
        <div v-if="active" class="chat-compose">
          <el-input v-model="content" maxlength="500" placeholder="输入消息" @keyup.enter="send" />
          <el-button type="primary" :loading="sending" :disabled="auth.isMuted" @click="send">
            <Send :size="17" />发送
          </el-button>
        </div>
      </section>
    </div>
</template>