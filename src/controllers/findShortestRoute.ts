import { Airport } from "models/airports"
import { RawApi } from "./types"

const formatDistance = (distance) => ({
  value: Math.floor(distance / 1000),
  unit: "km",
})

const formatAirport = ({ IATA, ICAO, name, lat, lon, country }: Airport) => {
  return { IATA, ICAO, name, lat, lon, country }
}

const findShortestRoute = (api: RawApi, sourceCode: string, destinationCode: string) => {
  const sourceAirport = api.models.airports.getByCode(sourceCode)
  const destinationAirport = api.models.airports.getByCode(destinationCode)

  if (!sourceAirport) {
    return {
      error: `Airport "${sourceCode}" not found`,
      code: 404,
    }
  }

  if (!destinationAirport) {
    return {
      error: `Airport "${destinationAirport}" not found`,
      code: 404,
    }
  }

  const route = api.actions.findShortestRoute(sourceAirport.airportId, destinationAirport.airportId)

  if (!route) {
    return {
      error: "Route not found",
      code: 404,
    }
  }

  const distance = route.reduce((sum, route) => route.distance + sum, 0)
  const formattedRoute = route.map((r) => ({
    source: formatAirport(api.models.airports.getById(r.sourceId)),
    destination: formatAirport(api.models.airports.getById(r.destinationId)),
    type: r.type,
    distanceMeters: formatDistance(r.distance),
  }))

  return {
    response: {
      route: formattedRoute,
      distance: formatDistance(distance),
    },
    code: 200,
  }
}

export default findShortestRoute
