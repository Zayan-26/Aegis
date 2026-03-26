# Folder for Maptiles/POI self-hosting
Sorry for making this stuff spontaneously appear, I forgot to move it here.
##Chungus

I'm a chungus, once you have the tiles.mbtiles and fonts you can put them into the tileserver-gl folder and modify the config.json, then run docker compose run in this directory for the map tiles and poi to function.

## Overview
I was the sole person to work on these as they provide frontend-related capabilities. <br>
Most of these components could be swapped around for self-hosting. <br>
Docker compose is used becuase it trivialises the networking, there are also docker versions of most tools, so that's convenient.

## Components

### OSM.PBF
Original osm.pbf downloaded from https://download.geofabrik.de/europe/united-kingdom.html .<br>
Put the original `osm.pbf` for the region you're using into the source directory in order for the scripts to function. <br>
Extracted using https://github.com/openmaptiles/openmaptiles-tools/ via `./scripts/create_osmpbf.sh`.

### Map Tiles
Generated via instructions and tools from https://github.com/openmaptiles/openmaptiles. <br>
After following the guide to create tiles.mbtiles, the file is copied over to `data/` and the default style and assets from `build/style`  are ported over.<br>
The file is hosted using https://hub.docker.com/r/maptiler/tileserver-gl. No additional configuration is needed.

### POIs (Place-Of-Interest)
Imported from the osm.pbf file using https://hub.docker.com/r/iboates/osm2pgsql and a postgres db docker using https://hub.docker.com/_/postgres. <br>
Do note that the docker is used as a service in docker compose, and the exact command that was used can be found in `scripts/import_osmpbf_poi.sh`.

#### Postgres Modifications for API
After importing the osm.pbf via `osm2pgsql`, the database needs to be further prepared. <br>
The function for querying the POIs will have to be create via the `database_scripts/create_api_function.sh`. <br>
The role for postgrest (mentioned later) will need to be create via the `database_scripts/create_web_anon_user.sh`. <br>
Permissions will have to be granted via the `database_scripts/grant_user_permissions.sh`. <br>

### Postgrest API
In order to access the POIs database, an extra API layer has to be created. The docker compose file should have all the configurations required.

### Cloudflared
In order to provide a consistent endpoint for development and deployment, a cloudflare tunnel is used. Open ports for each service could be used instead if needed.

### OSM-TileServer (No longer used)
https://hub.docker.com/r/overv/openstreetmap-tile-server was originally used as the maptile server solution. However, the apis that the image used aren't always up / got throttled when I needed to regenerate the map tiles, so I abandoned it whole and swapped to doing each step manually.