/* eslint-disable prettier/prettier */
export const LAT = -33.88407117097632
export const LON = -56.394190075925366
export const OPEN_WEATHER_API_KEY = '4af80eb5231f63b96e642933915c14d8'
export const OPEN_WEATHER_API = 'https://api.openweathermap.org/data/2.5/forecast?lat='+LAT+'&lon='+LON+'&appid='+OPEN_WEATHER_API_KEY+'&units=metric'
export const STORMGLASS_API_KEY = '59f054e0-ee44-11ec-bea1-0242ac130002-59f0554e-ee44-11ec-bea1-0242ac130002'
// export const STORMGLASS_API = 'https://api.stormglass.io/v2/weather/point?lat='+LAT+'&lng='+LON+'&params=windSpeed100m,windDirection100m&start=@START@&end=@END@&source=noaa,sg'
export const STORMGLASS_API = 'https://api.stormglass.io/v2/weather/point?lat='+LAT+'&lng='+LON+'&params=windSpeed100m,windDirection100m&start=@START@&source=sg'