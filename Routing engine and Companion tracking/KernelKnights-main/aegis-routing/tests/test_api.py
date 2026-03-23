from app import app


SOURCE = [-1.9380, 52.4410]
DESTINATION = [-1.9094, 52.4609]


def test_route_endpoint() -> None:
    client = app.test_client()
    response = client.post("/route", json={"source": SOURCE, "destination": DESTINATION})
    assert response.status_code == 200
    payload = response.get_json()
    assert payload["routes"]["safest"]["route_id"] == "safest"


def test_trip_flow() -> None:
    client = app.test_client()
    start = client.post(
        "/trip/start",
        json={
            "source": SOURCE,
            "destination": DESTINATION,
            "preferred_route": "safest",
            "trusted_contacts": [{"name": "Sam", "phone": "+440000"}],
        },
    )
    assert start.status_code == 201
    trip_id = start.get_json()["trip_id"]

    update = client.post("/trip/update", json={"trip_id": trip_id, "location": DESTINATION})
    assert update.status_code == 200
    assert update.get_json()["status"] == "arrived"
