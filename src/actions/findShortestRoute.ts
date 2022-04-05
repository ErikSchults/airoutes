import { Models } from "../api/application"
import { Route } from "models/routes"

interface Node {
  distance: number
  depth: number
  route: Route
}
type Weights = Map<number, Node>
type Visited = Set<number>

function findRouteFromWeights(visited: Visited, weights: Weights, destinationId: number) {
  const visitedWeights = Array.from(visited).map((airportId) => weights.get(airportId))
  const queue = [destinationId]
  const result: Node[] = []

  while (queue.length > 0) {
    const airportId = queue.pop()
    const path = visitedWeights.find((node) => node.route.destinationId === airportId)

    if (!path) {
      return null
    }

    if (path.route.sourceId !== null) {
      result.push(path)
      queue.push(path.route.sourceId)
    }
  }

  return result.reverse().map((r) => r.route)
}

function addWeights(weights: Weights, route: Route) {
  const parent = weights.get(route.sourceId)
  const child = weights.get(route.destinationId)
  const newDistance = parent.distance + route.distance

  if (!child || newDistance < child.distance) {
    weights.set(route.destinationId, {
      distance: newDistance,
      depth: parent.depth + (route.type === "LAND" ? 0 : 1),
      route,
    })
  }
}
function makeSortQueue(weights: Weights) {
  return (a: number, b: number) => weights.get(b).distance - weights.get(a).distance
}

export default function findShortestRoute(
  api: { models: Models },
  sourceId: number,
  destinationId: number,
  maxDepth = 3
): Route[] {
  const sourceNode: Node = {
    distance: 0,
    depth: 0,
    route: {
      destinationId: sourceId,
      sourceId: null,
      distance: 0,
      type: "LAND",
    },
  }
  const visited: Visited = new Set()
  const weights: Weights = new Map([[sourceId, sourceNode]])
  const queue = [sourceId]
  const sortQueue = makeSortQueue(weights)

  while (queue.length > 0) {
    const airportId = queue.pop()

    if (visited.has(airportId)) continue
    if (airportId === destinationId) {
      visited.add(airportId)
      break
    }

    // process whole queue, maybe destination at max depth
    if (weights.get(airportId).depth > maxDepth) continue

    for (const route of api.models.routes.getDestinations(airportId)) {
      addWeights(weights, route)
      queue.push(route.destinationId)
    }

    queue.sort(sortQueue)
    visited.add(airportId)
  }

  return findRouteFromWeights(visited, weights, destinationId)
}
