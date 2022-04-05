import { ApplicationAPI } from "../api/application"

export type Controller = (...args: any[]) =>
  | {
      error: string
      code: 404 | 500
    }
  | {
      response: any
      code: 200
    }

export type RawApi = Omit<ApplicationAPI, "controllers">
