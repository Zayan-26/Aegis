
import { StyleSheet, View } from 'react-native';

// import ParallaxScrollView from '@/components/parallax-scroll-view';
import MapView, { UrlTile } from 'react-native-maps';

/*
Current maptile server hosted on https://map.burntheatlantic.com/ using https://github.com/Overv/openstreetmap-tile-server/
Using osm.pbf originally downloaded from https://download.geofabrik.de/europe/united-kingdom.html and extracted using https://github.com/openmaptiles/openmaptiles-tools/

Taken and modified off https://github.com/react-native-maps/react-native-maps/discussions/4865
*/
const BrumMap = () => {

}

export default function MapScreen() {
  return (
    <View style={styles.container}>
        <MapView
            style={styles.map}
            initialRegion={{
                latitude: -1.900092,
                latitudeDelta: 0.028236,
                longitude: 52.4778995,
                longitudeDelta: 0.0174604,
            }}>
                <UrlTile
                    urlTemplate='http://map.burntheatlantic.com/{z}/{x}/{y}.png'
                />
            </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
        ...StyleSheet.absoluteFillObject,
        height: 400,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map:{...StyleSheet.absoluteFillObject}
});
