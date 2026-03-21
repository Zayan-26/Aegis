<<<<<<< HEAD
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { LatLng, LongPressEvent, MapPressEvent, Marker, Region, UrlTile } from "react-native-maps";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { fetchNearbyPois, Poi, poiLabel } from "@/apis/request-poi";
import { BASE_TILE_URL, DARK_TILE_URL } from "@/constants/endpoints";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { RoutingProvider, useAegisRouting } from "@/contexts/RoutingContext";
=======
import React, { useCallback, useRef, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, Text, View } from "react-native";
import MapView, { LatLng, LongPressEvent, MapPressEvent, Marker, Region, UrlTile } from "react-native-maps";
import { Picker } from "@react-native-picker/picker";
import { fetchNearbyPois, Poi, poiLabel } from "@/apis/request-poi";
>>>>>>> 439bb57 (Shifted AccessibilityContext and API files to match Expo formatting, redid accessibility theme to prevent the chunk of text in every file, the components still shouldn't be handled this way but that's beyond my workload.)

type DestinationMarker = {
  id: number;
  latlng: LatLng;
  title: string;
};

<<<<<<< HEAD
const INITIAL_REGION: Region = {
  latitude: 52.4778995,
  longitude: -1.900092,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

type BrumMapProps = {
  poiSelectCallback: (poi: Poi | null) => void;
};

export default function BrumMap({ poiSelectCallback }: BrumMapProps) {
  const { theme, highContrast } = useAccessibility();
  const mapRef = useRef<MapView | null>(null);
  const {setDestination} = useAegisRouting()
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["20%", "45%"], []);

  const [destinationM, setDestinationM] = useState<DestinationMarker | null>(null);
=======
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
>>>>>>> 439bb57 (Shifted AccessibilityContext and API files to match Expo formatting, redid accessibility theme to prevent the chunk of text in every file, the components still shouldn't be handled this way but that's beyond my workload.)

  const [pois, setPois] = useState<Poi[]>([]);
  const [poisLoading, setPoisLoading] = useState(false);
  const [poisError, setPoisError] = useState<string>("");

  const [selectedPoiId, setSelectedPoiId] = useState<string>("");
  const selectedPoi = pois.find((p) => String(p.osm_id) === selectedPoiId) ?? null;

<<<<<<< HEAD
  const closeSheet = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  const openSheet = useCallback(() => {
    sheetRef.current?.snapToIndex(1);
  }, []);

  const onLongPress = useCallback(async (e: LongPressEvent) => {
    const latlng = e.nativeEvent.coordinate;

    setDestinationM({ id: 0, latlng, title: "Destination" });
=======
  const onLongPress = useCallback(async (e: LongPressEvent) => {
    const latlng = e.nativeEvent.coordinate;

    setDestination({ id: 0, latlng, title: "Destination" });
>>>>>>> 439bb57 (Shifted AccessibilityContext and API files to match Expo formatting, redid accessibility theme to prevent the chunk of text in every file, the components still shouldn't be handled this way but that's beyond my workload.)

    setPois([]);
    setSelectedPoiId("");
    setPoisError("");
    setPoisLoading(true);

    try {
      const data = await fetchNearbyPois(latlng);
<<<<<<< HEAD
      setPois(data.slice(0, 20));
=======
      setPois(data.slice(0, 5));
>>>>>>> 439bb57 (Shifted AccessibilityContext and API files to match Expo formatting, redid accessibility theme to prevent the chunk of text in every file, the components still shouldn't be handled this way but that's beyond my workload.)
    } catch (err: any) {
      setPoisError(err?.message ?? "Failed to load POIs");
    } finally {
      setPoisLoading(false);
    }
  }, []);
<<<<<<< HEAD

  const onShortPress = useCallback((e: MapPressEvent) => {
=======
  const onShortPress = useCallback(async (e: MapPressEvent) => {
>>>>>>> 439bb57 (Shifted AccessibilityContext and API files to match Expo formatting, redid accessibility theme to prevent the chunk of text in every file, the components still shouldn't be handled this way but that's beyond my workload.)
    setPois([]);
    setSelectedPoiId("");
    setPoisError("");
    setPoisLoading(false);
<<<<<<< HEAD
    setDestinationM(null);
    closeSheet();
    poiSelectCallback(null)
  }, [closeSheet]);

  useEffect(() => {
    if (!destinationM) return;
    if (poisLoading) return;
    if (poisError) {
      openSheet();
      return;
    }
    if (pois.length > 0) {
      openSheet();
    }
  }, [destinationM, poisLoading, poisError, pois, openSheet]);

  const selectPoi = useCallback(
    (poi: Poi) => {
      const poiId = String(poi.osm_id);
      setSelectedPoiId(poiId);
      setDestination(poi.name ?? undefined)

      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: poi.poi_lat,
            longitude: poi.poi_lng,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          },
          250,
        );
      }

      poiSelectCallback(poi);
      closeSheet();
    },
    [poiSelectCallback, closeSheet],
=======
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
>>>>>>> 439bb57 (Shifted AccessibilityContext and API files to match Expo formatting, redid accessibility theme to prevent the chunk of text in every file, the components still shouldn't be handled this way but that's beyond my workload.)
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
<<<<<<< HEAD
        <UrlTile urlTemplate={highContrast? DARK_TILE_URL: BASE_TILE_URL} shouldReplaceMapContent />

        {destinationM && !selectedPoi && (
          <Marker coordinate={destinationM.latlng} title={destinationM.title} pinColor="red" stopPropagation />
=======
        <UrlTile urlTemplate={TILE_URL} shouldReplaceMapContent />

        {(destination && !selectedPoi) && (
          <Marker
            coordinate={destination.latlng}
            title={destination.title}
            pinColor="red"
            stopPropagation={true}
          />
>>>>>>> 439bb57 (Shifted AccessibilityContext and API files to match Expo formatting, redid accessibility theme to prevent the chunk of text in every file, the components still shouldn't be handled this way but that's beyond my workload.)
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

<<<<<<< HEAD
      {destinationM && (
        <BottomSheet
          ref={sheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          backgroundStyle={{
            backgroundColor: theme.boxBackground,
          }}
          handleIndicatorStyle={{
            backgroundColor: theme.boxBorderColor,
            width: 40,
            height: 4,
          }}
        >
          <View style={styles.sheetHeader}>
            <Text
              style={[
                styles.sheetTitle,
                {
                  color: theme.mainTextColor,
                  fontFamily: theme.font,
                  letterSpacing: theme.letterSpacing,
                },
              ]}
            >
              Nearby Places
            </Text>
            <Pressable onPress={closeSheet} hitSlop={10}>
              <Text style={{ color: theme.smallTextColor, fontSize: 18 }}>✕</Text>
            </Pressable>
          </View>

          {poisLoading ? (
            <View style={styles.sheetStateRow}>
              <ActivityIndicator />
              <Text style={{ marginLeft: 8, color: theme.smallTextColor, fontFamily: theme.font }}>
                Loading…
              </Text>
            </View>
          ) : poisError ? (
            <Text style={{ color: "#b00020", paddingHorizontal: 16, paddingTop: 8 }}>
              {poisError}
            </Text>
          ) : pois.length === 0 ? (
            <Text style={{ color: theme.smallTextColor, paddingHorizontal: 16, paddingTop: 8 }}>
              Nothing found near that point.
            </Text>
          ) : (
            <BottomSheetFlatList
              data={pois}
              keyExtractor={(p: { osm_id: any; }) => String(p.osm_id)}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
              ItemSeparatorComponent={() => (
                <View style={{ height: 1, backgroundColor: theme.boxBorderColor, opacity: highContrast ? 1 : 0.6 }} />
              )}
              renderItem={({ item } : {item: Poi}) => {
                const isSelected = String(item.osm_id) === selectedPoiId;
                return (
                  <Pressable
                    onPress={() => selectPoi(item)}
                    style={[
                      styles.poiRow,
                      {
                        backgroundColor: isSelected ? theme.buttonColor + "22" : "transparent",
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: theme.mainTextColor,
                        fontFamily: theme.font,
                        letterSpacing: theme.letterSpacing,
                        fontSize: theme.labelSize,
                      }}
                      numberOfLines={1}
                    >
                      {poiLabel(item)}
                    </Text>
                    <Text
                      style={{
                        color: theme.smallTextColor,
                        fontFamily: theme.font,
                        letterSpacing: theme.letterSpacing,
                        marginTop: 2,
                      }}
                    >
                      {Math.round(item.meters)}m away
                    </Text>
                  </Pressable>
                );
              }}
            />
          )}
        </BottomSheet>
=======
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
>>>>>>> 439bb57 (Shifted AccessibilityContext and API files to match Expo formatting, redid accessibility theme to prevent the chunk of text in every file, the components still shouldn't be handled this way but that's beyond my workload.)
      )}
    </View>
  );
}

<<<<<<< HEAD
const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  sheetHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sheetTitle: { fontWeight: "700", fontSize: 16 },

  sheetStateRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },

  poiRow: {
    paddingVertical: 12,
=======

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
>>>>>>> 439bb57 (Shifted AccessibilityContext and API files to match Expo formatting, redid accessibility theme to prevent the chunk of text in every file, the components still shouldn't be handled this way but that's beyond my workload.)
  },
});