import { LatLng } from "react-native-maps";
import { TRIP_ENDPOINT } from "../constants/endpoints";

export function createSocket() : WebSocket{
    const socket = new WebSocket(TRIP_ENDPOINT)
    if(socket) return socket
    else throw Error("The sebwocket was a lie.")
}
export function startTrip(userToken: string, routeToken: string, companionNumbers: string[], socket: WebSocket){
    if(!socket) throw new Error ("No websocket available."); 
    socket.send(JSON.stringify({
        userToken,
        routeToken,
        companionNumbers,
        type: "START_TRIP"
    }))
} 
export function locationUpdate(userToken: string, location: LatLng, socket: WebSocket){
    if(!socket) throw new Error ("No websocket available."); 
    socket.send(JSON.stringify({
        userToken,
        location,
        type: "LOCATION_UPDATE"
    }))
}
export function endTrip(userToken: string, routeToken: string, socket: WebSocket){
    if(!socket) throw new Error ("No websocket available."); 
    //Proper termination should includ a validation message (I think), if you want it to just accept a close as a catch-all to end trip you can remove the message
    //If this is proper termination the server should terminate the connection not the client (probably)
    socket.send(JSON.stringify({
        userToken,
        routeToken,
        timestamp: Date().toLocaleString()
    }))
}