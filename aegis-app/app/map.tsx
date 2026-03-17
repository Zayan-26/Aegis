import { useCallback, useRef, useState } from 'react';
import { Platform } from 'react-native';
import MapView, { LatLng, LongPressEvent, Marker, Region, UrlTile } from 'react-native-maps';

/*
Current maptile server hosted on https://map.burntheatlantic.com/ using https://github.com/Overv/openstreetmap-tile-server/
Using osm.pbf originally downloaded from https://download.geofabrik.de/europe/united-kingdom.html and extracted using https://github.com/openmaptiles/openmaptiles-tools/
Bounding Box for generated map created using https://boundingbox.klokantech.com/
Bounds(CSV): -1.928328,52.460439,-1.871856,52.49536
Taken and modified off https://github.com/react-native-maps/react-native-maps/discussions/4865
*/
// const EMPTY_MAP_STYLE = [
//   { elementType: 'geometry', stylers: [{ color: '#000000' }, { visibility: 'off' }] },
//   { elementType: 'labels', stylers: [{ visibility: 'off' }] },
//   { featureType: 'administrative', stylers: [{ visibility: 'off' }] },
//   { featureType: 'poi', stylers: [{ visibility: 'off' }] },
//   { featureType: 'road', stylers: [{ visibility: 'off' }] },
//   { featureType: 'transit', stylers: [{ visibility: 'off' }] },
//   { featureType: 'water', stylers: [{ visibility: 'off' }] },
// ];
type DestinationMarker = {
    id: number,
    latlng: LatLng,
    title: string
}
const BrumMap = () => {
    const [uniqueMarker, setUniqueMarker] = useState<DestinationMarker | null>(null)
    const setMarker = (e: LongPressEvent) => {
        const latlng = e.nativeEvent.coordinate;
        setUniqueMarker({
            id: 0,
            latlng: latlng,
            title: "Destination"
        })
    }


    const mapRef = useRef<MapView | null>(null);
    const BoundsCenter = [52.4778995, -1.900092]
    const BoundsDelta = [0.0174605, 0.028236]
    const BoundsRatio = 0.95
    const BrumBounds = {
        sw: { latitude: BoundsCenter[0] - BoundsDelta[0] * BoundsRatio, longitude: BoundsCenter[1] - BoundsDelta[1] * BoundsRatio },
        ne: { latitude: BoundsCenter[0] + BoundsDelta[0] * BoundsRatio, longitude: BoundsCenter[1] + BoundsDelta[1] * BoundsRatio }
    }
    // const BrumBounds = {
    //     sw: { latitude: 52.460439, longitude: -1.928328 },
    //     ne: { latitude: 52.49536, longitude: -1.871856 }
    // };
    // useEffect(() => {
    //     if(mapRef.current){
    //         mapRef.current.setMapBoundaries(
    //             BrumBounds.ne,
    //             BrumBounds.sw
    //         );
    //     }
    // }, []);
    const androidClamp = useCallback(async () => {
        const map = mapRef.current;
        if (!map) return;
        if (Platform.OS == "android")
            map.setMapBoundaries(BrumBounds.ne, BrumBounds.sw);
    }, [])
    const iosClamp = useCallback((region: Region) => {
        const map = mapRef.current;
        if (Platform.OS !== 'ios' || !map) return;

        const {
            sw: { latitude: minLat, longitude: minLng },
            ne: { latitude: maxLat, longitude: maxLng },
        } = BrumBounds;

        const halfLat = region.latitudeDelta / 2;
        const halfLng = region.longitudeDelta / 2;

        const clampedLat = Math.min(maxLat - halfLat, Math.max(minLat + halfLat, region.latitude));
        const clampedLng = Math.min(maxLng - halfLng, Math.max(minLng + halfLng, region.longitude));

        const boundsCenterLat = (minLat + maxLat) / 2;
        const boundsCenterLng = (minLng + maxLng) / 2;

        const safeLat = maxLat - halfLat < minLat + halfLat ? boundsCenterLat : clampedLat;
        const safeLng = maxLng - halfLng < minLng + halfLng ? boundsCenterLng : clampedLng;

        if (safeLat !== region.latitude || safeLng !== region.longitude) {
            map.animateToRegion({ ...region, latitude: safeLat, longitude: safeLng }, 0);
        }
    }, []);
    // function SpawnAnchor(coordinates : LatLng){
    //     return (<Marker 
    //         coordinate={coordinates}
    //         draggable
    //         title='Destination'
    //     />)
    // }
    return (
        <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            //Only works for IOS ROFL
            mapType='none'
            // customMapStyle={EMPTY_MAP_STYLE}
            initialRegion={{
                longitude: -1.900092,
                longitudeDelta: 0.028236,
                latitude: 52.4778995,
                latitudeDelta: 0.0174604,
            }}
            onMapReady={androidClamp}
            onLongPress={setMarker}
            //Google maps only because whoever made this is deranged and could not figure out a unified solution
            minZoomLevel={16}
            maxZoomLevel={19}
            //IOS
            cameraZoomRange={{
                minCenterCoordinateDistance: 250,
                maxCenterCoordinateDistance: 2500
            }}
            onRegionChangeComplete={Platform.OS === 'ios' ? iosClamp : undefined}
            showsPointsOfInterest={false}
        // cameraZoomRange={}
        //    cameraZoomRange={{}} 
        >
            <UrlTile
                urlTemplate='https://map.burntheatlantic.com/tile/{z}/{x}/{y}.png'
                shouldReplaceMapContent
            />

            {uniqueMarker && (<Marker
                key={uniqueMarker.id}
                coordinate={uniqueMarker.latlng}
                title={uniqueMarker.title}
            />)}

        </MapView>
    );
}

// export default function MapScreen() {
//   return (
//     <View style={styles.container}>
//         <MapView
//             style={styles.map}
//             initialRegion={{
//                 longitude: -1.900092,
//                 longitudeDelta: 0.028236,
//                 latitude: 52.4778995,
//                 latitudeDelta: 0.0174604,
//             }}>
//                 <UrlTile
//                     urlTemplate='http://map.burntheatlantic.com/{z}/{x}/{y}.png'
//                 />
//             </MapView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//     container:{
//         ...StyleSheet.absoluteFillObject,
//         height: 400,
//         width: 400,
//         justifyContent: 'flex-end',
//         alignItems: 'center',
//     },
//     map:{...StyleSheet.absoluteFillObject}
// });
export default BrumMap;

