import makeRestAPI from "./api/rest"
import makeApplicationAPI from "./api/application"

async function start() {
  const api = makeApplicationAPI()
  const server = makeRestAPI(api)

  server.listen(3000, () => {
    console.log("Listening on port 3000")
  })
}

start()
