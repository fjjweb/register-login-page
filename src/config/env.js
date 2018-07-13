/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 *
 */

let baseUrl = '/weixinservice'
// 开发 生产
// if (process.env.NODE_ENV === 'development') {
//   // baseUrl = 'http://template.99114.cn'
//   baseUrl = '/weixinservice'
// } else if (process.env.NODE_ENV === 'production') {
//   baseUrl = ''
// }

export {
  baseUrl
}
