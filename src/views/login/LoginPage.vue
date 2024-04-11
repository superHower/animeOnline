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
    </el-col>
    <div class="beian">
      <span>wwww.hower.fun | @ Developed by Hower | 网站备案号</span>
      <a href="https://beian.miit.gov.cn/" target="https://beian.miit.gov.cn/">豫ICP备2023030938号</a>
    </div>
  </el-row>

</template>

<style lang="scss" scoped>
.login-page {
  display: flex;
  height: 100vh; // 100vh 表示占据视口的100%
  background-color: #fff;
  .bg {
    position: relative;
    top: 1%;
  
    height: 98%;
  
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
  .beian {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    color: #666;
    font-size: 13px;
    text-align: center;
    padding: 10px;
    background-color: rgba(245, 245, 245, 0.3);
    a {
      text-decoration: none;
      color: #666;
      margin: 0 10px;
    }
  }
}
</style>
