# tools
工具类

## 安装

```js
npm i @stroll/tools

```
## 引入
```js
import Vue from 'vue'
import Tools from '@stroll/tools'

Vue.prototype.$tools = Tools

```
## 调用
```js
// 字段排查，如果有就返回，没有返回自定义值 或 默认值（''）
// obj 排查的json
// replaceVal 可选参数，自定义值（默认 ''）
// exec 可选参数，截至符（默认 _）
ask(obj, replaceVal, exec).a.b.c._

// 数字转汉字
// num 比传参数,需要转换的数字
DTC(num)

// 数组去重
dedupe(arr)

// 简易提示
// str 提示文案，默认 '未知错误',
// t显示时间，单位毫秒，默认 2000,
// tipStyle 提示框样式,
// fn 提示框消失后的回调
textTip({ str, t, tipStyle, fn })

// 获取操作系统
detectOS()

// 参数过滤
// 只传第一个参，返回参数的所有key
// 传两个参数，把第二个参数合并到第一个里
// 第三个参数，第二个参数需要过滤调的key
// 前两个参数为json对象，第三个为数组
jsonTreat(jsonObjA, jsonObjB, arr)

// 指定长度随即字符串
// len 数字，要生成的长度，默认 30
randomString(len)

// 设置session
// name 参数 session 的 key
// obj 参数 session 的 value
setSession({ name }, obj)

// 获取session
// name 参数 session 的 key
getSession({ name })

// 更新session
// name 参数 session 的 key
// arr 参数 需要更新的 key
// obj 参数 需要更新的
pushSession({ name, arr }, obj = {})

// Promise WebSocket
// 示例地址： 
//  vue: ./Examples/webSocket/vue-webSocket
//  koa: ./Examples/webSocket/koa-webSocket
// class WebSocketClass {
//   // 。。。
// }
data () {
  return {
    websocketUrl: 'ws://localhost:9000/websocket', // WebSocket 接口地址
    CreateWebSocket: null
  }
},
mounted () {
  // new 一个 WebSocket
  // websocketUrl 发送的地址
  this.CreateWebSocket = new WebSocketClass(this.websocketUrl)
},
methods: {
  onopen () { // 连接后端并发送数据
    // send 发送给后端的数据
    // res 接受后端返回的数据
    this.CreateWebSocket.open({ send: 'send' }).then(res => {
      console.log(res)
    })
  },
  onsend () { // 向后端发送数据
    // ee 发送给后端的数据
    // res 接受后端返回的数据
    this.CreateWebSocket.send('ee').then(res => {
      console.log(res)
    })
  },
  onclose () { // 关闭 WebSocket
    // res 成功与失败 信息
    this.CreateWebSocket.close().then(res => {
      console.log(res)
    })
  }
}

// Promise webWorker
// 示例地址： ./Examples/webSocket/webWorker
// class WebWorkerClass {
//   // 。。。
// }
data () {
  return {
    webWorker: null
  }
},
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

```
