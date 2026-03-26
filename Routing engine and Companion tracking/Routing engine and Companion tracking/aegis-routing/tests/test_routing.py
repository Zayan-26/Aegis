import pytest
from routing import build_routes, in_bbox, edge_cost, Edge

SOURCE = (-1.9380, 52.4410)
DESTINATION = (-1.9094, 52.4609)
#added some validation tests
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


def test_wheelchair_blocks_invalid_edges() -> None:
    edge = Edge("test", "A", "B", 1.0, 5, 2, 1, 2, wheelchair_accessible=False, has_stairs=True)

    cost = edge_cost(edge, "safest", wheelchair_required=True)

    assert cost == float("inf")

def test_same_source_destination() -> None:
    routes = build_routes(SOURCE, SOURCE)

    assert routes["safest"].distance_km >= 0
    assert routes["fastest"].distance_km >= 0


def test_invalid_coordinates_outside_bbox() -> None:
    with pytest.raises(ValueError):
        build_routes((0, 0), (0, 0))