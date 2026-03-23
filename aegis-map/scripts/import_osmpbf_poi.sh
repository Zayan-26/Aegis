#!/bin/sh
docker compose run osm2pgsql \
 -d o2p \
 -U o2p \
 -H pois \
 -P 5432 \
 /data/part_brum.osm.pbf