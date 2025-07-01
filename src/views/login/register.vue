<template>
  <div class="container">
    <div class="login-wrapper">
      <div class="form-container">
        <h2>注册</h2>
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label for="username">用户名:</label>
            <input
                type="text"
                id="username"
                v-model="loginForm.username"
                placeholder="请输入账号"
                required
                class="input-item"
            />
          </div>
          <div class="form-group">
            <label for="password">密码:</label>
            <input
                type="password"
                id="password"
                v-model="loginForm.password"
                placeholder="请输入密码"
                required
                class="input-item"
            />
          </div>
          <div class="form-group">
            <label for="phone">手机号:</label>
            <input
                type="text"
                id="phone"
                v-model="loginForm.phone"
                placeholder="请输入手机号"
                required
                class="input-item"
            />
          </div>
          <div class="form-group">
            <label for="email">邮箱:</label>
            <input
                type="email"
                id="email"
                v-model="loginForm.email"
                placeholder="请输入邮箱"
                required
                class="input-item"
            />
          </div>
          <input type="submit" value="注册" :disabled="loading" class="btn" />
        </form>
        <p class="register-link">
        <router-link to="/login">返回登录</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { register } from '@/api/user'
import '@/views/login/style/register.scss'; // 导入login页面的样式文件

const router = useRouter()
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
  phone: '',
  email: ''
})

const handleRegister = async () => {
  if (!loginForm.username || !loginForm.password || !loginForm.phone || !loginForm.email) {
    ElMessage.error('请填写完整信息')
    return
  }
  loading.value = true
  try {
    const res = await register({
      username: loginForm.username,
      password: loginForm.password,
      phone: loginForm.phone,
      email: loginForm.email
    })
    if (res === '注册成功') {
      ElMessage.success('注册成功')
      router.push('/login')
    } else {
      ElMessage.error(res || '注册失败')
    }
  } catch (error) {
    ElMessage.error(error.response?.data || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
/* 样式已迁移到 src/views/login/style/login.scss */
</style>
