import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
  baseURL: 'http://localhost:8080/api', // 后端接口基础地址
  timeout: 5000
})

// 请求拦截器（可选：带 token）
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器（可选：直接返回 data）
request.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
)

// 登录方法
export const login = (username, password) => {
  return request.post('/login', {
    username,
    password // 直接传明文
  })
}

// 注册方法
export const register = (data) => {
  return request.post('/register', data)
}

export default request



