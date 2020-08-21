<template>
  <div id="app">
     <el-upload
    action=""
    :show-file-list="false"
    :http-request="resolveQR"
  >
    <el-button
      type="success"
    >上传</el-button>
  </el-upload>
  <img ref="qrcode" src="./assets/qrimg.png" alt="">
  <el-button @click="handleClick">解析在线二维码</el-button>
  <el-button @click="handleClick2">解析图片</el-button>
  {{codeurl}}
  </div>
</template>

<script>
import QrCode from 'qrcode-decoder'

// import HelloWorld from './components/HelloWorld.vue'
import { getQrUrl } from "./qrCode";
export default {
  name: 'app',
  components: {
    // HelloWorld
  },
  data(){
    return{
      codeurl: ''
    }
  },
  methods: {
    resolveQR(event) {
      const result = getQrUrl(event.file)
      result.then(res => {
        if (res.data) {
          console.log(res.data)
          this.codeurl = res.data
          this.$message.success('识别二维码成功!')
        } else {
          console.log(res);
          this.$message.error('识别二维码失败, 请重新上传')
        }
      }).catch(err => {
        console.log(err);
        this.$message.error(JSON.stringify(err))
      })
    },
    handleClick(){
      var qr = new QrCode();
      let img = this.$refs['qrcode']
      console.log(img);
      qr.decodeFromImage("https://yugasun.com/static/wechat.jpg",{
        crossOrigin: "anonymous"
      }).then((res) => {
        console.log(res.data)
        this.codeurl = res.data
      });
    },
    handleClick2(){
      var qr = new QrCode();
      let img = this.$refs['qrcode']
      console.log(img);
      qr.decodeFromImage(img,{
        crossOrigin: "anonymous"
      }).then((res) => {
        console.log(res.data)
        this.codeurl = res.data
      });
    }
  }

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
