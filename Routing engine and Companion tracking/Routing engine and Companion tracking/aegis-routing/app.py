from __future__ import annotations

from flask import Flask, jsonify, request
from flask_cors import CORS

from routing import BBOX, build_routes
from tracking import start_trip, update_trip

app = Flask(__name__)
CORS(app)


@app.get("/health")
def health() -> tuple:
    return jsonify({"status": "ok", "service": "aegis-routing"}), 200


@app.get("/prototype-area")
def prototype_area() -> tuple:
    min_lon, min_lat, max_lon, max_lat = BBOX
    return jsonify({
        "bbox": {
            "min_lon": min_lon,
            "min_lat": min_lat,
            "max_lon": max_lon,
            "max_lat": max_lat,
        }
    }), 200


@app.post("/auth/demo-login")
def demo_login() -> tuple:
    payload = request.get_json(silent=True) or {}
    username = payload.get("username", "demo-user")
    return jsonify({
        "token": f"demo-token-{username}",
        "user": {"username": username, "display_name": "Aegis Demo User"},
    }), 200


@app.post("/route")
def route() -> tuple:
    payload = request.get_json(silent=True) or {}
    source = payload.get("source")
    destination = payload.get("destination")
    wheelchair_required = bool(payload.get("wheelchair_required", True))

    if not _is_valid_coordinate_pair(source) or not _is_valid_coordinate_pair(destination):
        return jsonify({"error": "source and destination must be [lon, lat]."}), 400

    try:
        routes = build_routes(tuple(source), tuple(destination), wheelchair_required=wheelchair_required)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    if source == destination:
        return jsonify({"error": "Source and destination cannot be the same"}), 400 #added validation check


    return jsonify({
        "source": source,
        "destination": destination,
        "routes": {
            "safest": routes["safest"].to_dict(),
            "fastest": routes["fastest"].to_dict(),
        },
    }), 200


@app.post("/trip/start")
def trip_start() -> tuple:
    payload = request.get_json(silent=True) or {}
    source = payload.get("source")
    destination = payload.get("destination")
    preferred_route = payload.get("preferred_route", "safest")
    trusted_contacts = payload.get("trusted_contacts", [])
    wheelchair_required = bool(payload.get("wheelchair_required", True))

    if preferred_route not in {"safest", "fastest"}:
        return jsonify({"error": "preferred_route must be 'safest' or 'fastest'."}), 400
    if not _is_valid_coordinate_pair(source) or not _is_valid_coordinate_pair(destination):
        return jsonify({"error": "source and destination must be [lon, lat]."}), 400

    try:
        routes = build_routes(tuple(source), tuple(destination), wheelchair_required=wheelchair_required)
        selected_route = routes[preferred_route]
        trip = start_trip(tuple(source), tuple(destination), preferred_route, selected_route.coordinates, trusted_contacts)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    return jsonify({
        "trip_id": trip.trip_id,
        "preferred_route": preferred_route,
        "route": selected_route.to_dict(),
        "trusted_contacts_count": len(trusted_contacts),
    }), 201


@app.post("/trip/update")
def trip_update() -> tuple:
    payload = request.get_json(silent=True) or {}
    trip_id = payload.get("trip_id")
    location = payload.get("location")

    if not trip_id:
        return jsonify({"error": "trip_id is required."}), 400
    if not _is_valid_coordinate_pair(location):
        return jsonify({"error": "location must be [lon, lat]."}), 400

    try:
        result = update_trip(trip_id, tuple(location))
    except KeyError as exc:
        return jsonify({"error": str(exc)}), 404
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    return jsonify(result), 200


def _is_valid_coordinate_pair(value: object) -> bool:
    return (
        isinstance(value, list)
        and len(value) == 2
        and all(isinstance(item, (int, float)) for item in value)
    )


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
