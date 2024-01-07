import { defineStore } from 'pinia'
import { ref } from 'vue'
import {userDetailInfoService} from '@/api/user'

// 用户模块 token setToken removeToken
export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('')
    const setToken = (newToken) => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }

    const user = ref({})
    const getUser = async (account, pwd) => {
      const res = await userDetailInfoService(account, pwd) // 请求获取数据
      user.value = res.data.data
      console.log(res)
    }
    const setUser = (obj) => {
      user.value = obj
    }

    return {
      token,
      setToken,
      removeToken,
      user,
      getUser,
      setUser
    }
  },
  {
    persist: true
  }
)
