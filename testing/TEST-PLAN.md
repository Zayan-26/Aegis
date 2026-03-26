# Aegis Prototype: Test Plan & Evidence

## 1. Overview
This document is to explain the Unit testing and integration testing we have carried out for Aegis

## 2. Unit Testing Strategy
Unit testing was performed against the individual features to ensure their logic works and there are no errors

### Backend Unit Tests (Spring Boot / JUnit)
**What we are testing:**`RouteController` and `RoutingService`
* **Test 1 (Routing Logic):** Test that GraphHopper successfully calculates a standard fastest route when provided with valid `startLat`, `startLon`, `endLat`, and `endLon` coordinates.
* **Test 2 (Safety Algorithm):** Test that the prototype correctly processes data from our database to use safety multipliers (e.g., `0.5`) to designated "unsafe zones."
* **Test 3 (Data Formatting):** Test the backend correctly packages the response into JSON for frontend

*Evidence: See the attached backend terminal screenshot showing `BUILD SUCCESS` for the `RouteControllerUnitTest`.*

## 3. Integration Testing Strategy
Integration test was run to ensure the database, GraphHopper engine, and Spring Boot Web correctly operate together.

### API Integration Tests (Spring Boot MockMvc)
**What we are testing:** The full `/api/routes/calculate` endpoint.
* **Test 4** A simulated HTTP GET request is fired at the API. What happens during test:
    1. The controller returns an `HTTP 200 OK` status.
    2. The output is formatted strictly as `application/json` 
    3. The JSON array contains exactly two items (`length() == 2`).
    4. Both route objects successfully return a `distance` and a `safetyScore`.

*Evidence: See the attached backend terminal screenshot showing `BUILD SUCCESS` for the `RouteIntegrationTest`.*


## 4. Evidence folder
The screenshots for all tests have been provided in the `test-evidence` folder.
* **`RouteControllerUnitTest.png`**: Terminal output proving all JUnit Unit tests passed with 0 failures.
* **`RouteIntegrationTest.png`**: Terminal output proving all JUnit Unit and Integration tests passed with 0 failures.