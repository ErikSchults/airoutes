import { Models } from "../api/application"
import findShortestRoute from "./findShortestRoute"

declare module "../api/application" {
  interface Actions extends ReturnType<typeof makeActions> {}
}

export default function makeActions(api: { models: Models }) {
  return {
    findShortestRoute: (sourceId: number, destinationId: number) =>
      // sucks
      findShortestRoute(api, sourceId, destinationId),
  }
}
