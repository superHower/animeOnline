import request from '@/utils/request'

// 注册接口
export const userRegisterService = ({ account, name, gender, age, pwd}) =>
  request.post('/user/register', { account, name, gender, age, pwd})
// 登录接口
export const userLoginService = ({ account, pwd }) =>
  request.post('/user/login', { account, pwd })
// 获取用户基本信息
export const userGetListService = () =>
    request.get('/user/list')

export const userDetailInfoService = (account, pwd) =>
    request.get('/user/info', {params: {account, pwd}})

// 更新用户基本信息
export const userUpdateInfoService = ({ id, name, age }) =>
  request.put('/user/userinfo', { id, name, age })

// 更新用户密码
export const userUpdatePasswordService = ({ id, old_pwd, new_pwd, re_pwd }) =>
  request.patch('/user/updatepwd', { id, old_pwd, new_pwd, re_pwd })



