import React, { useCallback, useRef, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, View } from "react-native";
import MapView, { LatLng, LongPressEvent, MapPressEvent, Marker, Region, UrlTile } from "react-native-maps";
import { Picker } from "@react-native-picker/picker";
import { fetchNearbyPois, Poi, poiLabel } from "./apis/request-poi";

type DestinationMarker = {
  id: number;
  latlng: LatLng;
  title: string;
};

const TILE_URL = "https://map.burntheatlantic.com/tile/{z}/{x}/{y}.png";

const INITIAL_REGION: Region = {
  latitude: 52.4778995,
  longitude: -1.900092,
  latitudeDelta: 0.0174604,
  longitudeDelta: 0.028236,
};

export default function BrumMap() {
  const mapRef = useRef<MapView | null>(null);

  const [destination, setDestination] = useState<DestinationMarker | null>(null);

  const [pois, setPois] = useState<Poi[]>([]);
  const [poisLoading, setPoisLoading] = useState(false);
  const [poisError, setPoisError] = useState<string>("");

  const [selectedPoiId, setSelectedPoiId] = useState<string>("");
  const selectedPoi = pois.find((p) => String(p.osm_id) === selectedPoiId) ?? null;

  const onLongPress = useCallback(async (e: LongPressEvent) => {
    const latlng = e.nativeEvent.coordinate;

    setDestination({ id: 0, latlng, title: "Destination" });

    setPois([]);
    setSelectedPoiId("");
    setPoisError("");
    setPoisLoading(true);

    try {
      const data = await fetchNearbyPois(latlng.latitude, latlng.longitude);
      setPois(data.slice(0, 5));
    } catch (err: any) {
      setPoisError(err?.message ?? "Failed to load POIs");
    } finally {
      setPoisLoading(false);
    }
  }, []);
  const onShortPress = useCallback(async (e: MapPressEvent) => {
    setPois([]);
    setSelectedPoiId("");
    setPoisError("");
    setPoisLoading(false);
    setDestination(null)
  }, [])

  const onPickPoi = useCallback(
    (poiId: string) => {
      setSelectedPoiId(poiId);
      const poi = pois.find((p) => String(p.osm_id) === poiId);
      if (!poi || !mapRef.current) return;

      mapRef.current.animateToRegion(
        {
          latitude: poi.poi_lat,
          longitude: poi.poi_lng,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        },
        250
      );
    },
    [pois]
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        mapType="none"
        initialRegion={INITIAL_REGION}
        onLongPress={onLongPress}
        onPress={onShortPress}
        minZoomLevel={16}
        maxZoomLevel={19}
        showsPointsOfInterest={false}
      >
        <UrlTile urlTemplate={TILE_URL} shouldReplaceMapContent />

        {(destination && !selectedPoi) && (
          <Marker
            coordinate={destination.latlng}
            title={destination.title}
            pinColor="red"
            stopPropagation={true}
          />
        )}

        {selectedPoi && (
          <Marker
            coordinate={{ latitude: selectedPoi.poi_lat, longitude: selectedPoi.poi_lng }}
            title={selectedPoi.name ?? "Selected POI"}
            description={`${Math.round(selectedPoi.meters)}m away`}
            pinColor="blue"
          />
        )}
      </MapView>

      {destination && (
        <View style={styles.overlay}>
          <Text style={styles.overlayTitle}>Nearby Places</Text>

          {poisLoading ? (
            <View style={styles.row}>
              <ActivityIndicator />
              <Text style={styles.rowText}>Loading…</Text>
            </View>
          ) : poisError ? (
            <Text style={styles.error}>{poisError}</Text>
          ) : pois.length === 0 ? (
            <Text>Nothing found near that point.</Text>
          ) : (
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={selectedPoiId}
                onValueChange={(value) => onPickPoi(String(value))}
                mode={Platform.OS === "android" ? "dropdown" : "dialog"}
              >
                <Picker.Item color={"#000000"}label="Select a POI…" value="" />
                {pois.slice(0, 20).map((p) => (
                  <Picker.Item
                    key={p.osm_id}
                    color={"#000000"}
                    label={poiLabel(p)}
                    value={String(p.osm_id)}
                  />
                ))}
              </Picker>
            </View>
          )}
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  overlay: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  overlayTitle: { fontWeight: "700", marginBottom: 8 },
  error: { color: "#b00020" },
  row: { flexDirection: "row", alignItems: "center" },
  rowText: { marginLeft: 8, color: "#000000" },
  pickerWrap: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
});