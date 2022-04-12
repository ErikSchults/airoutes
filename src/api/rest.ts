import * as Koa from "koa"
import * as Router from "koa-router"
import { ApplicationAPI } from "./application"

export default function makeRestAPI(api: ApplicationAPI) {
  const server = new Koa()
  const router = new Router()

  router.get("/rest/v1/route/:sourceAirportCode/:destinationAirportCode", (ctx) => {
    const { sourceAirportCode, destinationAirportCode } = ctx.params

    if (typeof sourceAirportCode !== "string" || typeof destinationAirportCode !== "string") {
      ctx.body = `Source and destination airport codes must be strings`
      ctx.status = 400

      return
    }

    const result = api.controllers.findShortestRoute(api, sourceAirportCode, destinationAirportCode)

    ctx.status = result.code
    ctx.body = result.error ?? result.response
  })

  server.use((ctx, next) => {
    const start = performance.now()

    console.log("Handling", ctx.path)
    next()

    const end = performance.now()

    console.log(
      "Handling",
      ctx.path + "...",
      ctx.status === 200 ? "succeeded" : "failed",
      "in ",
      `${end - start}ms`
    )
  })

  server.use(router.routes())

  return server
}
