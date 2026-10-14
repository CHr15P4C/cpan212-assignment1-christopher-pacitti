# City Weather API

TODO (you): one or two sentences on what this service does.
So far, this app seems to get a lat long of a city using 1 api, then feed that into a second api that will get weather info.
## Run it

TODO (you): the commands to install and start it, including copying `.env.example` to `.env`.
git init
npm install
cp .env.example .env
npm run dev
## Environment variables

TODO (you): a table with every variable from `.env.example`, its default, and what it controls.

PORT=4000 
-variable for port that Express server listens on. (localhost:4000)
GEOCODING_URL=https://geocoding-api.open-meteo.com/v1
-url for geocoding function in open-meteo.js
FORECAST_URL=https://api.open-meteo.com/v1
-url for forcast funciton in open-meteo.s
UPSTREAM_TIMEOUT_MS=5000
-timeout limit setting to 5 seconds
CACHE_TTL_SECONDS=600
-"time to live" 600 seconds - 10 minutes, time app can reuse stored data before doing another fetch.

## Endpoints

TODO (you): each endpoint with an example request and a short description of the response.

## Testing

TODO (you): one `curl` command for each of the 10 requests on the assignment page, with the status
code it should get on a freshly started server. On Windows, run these in Git Bash. An example to copy:

```bash
# Weather for a city: 200
curl -i "http://localhost:4000/api/weather?city=Toronto"
```

## Data source

TODO (you): credit Open-Meteo with a link to https://open-meteo.com/.

## AI use

TODO (you): each AI tool you used and what for, or "No AI tools used."
