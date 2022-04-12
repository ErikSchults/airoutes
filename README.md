# Airoutes

## Dependencies

- node.js 16
- yarn

## Starting

```sh
nvm use
yarn install
yarn build
node build/index.js
```

## Endpoints

### `GET /rest/v1/route/:sourceAirportCode/:destinationAirportCode`

Example from Tallinn to Cape town with [httpie](https://httpie.io/docs/cli/usage)

```sh
$ http http://localhost:3000/rest/v1/route/EETN/CPT
HTTP/1.1 200 OK
{
    "distance": {
        "unit": "km",
        "value": 10815
    },
    "route": [
        {
            "destination": {
                "IATA": "ISL",
                "ICAO": "LTBA",
                "country": "Turkey",
                "lat": 40.976898,
                "lon": 28.8146,
                "name": "Atatürk International Airport"
            },
            "distance": {
                "unit": "km",
                "value": 2070
            },
            "source": {
                "IATA": "TLL",
                "ICAO": "EETN",
                "country": "Estonia",
                "lat": 59.41329956049999,
                "lon": 24.832799911499997,
                "name": "Lennart Meri Tallinn Airport"
            },
            "type": "AIR"
        },
        {
            "destination": {
                "IATA": "JNB",
                "ICAO": "FAOR",
                "country": "South Africa",
                "lat": -26.1392,
                "lon": 28.246,
                "name": "OR Tambo International Airport"
            },
            "distance": {
                "unit": "km",
                "value": 7471
            },
            "source": {
                "IATA": "ISL",
                "ICAO": "LTBA",
                "country": "Turkey",
                "lat": 40.976898,
                "lon": 28.8146,
                "name": "Atatürk International Airport"
            },
            "type": "AIR"
        },
        {
            "destination": {
                "IATA": "CPT",
                "ICAO": "FACT",
                "country": "South Africa",
                "lat": -33.9648017883,
                "lon": 18.6016998291,
                "name": "Cape Town International Airport"
            },
            "distance": {
                "unit": "km",
                "value": 1272
            },
            "source": {
                "IATA": "JNB",
                "ICAO": "FAOR",
                "country": "South Africa",
                "lat": -26.1392,
                "lon": 28.246,
                "name": "OR Tambo International Airport"
            },
            "type": "AIR"
        }
    ]
}
```

## Developing

```sh
yarn test
```

## Resources

- https://github.com/jpatokal/openflights
- https://www.programiz.com/dsa/dijkstra-algorithm
- Dijkstra by Computerphile(nice) - https://www.youtube.com/watch?v=GazC3A4OQTE
