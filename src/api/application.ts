import makeActions from "../actions"
import makeControllers from "../controllers"
import makeModels from "../models"

export interface Models {}
export interface Actions {}
export interface Controllers {}
export interface ApplicationAPI {
  models: Models
  actions: Actions
  controllers: Controllers
}

export default function makeApplicationApi(): ApplicationAPI {
  const models = makeModels()
  const actions = makeActions({ models })
  const controllers = makeControllers()

  return {
    models,
    actions,
    controllers,
  }
}
