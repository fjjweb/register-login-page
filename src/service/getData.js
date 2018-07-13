import fetch from '../config/fetch'
// 刚进页面判断路径请求
export const goIndex = code => fetch('/getwxmember?code=' + code)

// 获取验证码的接口
export const mobileCode = (tel) => fetch('/securitycode/send?mobile=' + tel)

// 调用登录或者注册接口
export const login = (id, tel, code) => fetch('/loginorregister?id=' + id + '&mobile=' + tel + '&securityCode=' + code)
