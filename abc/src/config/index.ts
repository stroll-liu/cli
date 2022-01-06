import theme from './themeOverrides'
export default {
  ...theme,
  //操作正常code，支持String、Array、int多种类型
  successCode: [200, 0],
  //是否显示顶部进度条
  progressBar: true,
  // 路由模式，可选值为 history 或 hash
  routerMode: 'hash',
  //不经过token校验的路由
  routesWhiteList: ['/login', '/404', '/401'],
  //加载时显示文字
  loadingText: '正在加载中...',
  //token失效回退到登录页时是否记录本次的路由
  recordRoute: true
}
