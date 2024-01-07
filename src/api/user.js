import request from '@/utils/request'

// 注册接口
export const userRegisterService = ({ number, name, gender, age, pwd}) =>
  request.post('/register', { number, name, gender, age, pwd})
// 登录接口
export const userLoginService = ({ account, pwd }) =>
  request.post('/login', { account, pwd })
// 获取用户基本信息
export const userGetListService = () =>
    request.get('/user/list')
export const userDetailInfoService = (account, pwd) =>
    request.get('/user/info', {params: {account, pwd}})

// 更新用户基本信息
export const userUpdateInfoService = ({ id, nickname, email }) =>
  request.put('/my/userinfo', { id, nickname, email })

// 更新用户密码
export const userUpdatePasswordService = ({ old_pwd, new_pwd, re_pwd }) =>
  request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
