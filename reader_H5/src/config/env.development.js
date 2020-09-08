// 本地环境配置
module.exports = {
  env: 'development',
  title: '代理端-开发',
  uploadUrl: 'http://192.168.1.122:8081', //nginx电子书目录地址
  // resUrl: 'http://192.168.1.122:8081', // 静态资源路径
  baseApi: 'http://zhaohe.utools.club', // 本地api请求地址,注意：如果你使用了代理，请设置成'/'
  APPID: 'xxx',
  APPSECRET: 'xxx',
  $cdn: 'https://imgs.solui.cn'
}
