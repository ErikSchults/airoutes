export type Route = {
  sourceId: number
  destinationId: number
  distance: number
  type: "LAND" | "AIR"
}

export default function routes(list: Route[]) {
  const routes: Map<number, Route[]> = new Map()

  for (const route of list) {
    if (!routes.has(route.sourceId)) routes.set(route.sourceId, [])
    routes.get(route.sourceId).push(route)
  }

  return {
    getDestinations(sourceId: number) {
      return routes.get(sourceId) ?? []
    },
  }
}
