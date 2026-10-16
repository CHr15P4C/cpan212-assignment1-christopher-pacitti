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

PORT
4000
The port the server listens on

GEOCODING_URL
https://geocoding-api.open-meteo.com/v1
Base URL of the geocoding API

FORECAST_URL
https://api.open-meteo.com/v1
Base URL of the forecast API

UPSTREAM_TIMEOUT_MS
5000
How long to wait for each Open-Meteo request

CACHE_TTL_SECONDS
600
How long a cached answer stays valid

## Endpoints

TODO (you): each endpoint with an example request and a short description of the response.
cacheRouter.get('/cache/stats'...
return the cahce statistics: entries, hits, misses, and ttlSeconds

weatherRouter.get('/weather'
Returns the output of get city weather from a single city input

weatherRouter.get('/compare'
Returms tje output of combined get city weather of all cities input
]
## Testing

TODO (you): one `curl` command for each of the 10 requests on the assignment page, with the status
code it should get on a freshly started server. On Windows, run these in Git Bash. An example to copy:

```bash
# Weather for a city: 200
curl -i "http://localhost:4000/api/weather?city=Toronto"
```

## Data source

TODO (you): credit Open-Meteo with a link to https://open-meteo.com/.
done in various places

## AI use

TODO (you): each AI tool you used and what for, or "No AI tools used."
I asked gemeni for help on several sections of this assignment.
I was especially stuck on the cache since WEEK 4 content was NOT AVAILABLE ON THE WEBSITE SO I HAD NO MATERIAL TO REFFERENCE. That being said, there was still documentation on expressjs.com