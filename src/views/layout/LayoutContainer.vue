<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  HomeFilled,
  EditPen,
  SwitchButton,
  CaretBottom
} from '@element-plus/icons-vue'
// import avatar from '@/assets/default.png'
import { useUserStore } from '@/stores'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { jwtDecode } from 'jwt-decode'
import { reactive } from 'vue'
import {userDetailInfoService} from "@/api/user.js";

const userStore = useUserStore()
const router = useRouter()

const info = reactive({
  account: '',
  name:'',
  gender :''
})

onMounted(() => {
  const account = jwtDecode(userStore.token).account
  const pwd = jwtDecode(userStore.token).pwd
  info.account = account
  userStore.getUser(account, pwd)
  info.name = userStore.user.name
  info.gender = userStore.user.gender

})
const handleCommand = async (key) => {
  if (key === 'logout') {
    console.log("退出")
    // 退出操作
    await ElMessageBox.confirm('你确认要进行退出么', '温馨提示', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    })

    // 清除本地的数据 (token + user信息)
    userStore.removeToken()
    userStore.setUser({})
    router.push('/login')
  }
}

const goIndex = () => {
  router.push('/')
}
</script>

<template>
  <el-container class="layout-container">
    <el-container>
      <el-header>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false" @select="handleSelect">
          <el-menu-item index="1" @click="goIndex"><el-icon><HomeFilled /></el-icon>首页</el-menu-item>
          <el-menu-item index="2"><el-icon><HomeFilled /></el-icon>查看动漫</el-menu-item>
          <el-menu-item index="6"><el-icon><HomeFilled /></el-icon>关于</el-menu-item>
        </el-menu>

        <el-form>
          <el-input type="input" placeholder="搜索"></el-input>
        </el-form>

        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false" @select="handleSelect">
          <span class="el-dropdown__box">
            <el-menu-item index="1"><el-icon><HomeFilled /></el-icon>账号：<strong> {{ info.account }}</strong></el-menu-item>
            <el-menu-item index="2"><el-icon><HomeFilled /></el-icon>用户名：<strong> {{ info.name  }}</strong></el-menu-item>
            <el-menu-item index="3"><el-icon><HomeFilled /></el-icon>性别：<strong> {{ info.gender  }}</strong></el-menu-item>
          </span>
          <el-dropdown placement="bottom-end" @command="handleCommand">
            <!-- 展示给用户，默认看到的 -->
            <span class="el-dropdown__box"><el-icon><CaretBottom /></el-icon></span>

            <!-- 折叠的下拉部分 -->
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile" :icon="User">基本资料</el-dropdown-item>
                <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
                <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>
                <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-menu>

      </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>

      <el-footer> 动漫网站 ©2023 Created by Hower </el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {

  height: 100vh;
  .el-header {
    width: 100%;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-dropdown__box {
      display: flex;
      align-items: center;
      .el-icon {
        color: #22d5ce;
        margin-left: 10px;
        font-size: 24px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
