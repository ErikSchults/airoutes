import makeAirports, { Airport } from "./airports"
import makeRoutes, { Route } from "./routes"
import * as calculateDistanceMeters from "haversine-distance"

declare module "../api/application" {
  interface Models extends ReturnType<typeof makeModels> {}
}

const airportData: Airport[] = require("../../data/airports_openflights.json")
const routeData: Omit<Route, "distance" | "type">[] = require("../../data/routes_openflights.json")

export default function makeModels() {
  const airports = makeAirports(airportData)

  function prepareRoutes(): Omit<Route, "distance">[] {
    return routeData
      .filter((r) => r.destinationId !== r.sourceId)
      .map((r) => ({
        ...r,
        type: "AIR",
      }))
  }

  function enchanceRoutesWithDistances(routes: Omit<Route, "distance">[]) {
    return routes.map((route) => {
      const A = airports.getById(route.sourceId)
      const B = airports.getById(route.destinationId)
      const distance = A && B ? calculateDistanceMeters(A, B) : Infinity

      return {
        ...route,
        distance: distance,
      }
    })
  }

  function findNearbyAirportLandRoutes() {
    const routes: Route[] = []

    for (const A of airportData) {
      for (const B of airportData) {
        if (A === B) continue

        const distance = calculateDistanceMeters(A, B)

        if (distance <= 1e5) {
          routes.push({
            sourceId: A.airportId,
            destinationId: B.airportId,
            distance,
            type: "LAND",
          })
        }
      }
    }

    return routes
  }

  return {
    routes: makeRoutes([
      ...enchanceRoutesWithDistances(prepareRoutes()),
      ...findNearbyAirportLandRoutes(),
    ]),
    airports,
  }
}
