<template>
  <div>
    <button @click="onopen">开启Socket</button>
    <button @click="onclose">关闭Socket</button>
    <button @click="onsend">sendSocket</button>
  </div>
</template>

<script>
// main.js  Vue.prototype.$tools = Tools
export default {
  data () {
    return {
      websocketUrl: 'ws://localhost:9000/websocket',
      CreateWebSocket: null
    }
  },
  mounted () {
    this.CreateWebSocket = new this.$tools.WebSocketClass(this.websocketUrl)
  },
  methods: {
    onopen () {
      this.CreateWebSocket.open({ send: 'send' }).then(res => {
        console.log(res)
      })
    },
    onsend () {
      this.CreateWebSocket.send('ee').then(res => {
        console.log(res)
      })
    },
    onclose () {
      this.CreateWebSocket.close().then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang="stylus" scoped></style>
