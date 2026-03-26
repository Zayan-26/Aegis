from routing import build_routes, in_bbox


SOURCE = (-1.9380, 52.4410)
DESTINATION = (-1.9094, 52.4609)


def test_coordinates_are_inside_bbox() -> None:
    assert in_bbox(SOURCE)
    assert in_bbox(DESTINATION)


def test_build_routes_returns_fastest_and_safest() -> None:
    routes = build_routes(SOURCE, DESTINATION, wheelchair_required=True)
    assert "safest" in routes
    assert "fastest" in routes
    assert routes["safest"].score is not None
    assert routes["fastest"].distance_km <= routes["safest"].distance_km + 0.8
    assert "wheelchair-accessible" in routes["safest"].description
