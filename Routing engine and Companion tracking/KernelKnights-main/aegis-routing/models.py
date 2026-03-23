from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

Coordinate = Tuple[float, float]  # (lon, lat)


@dataclass(frozen=True)
class RouteOption:
    route_id: str
    label: str
    score: Optional[int]
    time_minutes: int
    distance_km: float
    description: str
    coordinates: List[Coordinate]
    segments: List[Dict[str, object]] = field(default_factory=list)

    def to_dict(self) -> Dict[str, object]:
        return {
            "route_id": self.route_id,
            "label": self.label,
            "score": self.score,
            "time_minutes": self.time_minutes,
            "distance_km": round(self.distance_km, 2),
            "time": f"{self.time_minutes} min",
            "distance": f"{round(self.distance_km, 2)} km",
            "description": self.description,
            "coordinates": [[lon, lat] for lon, lat in self.coordinates],
            "segments": self.segments,
        }


@dataclass
class Trip:
    trip_id: str
    source: Coordinate
    destination: Coordinate
    preferred_route: str
    planned_path: List[Coordinate]
    trusted_contacts: List[Dict[str, str]]
    updates: List[Coordinate] = field(default_factory=list)
    status: str = "active"
