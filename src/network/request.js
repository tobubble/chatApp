import axios from 'axios'
import ip from '../common/ipconfig'

const instance1 = axios.create({
  // baseURL: '/api',
  // baseURL: 'http://127.0.0.1:3000/',
  baseURL:  ip + '/',
  // timeout: 5000
})

instance1.interceptors.request.use(config => {
  const token = window.sessionStorage.getItem('token') || ''
  if (!token) {
    return config
  }
  config.headers.Authorization = token
  return config
})

instance1.interceptors.response.use(config => {
  return config
})

export default instance1