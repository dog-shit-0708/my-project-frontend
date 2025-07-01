<template>
  <div class="container">
  <div class="login-wrapper">
    <div class="form-container">
      <h2>登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <p>用户名:</p>
          <input
              type="text"
              id="username"
              v-model="loginForm.username"
              placeholder="请输入用户名"
              required
              class="input-item"
          />
        </div>
        <div class="form-group">
          <p>密码:</p>
          <input
              type="password"
              id="password"
              v-model="loginForm.password"
              placeholder="请输入密码"
              required
              class="input-item"
          />
        </div>

        <input type="submit" value="登录" :disabled="loading" class="btn" />
      </form>
      <p class="register-link">
        还没有账户？<router-link to="/register">立即注册</router-link>
      </p>
    </div>
  </div>
  </div>
</template>

<script setup>
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { login } from '@/api/user'
  import '@/views/login/style/login.scss'; // 导入login页面的样式文件

  const router = useRouter()
  const loading = ref(false)

  const loginForm = reactive({
  username: '',
  password: '',

})

  const handleLogin = async () => {
  console.log('点击了登录')
  if (!loginForm.username || !loginForm.password) {
  ElMessage.error('请输入账号和密码')
  return
}

  loading.value = true
  try {
  const res = await login(loginForm.username, loginForm.password)
  console.log('res', res)

  // 假设后端返回json，并存储
  if (res && res.id) {
  localStorage.setItem('id', res.id)
  ElMessage.success('登录成功')
  router.push('/home') // 登录成功跳转到首页
} else {
  // 如果后端没有返回token，但请求成功，可能需要根据实际业务逻辑处理
  ElMessage.error(res.message || '登录失败：服务器响应异常')
}

} catch (error) {
  ElMessage.error(error.response?.data?.message || '登录失败，请检查用户名和密码')
} finally {
  loading.value = false
}
}


</script>

  <style lang="scss" scoped>
    /* 样式已迁移到 src/views/login/style/login.scss */
  </style>
