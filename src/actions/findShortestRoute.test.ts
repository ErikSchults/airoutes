import { ApplicationAPI } from "../api/application"
import routes, { Route } from "../models/routes"
import findShortestRoute from "./findShortestRoute"

function makeApi(r: Route[]) {
  return {
    models: {
      routes: routes(r),
    },
  } as ApplicationAPI
}

function makeRoute(A: number, B: number, distance: number, type: Route["type"] = "AIR"): Route {
  return {
    sourceId: A,
    destinationId: B,
    distance,
    type,
  }
}

const airportAlpha = 1
const airportBeta = 2
const airportGamma = 3
const airportDelta = 4
const airportOmega = 24

it("Finds direct flights", () => {
  const expected = [makeRoute(airportAlpha, airportOmega, 5)]
  const api = makeApi(expected)

  expect(findShortestRoute(api, airportAlpha, airportOmega)).toEqual(expected)
})

it("Finds one stop flights", () => {
  const expected = [
    makeRoute(airportAlpha, airportGamma, 2),
    makeRoute(airportGamma, airportOmega, 5),
  ]
  const api = makeApi([
    makeRoute(airportAlpha, airportBeta, 3),
    makeRoute(airportBeta, airportOmega, 5),

    ...expected,
  ])
  expect(findShortestRoute(api, airportAlpha, airportOmega)).toEqual(expected)
})

it("Finds two stop flights", () => {
  const expected = [
    makeRoute(airportAlpha, airportBeta, 2),
    makeRoute(airportBeta, airportDelta, 1),
    makeRoute(airportDelta, airportOmega, 5),
  ]
  const api = makeApi([
    ...expected,

    makeRoute(airportAlpha, airportGamma, 2),
    makeRoute(airportGamma, airportDelta, 2),
    makeRoute(airportDelta, airportOmega, 5),
  ])
  expect(findShortestRoute(api, airportAlpha, airportOmega)).toEqual(expected)
})

it("Finds three stop flights even if less stops available", () => {
  const expected = [
    makeRoute(airportAlpha, airportBeta, 1),
    makeRoute(airportBeta, airportGamma, 2),
    makeRoute(airportGamma, airportDelta, 3),
    makeRoute(airportDelta, airportOmega, 4),
  ]
  const api = makeApi([...expected, makeRoute(airportAlpha, 7, 7), makeRoute(7, airportOmega, 7)])

  expect(findShortestRoute(api, airportAlpha, airportOmega)).toEqual(expected)
})

it("Finds (3 airport + 2 land) stop flight", () => {
  const expected = [
    makeRoute(1, 20, 1, "LAND"),
    makeRoute(20, 21, 10, "AIR"),
    makeRoute(21, 22, 1, "LAND"),
    makeRoute(22, 23, 10, "AIR"),
    makeRoute(23, 24, 10, "AIR"),
    makeRoute(24, 5, 7, "AIR"),
  ]
  const api = makeApi([
    makeRoute(1, 2, 20, "AIR"),
    makeRoute(2, 3, 10, "AIR"),
    makeRoute(3, 4, 10, "AIR"),
    makeRoute(4, 5, 10, "AIR"),

    ...expected,
  ])
  expect(findShortestRoute(api, 1, 5)).toEqual(expected)
})

it("Returns null if route too deep", () => {
  const r = [
    makeRoute(1, 20, 1, "LAND"),
    makeRoute(20, 21, 10, "AIR"),
    makeRoute(21, 22, 1, "LAND"),
    makeRoute(22, 23, 10, "AIR"),
    makeRoute(23, 24, 10, "AIR"),
    makeRoute(24, 25, 10, "AIR"),
    makeRoute(25, 5, 7, "AIR"),
  ]
  const api = makeApi(r)
  const getDestinations = jest.spyOn(api.models.routes, "getDestinations")

  expect(findShortestRoute(api, 1, 5)).toEqual(null)
  // Stops processing too long route
  expect(getDestinations).not.toHaveBeenCalledWith(25)
})

it("Returns null if no route", () => {
  const api = makeApi([makeRoute(1, 20, 1, "LAND"), makeRoute(20, 21, 10, "AIR")])
  expect(findShortestRoute(api, 1, 5)).toEqual(null)
})
