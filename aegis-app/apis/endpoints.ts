const TEMP_AUTH_ENDPOINT = "https://stanton-swampless-diana.ngrok-free.dev" 
export const AUTH_ENDPOINT=TEMP_AUTH_ENDPOINT
export const POI_ENDPOINT = "https://map.burntheatlantic.com/rpc/nearby_pois"
export const ROUTE_ENDPOINT = ""
export const TRIP_ENDPOINT= ""
export const TILE_URL = "https://map.burntheatlantic.com/styles/basic-preview/512/{z}/{x}/{y}.png";
//This shouldn't be done like this either. These should be subservices under on subdomain. I'll figure it out when we run into the brick wall that is software design.