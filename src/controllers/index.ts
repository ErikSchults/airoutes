import findShortestRoute from "./findShortestRoute"
import { Controller } from "./types"

declare module "../api/application" {
  interface Controllers extends ReturnType<typeof makeControllers> {}
}

function makeHttpController(fn: Controller): Controller {
  return (...args) => {
    try {
      return fn(...args)
    } catch (err) {
      console.log(err)

      return {
        error: "Internal server error",
        code: 500,
      }
    }
  }
}

function wrapControllers<T>(controllers: T): T {
  for (const [k, v] of Object.entries(controllers)) {
    controllers[k] = makeHttpController(v)
  }

  return controllers
}

export default function makeControllers() {
  // ...fun indeed, how to wrap functions with API while preserving other function parameters, fastify plugin?
  const controllers = wrapControllers({
    findShortestRoute: findShortestRoute,
  })

  return controllers
}
