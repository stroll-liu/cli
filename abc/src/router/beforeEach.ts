// import Store from './../store/index'
export default (to: any, from: any, next: any) => {
  if (to.meta && to.meta.title) {
    // document.title = to.meta.title || '数据概览'
  }
  next()
}
