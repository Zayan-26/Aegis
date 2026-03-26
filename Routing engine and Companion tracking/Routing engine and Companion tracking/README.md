# Aegis Routing Prototype (Backend)

This module implements the backend prototype for the Aegis navigation system, focusing on routing and companion tracking features.

---

## Overview

The Aegis routing prototype provides:

* Safety-aware and accessibility-aware route generation
* Companion tracking and journey monitoring
* RESTful API endpoints for frontend integration

This prototype is designed as part of the first iteration of the Aegis system and demonstrates the core functionality required for safe and accessible navigation.

---

## Features

* Generate **fastest and safest routes**
* Simulate **accessibility-aware routing**
* Track user journeys in real time (prototype logic)
* Detect:

  * Route deviation
  * Prolonged inactivity
  * Entry into high-risk areas
* Trigger alerts for companion monitoring

---

## Tech Stack

* Python 3
* Flask (API framework)
* Flask-CORS
* Pytest (testing)

---

## Installation & Setup

### 1. Navigate to the project directory

```bash
cd aegis-routing
```

### 2. Create a virtual environment

```bash
py -m venv .venv
```

### 3. Activate the virtual environment

```bash
.venv\Scripts\Activate.ps1
```

(If permission error occurs, run:)

```bash
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

---

## Running the Application

```bash
python app.py
```

The server will start at:

```
http://127.0.0.1:5000
```

---

## API Endpoints

### Health Check

```
GET /health
```

---

### Get Routes

```
POST /route
```

#### Request body:

```json
{
  "source": [longitude, latitude],
  "destination": [longitude, latitude]
}
```

#### Response:

* Fastest route
* Safest route

---

### Start Trip

```
POST /trip/start
```

#### Request:

```json
{
  "route": {...},
  "contacts": ["contact1", "contact2"]
}
```

---

### Update Trip (Tracking)

```
POST /trip/update
```

#### Request:

```json
{
  "trip_id": "trip_001",
  "location": [longitude, latitude]
}
```

#### Response:

* Status updates (on route / warning / arrived)
* Alert messages

---

## Running Tests

```bash
pytest
```

---

## Notes

* This is a prototype and does not use real map data
* Routing logic is simplified for demonstration purposes
* Designed to integrate with the frontend mobile application

---

## Author

Zihan – Routing Engine & Companion Tracking
