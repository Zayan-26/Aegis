# Aegis Routing Prototype

Python backend prototype for the Aegis project. This module covers Zihan's area: accessibility-aware routing and basic companion trip tracking.

## Features

- `POST /route` returns a `safest` and `fastest` route
- `POST /trip/start` creates a journey using one selected route
- `POST /trip/update` monitors the journey for deviation, stationary behaviour, and nearby risk
- `POST /auth/demo-login` provides a simple local auth stub for frontend integration
- Prototype area is limited to the agreed bounding box around Birmingham:
  `-1.939288,52.440136,-1.907945,52.461872`

## Request format expected by frontend

### Route request

```json
{
  "source": [-1.9380, 52.4410],
  "destination": [-1.9094, 52.4609],
  "wheelchair_required": true
}
```

### Trip update request

```json
{
  "trip_id": "trip_1234abcd",
  "location": [-1.9200, 52.4500]
}
```

## Setup

```bash
cd aegis-routing
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Server runs at `http://127.0.0.1:5000`.

## Useful endpoints

- `GET /health`
- `GET /prototype-area`
- `POST /auth/demo-login`
- `POST /route`
- `POST /trip/start`
- `POST /trip/update`

## Example curl

```bash
curl -X POST http://127.0.0.1:5000/route \
  -H "Content-Type: application/json" \
  -d '{"source": [-1.9380, 52.4410], "destination": [-1.9094, 52.4609]}'
```

## Running tests

```bash
python -m pytest tests
```

If `pytest` is not installed, install it with:

```bash
pip install pytest
```

## Notes

- The current routing graph is a simplified prototype graph, not a production street network.
- Route scores combine distance, lighting, crime risk, slope, crowd level, construction, and wheelchair access.
- Trip tracking is stored in memory for prototype purposes.
