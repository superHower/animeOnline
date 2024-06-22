import axios from 'axios'
import { useUserStore } from '@/stores'
import router from '@/router'
import {ElMessage} from "element-plus";
const baseURL = import.meta.env.MODE === 'development' ? 'http://43.143.243.137:8088' : 'http://43.143.243.137:8088'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 5000
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const useStore = useUserStore()
    // 登录注册除外
    if (config.url === '/user/login' || config.url === '/user/register'  || config.url === '/upload/single' || config.url === '/upload/multiple'){
      return config
    }
    if (useStore.token) {
      config.headers.Authorization = useStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // TODO 4. 摘取核心响应数据
    if (res.data.code === 200) {

      return Promise.resolve(res.data);
    } else if (res.data.code === 401) {
      ElMessage.error(res.data.message);
      router.push('/login');
      return Promise.reject(res);
    }
    return Promise.reject(res);
  },
  (err) => {
    if (err.response?.status === 500) {
      ElMessage.error(err.response.data.message || '服务异常!');
      return Promise.reject(err);
    }
    return Promise.reject(err);
  }
);

export default instance
export { baseURL }
