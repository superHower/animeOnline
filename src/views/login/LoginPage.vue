<script setup>
import {userRegisterService, userLoginService} from '@/api/user.js'
import { User, Lock } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {useUserStore} from "@/stores";

const form = ref()
const isRegister = ref(false)

// 用于提交的， 整个的form数据对象
const formModel = ref({
  account: '',
  name: '',
  pwd: '',
  repassword: '',
  gender: '',
  age: '',

})

// rules: 整个表单的校验规则
const rules = {
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        const parsedValue = parseInt(value, 10)
        if (isNaN(parsedValue)) callback(new Error('学号必须为纯数字'))
        else callback()
      },
      trigger: 'blur'
    }
  ],
  name: [
    // 1. 非空校验
    { required: true, message: '请输入姓名', trigger: 'blur' },
    // 2. 长度校验
    { min: 2, max: 5, message: '用户名必须是 2-5位 的字符', trigger: 'blur' }
  ],
  pwd: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      // 3. 正则校验
      pattern: /^\S{3,15}$/,
      message: '密码必须是 3-15位 的非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{3,15}$/,
      message: '密码必须是 3-15位 的非空字符',
      trigger: 'blur'
    },
    {
      // 4. 自定义校验
      validator: (rule, value, callback) => {
        // 判断 value 和 当前 form 中收集的 password 是否一致
        if (value !== formModel.value.pwd) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback() // 就算校验成功，也需要callback
        }
      },
      trigger: 'blur'
    }
  ],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    // 自定义校验函数
    {
      validator: (rule, value, callback) => {
        const parsedValue = parseInt(value, 10)
        if (isNaN(parsedValue)) {
          callback(new Error('年龄必须为数字'))
        } else if (parsedValue < 12 || parsedValue > 60) {
          callback(new Error('年龄必须在 12 到 60 之间'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],


}

const register = async () => {
  await form.value.validate(); // 表单预校验
  await userRegisterService(formModel.value); // 调用学生注册方法
  console.log("下面是表单信息")
  console.log(formModel.value);
  ElMessage.success('注册成功');
  isRegister.value = false;
}

const userStore = useUserStore()
const router = useRouter()
const login = async () => {
  await form.value.validate() // 表单预校验
  const res = await userLoginService({
    account: formModel.value.account,
    pwd: formModel.value.pwd
  });
  console.log(res)
  userStore.removeToken
  userStore.setToken(res.token)
  userStore.removeUser
  userStore.setUser(res.data)
  router.push('/')
}


// 监视切换的时候，重置表单内容
watch(isRegister, () => {
  formModel.value = {
    name: '',
    pwd: '',
    repassword: '',
    gender: '',
    age: '',
    account:''

  }
})
</script>

<template>
  <el-row class="login-page">
    <el-col :span="8" :offset="3" class="bg"></el-col>
    <el-col :span="8" :offset="1" class="form">
      <!-- 注册相关表单 -->

      <el-form :model="formModel" :rules="rules" ref="form" size="large" autocomplete="off" v-if="isRegister">
        <h3><strong>欢迎注册</strong></h3>
        <el-row>
          <el-col :span="13">
            <el-form-item prop="name"><el-input v-model="formModel.name" :prefix-icon="User" placeholder="请输入昵称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="1">
            <el-form-item prop="gender">
              <el-select v-model="formModel.gender" placeholder="请选择性别">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item prop="age"><el-input v-model="formModel.age" :prefix-icon="User" placeholder="请输入年龄"></el-input></el-form-item>
          </el-col>
        </el-row>
        <el-form-item prop="pwd"><el-input v-model="formModel.pwd" :prefix-icon="Lock" type="password" placeholder="请输入密码"></el-input></el-form-item>
        <el-form-item prop="repassword"><el-input v-model="formModel.repassword" :prefix-icon="Lock" type="password" placeholder="请输入再次密码"></el-input></el-form-item>
          <el-form-item prop="account"><el-input v-model="formModel.account" :prefix-icon="User" placeholder="请输入学号"></el-input></el-form-item>

          <el-form-item>
            <el-button @click="register" class="button" type="primary" auto-insert-space>注册</el-button>
          </el-form-item>

        <br />
        <el-form-item class="flex"><el-link type="info" :underline="false" @click="isRegister = false"> ← 返回 </el-link></el-form-item>
      </el-form>

      <!-- 登录相关表单 -->
      <el-form :model="formModel" :rules="rules" ref="form" size="large" autocomplete="off" v-else>
        <el-form-item><h1>欢迎登录</h1></el-form-item>
        <el-form-item prop="account"><el-input v-model="formModel.account" :prefix-icon="User" placeholder="请输入用户名"></el-input></el-form-item>
        <el-form-item prop="pwd"><el-input v-model="formModel.pwd" name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码"></el-input></el-form-item>
        <el-form-item class="flex"><div class="flex"><el-checkbox>记住我</el-checkbox><el-link type="primary" :underline="false">忘记密码？</el-link></div></el-form-item>
        <el-form-item><el-button @click="login" class="button" type="primary" auto-insert-space>登录</el-button></el-form-item>
        <el-form-item class="flex"><el-link type="info" :underline="false" @click="isRegister = true"> 注册 → </el-link></el-form-item>
      </el-form>
      <div style="height: 200px"></div>
    </el-col>
    <el-col :span="3" :offset="1">
      <div class="author">
        <div>开发者</div>
        <a href="https://github.com/superHower" target="_blank" rel="noopener noreferrer">
          <svg height="50" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="50" data-view-component="true" class="octicon octicon-mark-github v-align-middle color-fg-default">
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
          </svg>
        </a>
      </div>
   
    </el-col>
    <div class="beian">
      <span>wwww.hower.fun | @ Developed by Hower | 网站备案号</span>
      <a href="https://beian.miit.gov.cn/" target="https://beian.miit.gov.cn/">豫ICP备2023030938号</a>
    </div>
  </el-row>
  

  <svg class="bolang" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 250">
    <path fill="#0099ff" fill-opacity="1" d="M0,160L40,133.3C80,107,160,53,240,42.7C320,32,400,64,480,69.3C560,75,640,53,720,69.3C800,85,880,139,960,149.3C1040,160,1120,128,1200,101.3C1280,75,1360,53,1400,42.7L1440,32L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
  </svg>

</template>

<style lang="scss" scoped>
.bolang {
  position: absolute;
  bottom: 0;
  opacity: 0.3;
}
.login-page {
  display: flex;
  height: 100vh; // 100vh 表示占据视口的100%
  background-color: #fff;
  .bg {
    position: relative;
    top: 1%;
  
    height: 80%;
  
    background: url('@/assets/image/粉色2.jpg') no-repeat center / 100% 100%;
    border-radius: 0 20px 20px 0;
  }
  .form {

    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    h3 {
      text-align: center;
      color: #b88230;
    }
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
  .author {
    display: flex;
    justify-content: flex-start;
    margin-top: 150px;
  }
  .beian {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    color: #666;
    font-size: 13px;
    text-align: center;
    padding: 10px;
    z-index: 1;
    a {
      text-decoration: none;
      color: #666;
      margin: 0 10px;
    }
  }
}
</style>
