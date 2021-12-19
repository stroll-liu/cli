<template>
  <div>
    <button @click="create" >创建Worker</button>
    <button @click="send" >向Worker发送数据</button>
    <button @click="close" >关闭Worker</button>
  </div>
</template>

<script>
// main.js  Vue.prototype.$tools = Tools
export default {
  data () {
    return {
      webWorker: null
    }
  },
  mounted () { },
  methods: {
    create () {
      function work () { // 向 webWorker 里传入的函数
        onerror = function (err) { // 错误处理
          console.log(err)
        }
        onmessage = function ({ data }) { // webWorker 接收数据
          // webWorker 处理数据
          const { message } = data
          let i = message + 10

          // webWorker 返回数据
          postMessage({result: i})
        }
      }
      // 创建 webWorker
      this.webWorker = new this.$tools.WebWorkerClass(work)
    },
    send () {
      if (this.webWorker) {
        // 向 webWorker 发送数据
        this.webWorker.send({ message: 1 }).then(res => { 
          if (res) {
            // 处理 webWorker 返回的数据
            this.webWorker.message().then(res => {
              console.log(res)
            })
          }
        })
      } else {
        console.log('请先创建 webWorker')
      }
    },
    close () { // 关闭 webWorker
      this.webWorker && this.webWorker.close()
      this.webWorker = null
    }
  }
}
</script>

<style lang="stylus" scoped></style>
