from routing import build_routes
from tracking import start_trip, update_trip

SOURCE = (-1.9380, 52.4410)
DESTINATION = (-1.9094, 52.4609)


def test_trip_deviation_triggers_warning() -> None:
    route = build_routes(SOURCE, DESTINATION)["safest"]
    trip = start_trip(SOURCE, DESTINATION, "safest", route.coordinates, [{"name": "Alex", "phone": "+441234"}])
    result = update_trip(trip.trip_id, (-1.9176, 52.4458))
    assert result["status"] == "warning"
    assert any(alert["type"] in {"route_deviation", "environment_risk"} for alert in result["alerts"])


def test_arrival_sets_arrived_status() -> None:
    route = build_routes(SOURCE, DESTINATION)["safest"]
    trip = start_trip(SOURCE, DESTINATION, "safest", route.coordinates, [])
    result = update_trip(trip.trip_id, DESTINATION)
    assert result["status"] == "arrived"
    assert any(alert["type"] == "arrival" for alert in result["alerts"])
