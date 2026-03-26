DATABASE:
Owner: Mahima Gupta
Setup instructions:
   Pre-requisites:
   1.MySQL 8.0 installed on your laptop/desktop.
   2. MySQL Workbench installed on your laptop/desktop.

Executing the files in this exact order:

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
Password: YOUR_OWN_MySQL_ROOT_PASSWORD

Note: Everyone uses their own local MySQL installation.

Tables present in the database:
- users
- accessibility_prefs
- routes
- companion_sessions
- location_updates