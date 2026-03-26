from __future__ import annotations

from typing import Dict, List
from uuid import uuid4

from models import Coordinate, Trip
from routing import haversine_km, in_bbox, nearest_edge_risk

TRIPS: Dict[str, Trip] = {}
DEVIATION_THRESHOLD_KM = 0.20
STATIONARY_THRESHOLD_KM = 0.03
MIN_STATIONARY_UPDATES = 2


def _distance_to_path(coord: Coordinate, path: List[Coordinate]) -> float:
    return min(haversine_km(coord, point) for point in path)


def start_trip(source: Coordinate, destination: Coordinate, preferred_route: str, planned_path: List[Coordinate], trusted_contacts: List[Dict[str, str]]) -> Trip:
    trip = Trip(
        trip_id=f"trip_{uuid4().hex[:8]}",
        source=source,
        destination=destination,
        preferred_route=preferred_route,
        planned_path=planned_path,
        trusted_contacts=trusted_contacts,
    )
    TRIPS[trip.trip_id] = trip
    return trip


def update_trip(trip_id: str, location: Coordinate) -> Dict[str, object]:
    trip = TRIPS.get(trip_id)
    if trip is None:
        raise KeyError("Trip not found.")
    if not in_bbox(location):
        raise ValueError("Location is outside the current prototype area.")

    trip.updates.append(location)
    distance_to_path = _distance_to_path(location, trip.planned_path)
    alerts: List[Dict[str, object]] = []
    notify_companion = False

    if distance_to_path > DEVIATION_THRESHOLD_KM:
        alerts.append({
            "type": "route_deviation",
            "severity": "warning",
            "message": "User has deviated from the planned route.",
        })
        notify_companion = True

    if len(trip.updates) >= MIN_STATIONARY_UPDATES + 1:
        recent = trip.updates[-(MIN_STATIONARY_UPDATES + 1):]
        moved = max(haversine_km(recent[0], point) for point in recent[1:])
        if moved < STATIONARY_THRESHOLD_KM:
            alerts.append({
                "type": "stationary",
                "severity": "info",
                "message": "User appears stationary and may need a rest check-in.",
            })

    nearest_edge = nearest_edge_risk(location)
    if nearest_edge and (nearest_edge.crime_risk >= 6 or nearest_edge.construction):
        alerts.append({
            "type": "environment_risk",
            "severity": "warning",
            "message": "Nearby segment has elevated risk or temporary disruption.",
            "edge_id": nearest_edge.edge_id,
        })
        notify_companion = True

    status = "ok" if not alerts else "warning"
    if trip.updates and haversine_km(location, trip.destination) < 0.08:
        trip.status = "arrived"
        status = "arrived"
        alerts.append({
            "type": "arrival",
            "severity": "info",
            "message": "User has arrived at the destination.",
        })

    return {
        "trip_id": trip.trip_id,
        "status": status,
        "distance_to_route_km": round(distance_to_path, 3),
        "notify_companion": notify_companion,
        "trusted_contacts_count": len(trip.trusted_contacts),
        "alerts": alerts,
    }
