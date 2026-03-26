# DATABASE:

## Setup instructions:
   ### Pre-requisites:
   + MySQL 8.0 installed on your laptop/desktop.
   + MySQL Workbench installed on your laptop/desktop.

### Executing the files in this exact order:

1. Create tables:
    + schema/01_users.sql
    + schema/02_accessibility_prefs.sql
    + schema/03_routes.sql
    + schema/04_trusted_contacts.sql
    + schema/05_unsafe_zones.sql
    + schema/06_companion_sessions.sql
    + schema/07_location_updates.sql
    + schema/08_feedback.sql

2. Insert test data:
    + data/01_users_data.sql
    + data/02_accessibility_data.sql
    + data/03_routes_data.sql
    + data/04_trusted_contacts_data.sql
    + data/05_unsafe_zones_data.sql
    + data/06_companion_sessions_data.sql
    + data/07_location_updates_data.sql
    + data/08_feedback_data.sql

3. Run tests to verify:
    + tests/01_user_tests.sql
    + tests/02_accessibility_tests.sql
    + tests/03_routes_tests.sql
    + tests/04_trusted_contacts_tests.sql
    + tests/05_unsafe_zones_tests.sql
    + tests/06_companion_tests.sql
    + tests/07_location_tests.sql
    + tests/08_feedback_tests.sql

4. Queries for Spring Boot:
    + queries/01_user_queries.sql
    + queries/02_accessibility_queries.sql
    + queries/03_route_queries.sql
    + queries/04_trusted_contacts_queries.sql
    + queries/05_unsafe_zones_queries.sql
    + queries/06_companion_queries.sql
    + queries/07_location_queries.sql
    + queries/08_feedback_queries.sql

Spring Boot Connection Details
Host: localhost
Port: 3306
Database: aegis
Username: root


# AEGIS Database Tests
 
## How to Run
 
### Option A - Run all tests at once (recommended)
You need to download the database files before 
Open Command Prompt and navigate to this folder:
```
cd path/to/database/tests
mysql -u root -p aegis < 00_run_all_tests.sql
```
Enter your MySQL root password when prompted.
All test results will print to the terminal showing PASS or FAIL.
 
### Option B - Run individual table tests
```
mysql -u root -p aegis < 01_user_tests.sql
mysql -u root -p aegis < 02_accessibility_tests.sql
mysql -u root -p aegis < 03_routes_tests.sql
mysql -u root -p aegis < 04_trusted_contacts_tests.sql
mysql -u root -p aegis < 05_unsafe_zones_tests.sql
mysql -u root -p aegis < 06_companion_sessions_tests.sql
mysql -u root -p aegis < 07_location_updates_tests.sql
mysql -u root -p aegis < 08_feedback_tests.sql
```
 
### Option C - Run in MySQL Workbench
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. File > Open SQL Script > select any test file
4. Press Ctrl+Shift+Enter to run entire file
5. Check results in the output panel
 
## Before Running Tests
Make sure you have:
1. MySQL 8.0 installed
2. The aegis database created: `CREATE DATABASE aegis;`
3. All schema files run (database/schema/ folder)
4. All data files run (database/data/ folder)
 
## Reading Results
- PASS = query works correctly and returns expected data
- FAIL = query returned unexpected result - investigate
- ERROR = constraint correctly rejected invalid data (this is expected behaviour for constraint tests)
 
## Test Files
| File | Table | Tests |
|------|-------|-------|
| 01_user_tests.sql | users | 13 |
| 02_accessibility_tests.sql | accessibility_prefs | 8 |
| 03_routes_tests.sql | routes | 10 |
| 04_trusted_contacts_tests.sql | trusted_contacts | 8 |
| 05_unsafe_zones_tests.sql | unsafe_zones | 10 |
| 06_companion_sessions_tests.sql | companion_sessions | 10 |
| 07_location_updates_tests.sql | location_updates | 8 |
| 08_feedback_tests.sql | feedback | 8 |
| **TOTAL** | | **75 tests** |

Password: YOUR_OWN_MySQL_ROOT_PASSW

Note: Everyone uses their own local MySQL installation.



Tables present in the database:
- users
- accessibility_prefs
- routes
- companion_sessions
- location_updates