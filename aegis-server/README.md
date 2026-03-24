Aegis-Backend:
IF you wanna run the backend make sure you got mySQL runninglocally in ur pc
Run using
./mvnw.cmd spring-boot:run
The server will start on port 8080.
I will update this readme for every time the live url restarts
right now it is:https://stanton-swampless-diana.ngrok-free.dev


## Authentication

### Register
```
POST /api/auth/register
Content-Type: application/json

{
    "fullName": "John Doe",
    "email": "john@test.com",
    "password": "password123"
}
```

Returns: `User registered successfully`

---

### Login
```
POST /api/auth/login
Content-Type: application/json

{
    "email": "john@test.com",
    "password": "password123"
}
```

Returns:
```json
{
    "token": "eyJhbGciOiJIUzI1NiJ9......",
    "email": "john@test.com",
    "fullName": "John Doe"
}
```

Store the token and attach it to every subsequent request as a header:
```
Authorization: Bearer TOKEN_HERE
```

Tokens expire after 24 hours.

---

## Routes

### Calculate a route
```
GET /api/routes/calculate
Authorization: Bearer TOKEN_HERE

Query parameters:
- startLat  (e.g. 52.450000)
- startLon  (e.g. -1.920000)
- endLat    (e.g. 52.460000)
- endLon    (e.g. -1.910000)
```

Returns:
```json
{
    "distance_meters": 2199.75,
    "time_milliseconds": 1583819,
    "points": [
        { "latitude": 52.4497, "longitude": -1.9196 },
        { "latitude": 52.4507, "longitude": -1.9177 }
    ]
}
```

Note: coordinates must be within the Birmingham map bounds:
- Latitude: 52.440136 to 52.4618691
- Longitude: -1.9392862 to -1.9079489

---

## Testing from a browser

Save this as a `.html` file, open it in a browser and use the browser console to call the functions:
```html

    const BASE_URL = "https://stanton-swampless-diana.ngrok-free.dev"

    async function register(fullName, email, password) {
        const res = await fetch(`${BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true"
            },
            body: JSON.stringify({ fullName, email, password })
        })
        const text = await res.text()
        console.log(res.ok ? "Registered: " + text : "Failed: " + text)
    }

    async function login(email, password) {
        const res = await fetch(`${BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true"
            },
            body: JSON.stringify({ email, password })
        })
        const data = await res.json()
        console.log(res.ok ? `Token: ${data.token}` : "Failed: " + JSON.stringify(data))
    }

    async function getRoute(token, startLat, startLon, endLat, endLon) {
        const url = `${BASE_URL}/api/routes/calculate?startLat=${startLat}&startLon=${startLon}&endLat=${endLat}&endLon=${endLon}`
        const res = await fetch(url, {
            headers: { 
                "Authorization": `Bearer ${token}`,
                "ngrok-skip-browser-warning": "true"
            }
        })
        const data = await res.json()
        console.log(res.ok ? JSON.stringify(data) : "Failed: " + JSON.stringify(data))
    }

```

Example usage in browser console:
```javascript
register("John Doe", "john@test.com", "password123")
login("john@test.com", "password123")
getRoute("YOUR_TOKEN", 52.450000, -1.920000, 52.460000, -1.910000)
```

---

## Database

MySQL running locally on port 3306, database name `aegis`.

Tables currently set up:
- `users` — stores user accounts
- `accessibility_prefs` — stores user accessibility settings

---