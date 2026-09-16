<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { authApi } from '@/api'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const isLogin = computed(() => route.params.mode === 'login')
const loading = ref(false)
const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  nickname: '',
})

watch(isLogin, () =>
  Object.assign(form, {
    username: '',
    password: '',
    confirmPassword: '',
    nickname: '',
  }),
)

async function submit() {
  if (!form.username.trim() || !form.password)
    return ElMessage.warning('请填写用户名和密码')
  if (
    !isLogin.value &&
    (!form.nickname.trim() ||
      form.password.length < 6 ||
      form.password !== form.confirmPassword)
  ) {
    return ElMessage.warning(
      form.password.length < 6
        ? '密码至少 6 位'
        : form.password !== form.confirmPassword
          ? '两次密码不一致'
          : '请填写昵称',
    )
  }
  loading.value = true
  try {
    if (isLogin.value) {
      await auth.login(form.username, form.password)
      ElMessage.success('欢迎回来')
      router.replace(
        String(route.query.redirect || (auth.isAdmin ? '/admin' : '/')),
      )
    } else {
      await authApi.register({
        username: form.username,
        password: form.password,
        nickname: form.nickname,
      })
      ElMessage.success('注册成功，请登录')
      router.replace('/auth/login')
    }
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="auth-page">
    <div class="auth-box">
      <RouterLink class="auth-logo" to="/">
        <span class="brand-mark">拾</span>
        <div>
          <h1>{{ isLogin ? '登录拾光集市' : '创建拾光账号' }}</h1>
          <p>{{ isLogin ? '继续发现身边的好物与善意' : '加入真实友善的社区集市' }}</p>
        </div>
      </RouterLink>
      <el-form label-position="top" @submit.prevent="submit">
        <el-form-item label="用户名" required>
          <el-input
            v-model="form.username"
            size="large"
            maxlength="50"
            autocomplete="username"
          />
        </el-form-item>
        <el-form-item v-if="!isLogin" label="昵称" required>
          <el-input
            v-model="form.nickname"
            size="large"
            maxlength="30"
          />
        </el-form-item>
        <el-form-item label="密码" required>
          <el-input
            v-model="form.password"
            size="large"
            type="password"
            show-password
            autocomplete="current-password"
            @keyup.enter="submit"
          />
        </el-form-item>
        <el-form-item v-if="!isLogin" label="确认密码" required>
          <el-input
            v-model="form.confirmPassword"
            size="large"
            type="password"
            show-password
            @keyup.enter="submit"
          />
        </el-form-item>
        <el-button
          native-type="submit"
          type="primary"
          size="large"
          style="width: 100%"
          :loading="loading"
        >
          {{ isLogin ? '登录' : '注册' }}
        </el-button>
      </el-form>
      <p class="auth-switch">
        {{ isLogin ? '还没有账号？' : '已有账号？' }}
        <RouterLink :to="isLogin ? '/auth/register' : '/auth/login'">
          {{ isLogin ? '立即注册' : '返回登录' }}
        </RouterLink>
      </p>
    </div>
  </div>
</template>