export type Airport = {
  airportId: number
  name: string
  country: string
  IATA?: string
  ICAO?: string
  lat: number
  lon: number
}

export default function airports(list: Airport[]) {
  const byId = new Map(list.map((a) => [a.airportId, a]))
  const byIATA = new Map(list.filter((a) => a.IATA).map((a) => [a.IATA, a]))
  const byICAO = new Map(list.filter((a) => a.ICAO).map((a) => [a.ICAO, a]))

  return {
    getById(id: number): Airport | undefined {
      return byId.get(id)
    },
    getByCode(code: string): Airport | undefined {
      if (code.length === 3) {
        return byIATA.get(code)
      }
      if (code.length === 4) {
        return byICAO.get(code)
      }

      throw new Error(`Code ${code} must of type IATA or ICAO`)
    },
  }
}
