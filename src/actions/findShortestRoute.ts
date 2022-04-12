import { Models } from "../api/application"
import { Route } from "models/routes"

interface Node {
  distance: number
  depth: number
  route: Route
  parent: Node
}
type Constraints = {
  depth: number
}

function findRoute(destination: Node) {
  const queue = [destination]
  const result: Node[] = []

  while (queue.length > 0) {
    const node = queue.pop()

    if (node.route.sourceId !== null) {
      result.push(node)
      queue.push(node.parent)
    }
  }

  return result.reverse().map((r) => r.route)
}

function makeWeights(sourceNode: Node) {
  const weights = new Map([[`${sourceNode.route.destinationId}-${sourceNode.depth}`, sourceNode]])

  return {
    add(parent: Node, route: Route): Node {
      const distance = parent.distance + route.distance
      const depth = parent.depth + (route.type === "LAND" ? 0 : 1)

      let child = weights.get(`${route.destinationId}-${depth}`)

      if (!child || child.distance > distance) {
        child = {
          distance: distance,
          depth,
          route,
          parent,
        }

        weights.set(`${route.destinationId}-${depth}`, child)
      }

      return child
    },
  }
}

function makeSourceNode(sourceId: number): Node {
  return {
    distance: 0,
    depth: 0,
    route: {
      destinationId: sourceId,
      sourceId: null,
      distance: 0,
      type: "LAND",
    },
    parent: null,
  }
}

function makeQueue(source: Node) {
  const queue: Node[] = [source]
  const byDistance = (a: Node, b: Node) => b.distance - a.distance

  return {
    add: (node: Node) => queue.push(node),
    next: () => queue.pop(),
    sort: () => queue.sort(byDistance),
    get notEmpty() {
      return queue.length > 0
    },
  }
}

export default function findShortestRoute(
  api: { models: Models },
  sourceId: number,
  destinationId: number,
  constraints: Constraints = { depth: 3 }
): Route[] {
  const visited: WeakSet<Node> = new WeakSet()
  const sourceNode = makeSourceNode(sourceId)
  const weights = makeWeights(sourceNode)
  const queue = makeQueue(sourceNode)

  while (queue.notEmpty) {
    const node = queue.next()

    if (node.route.destinationId === destinationId) {
      visited.add(node)

      return findRoute(node)
    }
    if (visited.has(node) || node.depth > constraints.depth) continue

    for (const route of api.models.routes.getDestinations(node.route.destinationId)) {
      queue.add(weights.add(node, route))
    }

    queue.sort()
    visited.add(node)
  }

  return null
}
