
const serveFiles: any = import.meta.globEager('./modules/**/*.api.ts')
const Interface: any = {}
Object.keys(serveFiles).forEach((key) => {
  console.log('serveFiles[key]', serveFiles[key])
  const urlArr = key.split('/')
  const apiKey=urlArr[urlArr.length-1].split('.')[0]
  Interface[apiKey] = serveFiles[key].default()
})

export {Interface}

export default {
  install: (Vue: any) => {
    Vue.config.globalProperties.$api = Interface
  }
}
