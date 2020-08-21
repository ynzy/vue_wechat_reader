// 引入qrcode-decoder
import QrCode from 'qrcode-decoder'

// 传入file对象，返回promise
export function getQrUrl(file) {
  // 获取临时路径 chrome有效，其他浏览器的方法请自行查找
  const url = getObjectURL(file)
  console.log(url);
  // 初始化
  const qr = new QrCode()
  // 解析二维码，返回promise
  return qr.decodeFromImage(url)
}

var getObjectURL = function (file) {
  var url = null;
  if (window.createObjectURL != undefined) { // basic
    url = window.createObjectURL(file);
  } else if (window.URL != undefined) { // mozilla(firefox)
    url = window.URL.createObjectURL(file);
  } else if (window.webkitURL != undefined) { // webkit or chrome
    url = window.webkitURL.createObjectURL(file);
  }
  return url;
}