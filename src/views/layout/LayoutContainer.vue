<script setup>
import {
  User,
  Crop,
  HomeFilled,
  EditPen,
  SwitchButton,
  CaretBottom
} from '@element-plus/icons-vue'
// import avatar from '@/assets/default.png'
import { useUserStore } from '@/stores'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'

const activeIndex = ref('1');
const userStore = useUserStore()
const router = useRouter()

const info = reactive({
  account: '',
  name:'',
  gender :''
})

onMounted(() => {

  info.account = userStore.user.account
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

const handleSelect = (index) => {
  console.log('选中的菜单项索引:', index);
  // 可以在这里添加逻辑，比如根据索引切换页面等
};
</script>

<template>
  <el-container class="layout-container">
    <el-container>
      <div class="header">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false" @select="handleSelect">
          <el-menu-item index="1" @click="goIndex"><el-icon><HomeFilled /></el-icon>首页</el-menu-item>
          <el-menu-item index="2"><el-icon><HomeFilled /></el-icon>查看动漫</el-menu-item>
          <el-menu-item index="6"><el-icon><HomeFilled /></el-icon>关于</el-menu-item>
        </el-menu>

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

      </div>

      <div class="main" style="">
        <router-view></router-view>
      </div>

      <div class="foot"> Hower动漫 | ©2023-12-20 | Developed by Hower |
        <span> 网站备案号：</span>
          <a href="https://beian.miit.gov.cn/" target="https://beian.miit.gov.cn/">	京ICP备2024063056号</a>
      </div>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {

  height: 100vh;
  width: 100%;
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px; /* 设置header的高度 */
    background-image: url('@/assets/image/bg.png');
    z-index: 1000; 
    
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-menu {
      background-color: transparent;
      border: none;
      color: #fff;
      font-size: 16px;
      .el-menu-item {
        color: #fff;
        font-size: 16px;
      }
    }
    .el-menu-demo {
       height: 40px;
    }

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
  .main {
    width: calc(100% - 40px );
    position: absolute;
    padding: 0 20px; 
    top: 60px;
  }
  .foot {
    position: absolute;
    width: 100%;
    height: 30px;
    bottom: 0;
    display: flex;
    align-items: center;

    justify-content: center;
    font-size: 12px;
    color: #666;
    a {
      color: #666;
      text-decoration: none;
    }
  }
}
</style>
