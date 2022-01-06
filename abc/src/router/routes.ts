const routerFiles: any = import.meta.globEager('./../modules/**/*.router.ts')
let routes: any = []
Object.keys(routerFiles).forEach((key) => {
  const routerArr = routerFiles[key].default
  routes = routes.concat(routerArr)
})

export default routes
