const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body');
const websockify = require('koa-websocket')
const app = websockify(new Koa())

const router = new Router()
app.use(koaBody())

app.ws.use((ctx, next) => {
  return next(ctx)
})

router.all('/websocket', async (ctx, next) => {
  ctx.websocket.on('message', msg => {
    ctx.websocket.send(`前端发过来的数据: ${msg}`)
  })
  ctx.websocket.on('close', () => {
    console.log('前端关闭了websocket')
  })
})

app.ws.use(router.routes())
app.use(router.allowedMethods())
app.listen(9000, () => {
  console.log('服务9000端口已经启动了')
})
