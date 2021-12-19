// 字段排查
export async function ask (obj, replaceVal = '', exec = '_') {
  return new Proxy({}, {
    get: (target, key) => {
      if (key === exec) {
        return obj || replaceVal
      } else {
        return ask(!!obj && obj[key], replaceVal, exec)
      }
    }
  })
}

// 数字转汉字
export async function DTC (num) {
  let chnNumChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  let chnUnitSection = ['', '万', '亿', '万亿', '亿亿']
  let chnUnitChar = ['', '十', '百', '千']

  function SectionToChinese (section) {
    let strIns = ''
    let chnStr = ''
    let unitPos = 0
    let zero = true
    while (section > 0) {
      let v = section % 10
      if (v === 0) {
        if (!zero) {
          zero = true
          chnStr = chnNumChar[v] + chnStr
        }
      } else {
        zero = false
        strIns = chnNumChar[v]
        strIns += chnUnitChar[unitPos]
        chnStr = strIns + chnStr
      }
      unitPos++
      section = Math.floor(section / 10)
    }
    return chnStr
  }

  let unitPos = 0
  let strIns = ''
  let chnStr = ''
  let needZero = false

  if (num === 0) {
    return chnNumChar[0]
  }

  while (num > 0) {
    let section = num % 10000
    if (needZero) {
      chnStr = chnNumChar[0] + chnStr
    }
    strIns = SectionToChinese(section)
    strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0]
    chnStr = strIns + chnStr
    needZero = (section < 1000) && (section > 0)
    num = Math.floor(num / 10000)
    unitPos++
  }
  return chnStr
}

// 去重
export async function dedupe (arr) {
  return [...new Set(arr)]
}

// 简易提示
let textTipShow = false
export async function textTip ({ str = '未知错误', t = 2000, tipStyle, fn }) {
  if (textTipShow) return
  tipStyle = tipStyle || `
      background:rgba(0,0,0,.3); color: #fff; border-radius: 3px; padding: 20px 10px;
      line-height: 40px; text-align: center; font-size: 30px;
      position: fixed; left: 50%; top: 20%; z-index: 9999;
      -webkit-transform: translate(-50%); transform: translate(-50%);`
  textTipShow = true
  var dom = document.createElement('div')
  dom.setAttribute('style', tipStyle)
  dom.innerHTML = str

  document.body.appendChild(dom)

  if ((dom.offsetHeight - 20) / 18 > 1) {
    dom.style.width = '55%'
  }

  setTimeout(function () {
    dom.parentNode.removeChild(dom)
    textTipShow = false
    if (fn) { fn() }
  }, t)
}

// 获取操作系统
export async function detectOS () {
  const sUserAgent = navigator.userAgent
  if (['Win32', 'Windows'].includes(navigator.platform)) {
    if (sUserAgent.includes('Windows NT 5.0') || sUserAgent.includes('Windows 2000')) {
      return 'Windows2000'
    } else if (sUserAgent.includes('Windows NT 5.1') || sUserAgent.includes('Windows XP')) {
      return 'WindowsXP'
    } else if (sUserAgent.includes('Windows NT 5.2') || sUserAgent.includes('Windows 2003')) {
      return 'Windows2003'
    } else if (sUserAgent.includes('Windows NT 6.0') || sUserAgent.includes('Windows Vista')) {
      return 'Windows Vista'
    } else if (sUserAgent.includes('Windows NT 6.1') || sUserAgent.includes('Windows 7')) {
      return 'Windows7'
    } else if (sUserAgent.includes('Windows NT 10.0') || sUserAgent.includes('Windows 10')) {
      return 'Windows10'
    } else {
      return 'Windows other'
    }
  } else if (['Mac68K', 'MacPPC', 'Macintosh', 'MacIntel'].includes(navigator.platform)) {
    return 'MacOS'
  } else if (navigator.platform === 'X11') {
    return 'Unix'
  } else if (String(navigator.platform).includes('Linux')) {
    return 'Linux'
  } else {
    return 'other'
  }
}

// 参数过滤
export async function jsonTreat (a, b, arr) {
  const keyArr = []
  if (b) {
    Object.keys(b).forEach(key => {
      if (arr) {
        if (!arr.includes(key)) {
          a[key] = b[key]
        }
      } else {
        a[key] = b[key]
      }
    })
  } else if (a) {
    Object.keys(a).forEach(key => {
      if (a[key]) {
        keyArr.push(key)
      }
    })
  }
  return keyArr
}

// 指定长度随即字符串
function randomString(len){
  len = len || 30
  let str = ''
  while (str.length < len) {
    str += Math.random().toString(36).substring(2)
  }
  return str.substring(0,len);
}

// 设置 session
export async function setSession ({ name }, obj) {
  return new Promise((res, rej) => {
    try {
      const data = sessionStorage.setItem(name, JSON.stringify(obj))
      res(data)
    } catch (error) {
      console.log(error)
      rej(error)
    }
  })
}

// 获取 session
export function getSession ({ name }) {
  return JSON.parse(sessionStorage.getItem(name))
}

// 更新 session
export async function pushSession ({ name, arr }, obj = {}) {
  const msg = getSession({ name: name })
  let msgKey = null
  let index = 0
  if (arr && typeof arr === 'string') {
    arr = arr.split('.')
  }
  async function getMsgKey (item) {
    if (arr.length > index) {
      if (item[arr[index]]) {
        msgKey = item[arr[index]]
      } else {
        console.log(`没有 ${arr[index]} 集合`)
        return
      }
      index++
      await getMsgKey(msgKey)
    }
  }
  if (arr && arr.length) {
    await getMsgKey(msg)
    for (let key in obj) {
      msgKey[key] = obj[key]
    }
  } else {
    for (let key in obj) {
      msg[key] = obj[key]
    }
  }

  return await setSession({ name: name }, msg)
}

// Promise WebSocket
export class WebSocketClass {
  constructor (websocketUrl, open) {
    this.websocketUrl = websocketUrl
    open && this.open()
  }
  static getInfo () {
    if (!this.ws) {
      this.ws = new WebSocket(this.websocketUrl)
    }
    return this.ws
  }

  open (start) {
    return new Promise((resolve, reject) => {
      const { send = 'open' } = start || {}
      this.ws = new WebSocket(this.websocketUrl)
      if ([0, 1].includes(this.ws.readyState)) {
        this.ws.onopen = e => {
          this.send(send).then(res => {
            resolve({...e, ...res})
          })
        }
      } else {
        reject({ code: 1, mge: 'WebSocket创建失败', data: this.ws })
      }
    })
  }

  send (ping) {
    return new Promise((resolve, reject) => {
      if (this.ws && this.ws.readyState === 1) {
        this.ws.send(ping)
        this.getMessage().then(res => {
          resolve({ code: 0, ...res })
        })
      } else {
        reject({ code: 1, mge: '是否开启链接', data: this.ws })
      }
    })
  }

  getMessage () {
    return new Promise((resolve, reject) => {
      if (this.ws && this.ws.readyState === 3) {
        reject({ code: 1, mge: '是否开启链接', data: this.ws })
      } else {
        this.ws.onmessage = e => {
          resolve({ code: 0, e })
        }
      }
    })
  }

  close (close) {
    return new Promise((resolve, reject) => {
      try {
        if (this.ws && this.ws.readyState < 2) {
          this.ws.send(close || 'close')
          this.ws.close()
        }
        resolve({ code: 0, mge: '连接已经关闭' })
      } catch (error) {
        reject({ code: 1, error })
      }
    })
  }

  // readyState 状态
  // 0：表示正在连接；
  // 1：表示连接成功，可以通信了。
  // 2：表示连接正在关闭。
  // 3：表示连接已经关闭，或者打开连接失败。
}

export class WebWorkerClass {
  constructor (fn) {
    if (!window.Worker) throw new Error('Worker 不兼容')
    if (typeof fn == 'function') {
      this.worker = new Worker (
        URL.createObjectURL (new Blob ([`(${fn.toString()})()`]))
      )
    } else {
      throw new Error('new WebWorker 传入参数必须为函数')
    }
  }

  send (data) {
    return new Promise((resolve, reject) => {
      try {
        this.worker.postMessage(data)
        resolve({ code: 0, message: '发送成功' })
      } catch (error) {
        reject(error)
      }
    })
  }

  message () {
    return new Promise((resolve, reject) => {
      try {
        this.worker.onmessage = function(e) {
          resolve(e)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  close () {
    return new Promise((resolve, reject) => {
      try {
        this.worker.terminate()
        this.worker = null
        resolve({ code: 0, message: '关闭成功' })
      } catch (error) {
        reject(error)
      }
    })
  }

  errer () {
    return new Promise((resolve) => {
      this.worker.onerror = function (err) {
        resolve(err)
      }
    })
  }

}

export default {
  ask,
  DTC,
  dedupe,
  textTip,
  detectOS,
  jsonTreat,
  randomString,
  setSession,
  getSession,
  pushSession,
  WebWorkerClass,
  WebSocketClass
}
