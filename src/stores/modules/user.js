import { defineStore } from 'pinia'
import { ref } from 'vue'
import {userDetailInfoService} from '@/api/user'

// 用户模块 token setToken removeToken
export const useUserStore = defineStore('big-user', () => {
    const token = ref('')
    const setToken = (newToken) => {
      console.log('设置token: ',newToken);
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
      console.log('设置用户信息: ',obj);
      user.value = obj
    }
    const removeUser = () => {
      user.value = {}
    }

    return {
      token,
      setToken,
      removeToken,
      user,
      getUser,
      setUser,
      removeUser
    }
  },
  {
    persist: true
  }
)
