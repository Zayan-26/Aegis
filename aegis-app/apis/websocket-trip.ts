import { LatLng } from "react-native-maps";
import { TRIP_ENDPOINT } from "./endpoints";

export function createSocket() : WebSocket{
    return new WebSocket(TRIP_ENDPOINT)
}
export function startTrip(userToken: string, routeToken: string, socket: WebSocket){
    socket.send(JSON.stringify({
        userToken,
        routeToken,
        type: "START_TRIP"
    }))
    //TODO: Start polling loop
} 
export function locationUpdate(userToken: string, location: LatLng, socket: WebSocket){
    socket.send(JSON.stringify({
        userToken,
        location,
        type: "LOCATION_UPDATE"
    }))
}
export function endTrip(userToken: string, routeToken: string, socket: WebSocket){
    //Proper termination should includ a validation message (I think), if you want it to just accept a close as a catch-all to end trip you can remove the message
    //If this is proper termination the server should terminate the connection not the client (probably)
    socket.send(JSON.stringify({
        userToken,
        routeToken,
        timestamp: Date().toLocaleString()
    }))
}