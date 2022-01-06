
const serveFiles: any = import.meta.globEager('./theme/**/*.theme.ts')
const Interface: any = {}
Object.keys(serveFiles).forEach((key) => {
  const urlArr = key.split('/')
  const apiKey= `${urlArr[urlArr.length-1].split('.')[0]}Theme`
  Interface[apiKey] = serveFiles[key].default
})

export default Interface
