
import { useCallback, useEffect, useRef } from 'react';
import MapView, { UrlTile } from 'react-native-maps';

/*
Current maptile server hosted on https://map.burntheatlantic.com/ using https://github.com/Overv/openstreetmap-tile-server/
Using osm.pbf originally downloaded from https://download.geofabrik.de/europe/united-kingdom.html and extracted using https://github.com/openmaptiles/openmaptiles-tools/
Bounding Box for generated map created using https://boundingbox.klokantech.com/
Bounds(CSV): -1.928328,52.460439,-1.871856,52.49536
Taken and modified off https://github.com/react-native-maps/react-native-maps/discussions/4865
*/
const EMPTY_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#000000' }, { visibility: 'off' }] },
  { elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', stylers: [{ visibility: 'off' }] },
];
const BrumMap = () => {
    const mapRef = useRef<MapView | null>(null);
    const BrumBounds = {
        sw: {latitude: 52.460439, longitude: -1.928328},
        ne: {latitude: 52.49536, longitude: -1.871856}
    };
    // useEffect(() => {
    //     if(mapRef.current){
    //         mapRef.current.setMapBoundaries(
    //             BrumBounds.ne,
    //             BrumBounds.sw
    //         );
    //     }
    // }, []);
    const onMapReady = useCallback(async () => {
        const map = mapRef.current;
        if(!map) return;
        await map.setMapBoundaries(BrumBounds.ne, BrumBounds.sw);
    }, [])
    return(
        <MapView
            ref={mapRef}
            style={{flex:1}}
            customMapStyle={EMPTY_MAP_STYLE}
            initialRegion={{
                longitude: -1.900092,
                longitudeDelta: 0.028236,
                latitude: 52.4778995,
                latitudeDelta: 0.0174604,
            }}
            onMapReady={onMapReady}
        //    cameraZoomRange={{}} 
        >
            <UrlTile urlTemplate='https://map.burntheatlantic.com/tile/{z}/{x}/{y}.png'/>
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
