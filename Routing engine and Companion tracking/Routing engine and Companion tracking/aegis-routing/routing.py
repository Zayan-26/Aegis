from __future__ import annotations

from dataclasses import dataclass
from heapq import heappop, heappush
from math import asin, cos, radians, sin, sqrt
from typing import Dict, Iterable, List, Optional, Tuple

from models import Coordinate, RouteOption

BBOX = (-1.939288, 52.440136, -1.907945, 52.461872)

@dataclass(frozen=True)
class Node:
    node_id: str
    lon: float
    lat: float

    @property
    def coord(self) -> Coordinate:
        return (self.lon, self.lat)


@dataclass(frozen=True)
class Edge:
    edge_id: str
    start: str
    end: str
    distance_km: float
    lighting: int
    crime_risk: int
    slope: int
    crowd: int
    wheelchair_accessible: bool
    has_stairs: bool = False
    covered: bool = False
    rest_point: bool = False
    construction: bool = False


NODES: Dict[str, Node] = {
    "A": Node("A", -1.9386, 52.4406),
    "B": Node("B", -1.9340, 52.4430),
    "C": Node("C", -1.9293, 52.4462),
    "D": Node("D", -1.9244, 52.4493),
    "E": Node("E", -1.9192, 52.4528),
    "F": Node("F", -1.9132, 52.4565),
    "G": Node("G", -1.9085, 52.4606),
    "H": Node("H", -1.9264, 52.4558),
    "I": Node("I", -1.9176, 52.4458),
}

EDGES: Dict[str, Edge] = {
    "AB": Edge("AB", "A", "B", 0.45, lighting=8, crime_risk=2, slope=2, crowd=3, wheelchair_accessible=True, covered=True),
    "BC": Edge("BC", "B", "C", 0.48, lighting=7, crime_risk=2, slope=2, crowd=4, wheelchair_accessible=True, rest_point=True),
    "CD": Edge("CD", "C", "D", 0.50, lighting=8, crime_risk=1, slope=1, crowd=4, wheelchair_accessible=True),
    "DE": Edge("DE", "D", "E", 0.55, lighting=9, crime_risk=1, slope=1, crowd=5, wheelchair_accessible=True, covered=True),
    "EF": Edge("EF", "E", "F", 0.55, lighting=9, crime_risk=1, slope=1, crowd=6, wheelchair_accessible=True),
    "FG": Edge("FG", "F", "G", 0.60, lighting=8, crime_risk=2, slope=1, crowd=5, wheelchair_accessible=True),
    "BI": Edge("BI", "B", "I", 0.70, lighting=5, crime_risk=5, slope=6, crowd=2, wheelchair_accessible=False, has_stairs=True),
    "IC": Edge("IC", "I", "C", 0.65, lighting=4, crime_risk=6, slope=7, crowd=2, wheelchair_accessible=False, has_stairs=True),
    "IH": Edge("IH", "I", "H", 0.95, lighting=5, crime_risk=5, slope=6, crowd=3, wheelchair_accessible=False, has_stairs=True, construction=True),
    "CH": Edge("CH", "C", "H", 0.80, lighting=7, crime_risk=3, slope=2, crowd=4, wheelchair_accessible=True),
    "HE": Edge("HE", "H", "E", 0.70, lighting=7, crime_risk=3, slope=2, crowd=3, wheelchair_accessible=True, rest_point=True),
    "HF": Edge("HF", "H", "F", 0.88, lighting=8, crime_risk=2, slope=1, crowd=4, wheelchair_accessible=True, covered=True),
    "CE": Edge("CE", "C", "E", 1.00, lighting=3, crime_risk=7, slope=5, crowd=2, wheelchair_accessible=False, has_stairs=True),
    "DF": Edge("DF", "D", "F", 1.00, lighting=5, crime_risk=5, slope=4, crowd=3, wheelchair_accessible=True, construction=True),
    "EG": Edge("EG", "E", "G", 1.10, lighting=6, crime_risk=4, slope=3, crowd=4, wheelchair_accessible=True),
}

ADJ: Dict[str, List[Tuple[str, Edge]]] = {node_id: [] for node_id in NODES}
for edge in EDGES.values():
    ADJ[edge.start].append((edge.end, edge))
    ADJ[edge.end].append((edge.start, edge))


def in_bbox(coord: Coordinate) -> bool:
    lon, lat = coord
    min_lon, min_lat, max_lon, max_lat = BBOX
    return min_lon <= lon <= max_lon and min_lat <= lat <= max_lat


def haversine_km(a: Coordinate, b: Coordinate) -> float:
    lon1, lat1 = a
    lon2, lat2 = b
    r = 6371.0
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    aa = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    return 2 * r * asin(sqrt(aa))


def nearest_node(coord: Coordinate) -> str:
    return min(NODES, key=lambda node_id: haversine_km(coord, NODES[node_id].coord))


def edge_cost(edge: Edge, profile: str, wheelchair_required: bool = True, time_of_day: str = "DAY") -> float:
    if wheelchair_required and (not edge.wheelchair_accessible or edge.has_stairs):
        return float("inf") if profile == "safest" else edge.distance_km * 5

    if profile == "fastest":
        penalty = edge.crowd * 0.02 + edge.slope * 0.015
        if edge.construction:
            penalty += 0.15
        return edge.distance_km + penalty

    # safest / accessible
    safety_penalty = (
        edge.crime_risk * 0.22
        + max(0, 6 - edge.lighting) * 0.18
        + edge.slope * 0.08
        + edge.crowd * 0.03
    )
    if time_of_day == "NIGHT":
        safety_penalty *= 1.5
    elif time_of_day == "EVENING":
        safety_penalty *= 1.2
    elif time_of_day == "AFTERNOON":
        safety_penalty *= 1.0
    else: #morning
        safety_penalty *= 0.9



    if edge.construction:
        safety_penalty += 1.2
    if edge.covered:
        safety_penalty -= 0.08
    if edge.rest_point:
        safety_penalty -= 0.06
    return edge.distance_km + max(0.0, safety_penalty)


def dijkstra(start: str, goal: str, profile: str, wheelchair_required: bool = True, time_of_day: str = "DAY") -> Tuple[List[str], List[Edge]]:
    heap: List[Tuple[float, str]] = [(0.0, start)]
    costs: Dict[str, float] = {start: 0.0}
    prev: Dict[str, Tuple[str, Edge]] = {}

    while heap:
        current_cost, node = heappop(heap)
        if node == goal:
            break
        if current_cost > costs.get(node, float("inf")):
            continue
        for neighbor, edge in ADJ[node]:
            cost = edge_cost(edge, profile, wheelchair_required)
            if cost == float("inf"):
                continue
            new_cost = current_cost + cost
            if new_cost < costs.get(neighbor, float("inf")):
                costs[neighbor] = new_cost
                prev[neighbor] = (node, edge)
                heappush(heap, (new_cost, neighbor))

    if goal not in costs:
        raise ValueError("No valid route found for the selected profile.")

    node_path = [goal]
    edge_path: List[Edge] = []
    current = goal
    while current != start:
        previous, edge = prev[current]
        node_path.append(previous)
        edge_path.append(edge)
        current = previous
    node_path.reverse()
    edge_path.reverse()
    return node_path, edge_path


def route_score(edges: Iterable[Edge]) -> int:
    edges = list(edges)
    if not edges:
        return 100
    score = 100.0
    for edge in edges:
        score -= edge.crime_risk * 4.8
        score -= max(0, 5 - edge.lighting) * 3.5
        score -= edge.slope * 2.5
        if edge.construction:
            score -= 8
        if not edge.wheelchair_accessible or edge.has_stairs:
            score -= 25
        if edge.covered:
            score += 1.5
        if edge.rest_point:
            score += 1.0
    return max(25, min(99, round(score)))


def describe_route(edges: Iterable[Edge]) -> str:
    edges = list(edges)
    traits: List[str] = []
    avg_lighting = sum(edge.lighting for edge in edges) / max(1, len(edges))
    if avg_lighting >= 7:
        traits.append("well-lit streets")
    if all(edge.wheelchair_accessible and not edge.has_stairs for edge in edges):
        traits.append("wheelchair-accessible")
    if any(edge.covered for edge in edges):
        traits.append("covered segments")
    if any(edge.rest_point for edge in edges):
        traits.append("rest points nearby")
    if any(edge.construction for edge in edges):
        traits.append("minor disruption risk")
    if not traits:
        traits.append("balanced urban route")
    return ", ".join(traits)


def build_route_option(route_id, label, source, destination, profile, wheelchair_required=True, time_of_day="DAY"):
    start = nearest_node(source)
    goal = nearest_node(destination)

    node_path, edges = dijkstra(start, goal, profile, wheelchair_required, time_of_day)

    coordinates = [source] + [NODES[n].coord for n in node_path] + [destination]
    distance = sum(e.distance_km for e in edges)

    return RouteOption(
        route_id=route_id,
        label=label,
        score=None,
        time_minutes=round(distance * 12),
        distance_km=distance,
        description="Generated route",
        coordinates=coordinates,
        segments=[]
    )


def build_routes(source, destination, wheelchair_required=True, time_of_day="DAY"):
    safest = build_route_option("safest", "Safest Route", source, destination, "safest", wheelchair_required, time_of_day)
    fastest = build_route_option("fastest", "Fastest Route", source, destination, "fastest", wheelchair_required, time_of_day)

    return {"safest": safest, "fastest": fastest}




def nearest_edge_risk(coord: Coordinate) -> Optional[Edge]:
    nearest: Optional[Tuple[float, Edge]] = None
    for edge in EDGES.values():
        mid = ((NODES[edge.start].lon + NODES[edge.end].lon) / 2, (NODES[edge.start].lat + NODES[edge.end].lat) / 2)
        dist = haversine_km(coord, mid)
        if nearest is None or dist < nearest[0]:
            nearest = (dist, edge)
    return nearest[1] if nearest else None
