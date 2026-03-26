import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    sheetBg: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    sheetContent: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 40,
        gap: 10,
    },
    destinationRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 12,
        borderBottomWidth: 1,
        marginBottom: 8,
    },
    destinationText: { fontWeight: "600", flex: 1 },
    routeCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 14,
        marginBottom: 8,
    },
    routeLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
    routeInfo: { flex: 1, gap: 2 },
    routeLabel: { fontWeight: "700" },
    routeScore: { fontSize: 12 },
    routeDesc: { fontSize: 12 },
    routeTime: { fontWeight: "700", marginLeft: 8 },

    //Manually doing this because I can
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
        gap: 16,
    },
    profileBtn: {
        position: "absolute",
        top: 20,
        right: 24
    },
    mapBox: {
        flex: 1,
        borderRadius: 20,
        borderWidth: 1,
        overflow: "hidden",
        alignItems: "stretch",
        justifyContent: "flex-start",
        marginVertical: 26
        // gap: 10,
        // padding: 24,
    },
});