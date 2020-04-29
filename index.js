#!/usr/bin/env node
const Koa = require('koa')
const Router = require('koa-router')
const glob = require('glob')
const logger = require('koa-logger')
const { resolve } = require('path')
const fs = require('fs')
const Mock = require('mockjs')

const app = new Koa()
const router = new Router({ prefix: '/mymock' })
const routerMap = {} // 存放路由映射

app.use(logger())

// 注册路由
glob.sync(resolve('./mymock', '**/*.json')).forEach((item, i) => {
  let apiJsonPath = item && item.split('/mymock')[1]
  let apiPath = apiJsonPath.replace('.json', '')

  router.all(apiPath, async (ctx, next) => {
    try {
      await new Promise((resolve) => {
        setTimeout(resolve, 200)
      })
      let jsonStr = fs.readFileSync(item).toString()
      ctx.body = {
        data: Mock.mock(JSON.parse(jsonStr)),
        code: 0,
        msg: 'success', // 自定义响应体
      }
    } catch (err) {
      ctx.throw('服务器错误', 500)
    }
  })

  // 记录路由
  routerMap[apiJsonPath] = apiPath
})

fs.writeFile('./routerMap.json', JSON.stringify(routerMap, null, 4), (err) => {
  if (!err) {
    console.log('路由地图生成成功！')
  }
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000)
