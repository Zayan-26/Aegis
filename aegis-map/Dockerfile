# syntax=docker/dockerfile:1.4
FROM maptiler/tileserver-gl:latest

USER root
ENV DEBIAN_FRONTEND=noninteractive

# --- System Deps ---
# xvfb and libgl1-mesa-dri are MANDATORY for raster tile generation on headless devices
RUN apt-get update && apt-get install -y \
    openjdk-21-jre-headless wget git supervisor osm2pgsql osmium-tool ca-certificates \
    postgresql postgresql-client libgl1-mesa-dri xvfb curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# --- ENV VARS ---
ENV MAP_NAME="brum"
ENV OSM_URL="https://download.geofabrik.de/europe/united-kingdom/england/west-midlands-latest.osm.pbf"
ENV BBOX="-2.1,52.35,-1.7,52.6"
ENV PUID=1000
ENV PGID=1000

ENV POSTGRES_DB=o2p
ENV POSTGRES_USER=o2p
ENV POSTGRES_PASSWORD=o2p
ENV PGRST_SERVER_HOST=0.0.0.0
ENV PGRST_DB_URI=postgres://o2p:o2p@127.0.0.1:5432/o2p
ENV PGRST_DB_ANON_ROLE=web_anon
ENV PGRST_SERVER_PORT=3000

COPY --from=postgrest/postgrest:latest /bin/postgrest /usr/local/bin/postgrest

RUN wget -q https://github.com/onthegomap/planetiler/releases/latest/download/planetiler.jar -O /app/planetiler.jar

# --- Setup Styles Patch Script ---
COPY <<-"EOF" /app/setup_styles.js
const fs = require('fs');
const path = require('path');
const dataDir = '/data', stylesDir = '/data/styles_src';
const getAllStyles = (dir) => {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            if (!file.startsWith('.') && file !== 'layers') results = results.concat(getAllStyles(filePath));
        } else if (file.endsWith('.json')) results.push(filePath);
    });
    return results;
};
const patchStyle = (stylePath) => {
    try {
        const style = JSON.parse(fs.readFileSync(stylePath, 'utf8'));
        if (style.version !== 8 || !style.layers) return null;
        const fileName = path.basename(stylePath, '.json');
        const styleId = fileName === 'style' ? path.basename(path.dirname(stylePath)) : fileName;
        style.sources = { "openmaptiles": { "type": "vector", "url": "mbtiles://openmaptiles.mbtiles" } };
        style.glyphs = "{fontstack}/{range}.pbf";
        style.sprite = "sprite";
        const outPath = path.join(dataDir, `${styleId}.json`);
        fs.writeFileSync(outPath, JSON.stringify(style, null, 2));
        return { id: styleId, file: `${styleId}.json` };
    } catch (e) { return null; }
};
const config = {
    options: { paths: { root: "/data", fonts: "fonts", styles: ".", mbtiles: ".", sprites: "." } },
    styles: {}, data: { openmaptiles: { mbtiles: "openmaptiles.mbtiles" } }
};
getAllStyles(stylesDir).forEach(f => {
    const res = patchStyle(f);
    if (res) config.styles[res.id] = { style: res.file, name: res.id.replace(/[_-]/g, ' ') };
});
fs.writeFileSync(`${dataDir}/config.json`, JSON.stringify(config, null, 2));
EOF

# --- Supervisor config ---
COPY <<-"EOF" /etc/supervisor/conf.d/supervisord.conf
[supervisord]
nodaemon=true
user=root

[program:postgrest]
command=/usr/local/bin/postgrest
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:tileserver]
directory=/data
# xvfb-run -a creates the virtual display required for raster rendering
command=xvfb-run -a node /usr/src/app --config /data/config.json --port 8080
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
EOF

# --- Entrypoint ---
COPY <<-"EOF" /app/entrypoint.sh
#!/bin/bash
set -e

export PGDATA="/var/lib/postgresql/data"
export PGUSER="o2p"
export PGPASSWORD="o2p"
export PGDB="o2p"

# --- Start Postgres ---
if [ ! -s "$PGDATA/PG_VERSION" ]; then
  mkdir -p "$PGDATA"
  chown -R postgres:postgres "$PGDATA"
  su - postgres -c "/usr/lib/postgresql/16/bin/initdb -D $PGDATA"
fi

su - postgres -c "/usr/lib/postgresql/16/bin/postgres -D $PGDATA" &
until su - postgres -c "psql -c '\l'" >/dev/null 2>&1 ; do sleep 1; done

su - postgres -c "psql -tc \"SELECT 1 FROM pg_roles WHERE rolname='$PGUSER'\"" | grep -q 1 \
  || su - postgres -c "psql -c \"CREATE ROLE $PGUSER LOGIN PASSWORD '$PGPASSWORD';\""
su - postgres -c "psql -lqt" | cut -d \| -f 1 | grep -qw "$PGDB" \
  || su - postgres -c "psql -c \"CREATE DATABASE $PGDB OWNER $PGUSER;\""
su - postgres -c "psql -d $PGDB -c 'CREATE EXTENSION IF NOT EXISTS postgis;'"

# --- Data Prep ---
mkdir -p /data/source /data/fonts /data/styles_src

# Get sprites
wget -q -O /data/sprite.json "https://api.maptiler.com/maps/streets-v4/sprite.json"
wget -q -O /data/sprite.png "https://api.maptiler.com/maps/streets-v4/sprite.png"
wget -q -O /data/sprite@2x.json "https://api.maptiler.com/maps/streets-v4/sprite@2x.json"
wget -q -O /data/sprite@2x.png "https://api.maptiler.com/maps/streets-v4/sprite@2x.png"

[ ! -f "/data/source/region.osm.pbf" ] && wget -O /data/source/region.osm.pbf "${OSM_URL}"
[ ! -f "/data/source/${MAP_NAME}.osm.pbf" ] && osmium extract -b "${BBOX}" /data/source/region.osm.pbf -o "/data/source/${MAP_NAME}.osm.pbf"

if [ ! -d "/data/fonts/Noto Sans Regular" ]; then
    git clone --depth 1 https://github.com/korywka/fonts.pbf.git /tmp/fonts
    cp -r /tmp/fonts/* /data/fonts/ && rm -rf /tmp/fonts
fi

[ ! -d "/data/styles_src/openmaptiles/.git" ] && git clone --depth 1 https://github.com/openmaptiles/osm-bright-gl-style /data/styles_src/openmaptiles
[ ! -d "/data/styles_src/dark-matter/.git" ] && git clone --depth 1 https://github.com/openmaptiles/dark-matter-gl-style.git /data/styles_src/dark-matter

[ ! -f "/data/openmaptiles.mbtiles" ] && java -Xmx2g -jar /app/planetiler.jar --download --osm-path="/data/source/${MAP_NAME}.osm.pbf" --output="/data/openmaptiles.mbtiles" --maxzoom=16

node /app/setup_styles.js

# --- Import & SQL ---
if ! psql -h 127.0.0.1 -U $PGUSER -d $PGDB -c '\dt' | grep -q 'planet_osm_point'; then
    osm2pgsql -d $PGDB -U $PGUSER -H 127.0.0.1 -P 5432 -W "/data/source/${MAP_NAME}.osm.pbf"
fi

if [ -d "/app/database_scripts" ]; then
    for script in /app/database_scripts/*; do
        sed -e '/^#!/d' -e 's/docker compose exec -T [^ ]* psql/psql/g' -e 's/docker-compose exec -T [^ ]* psql/psql/g' -e '/<<.*SQL/d' -e '/^SQL$/d' -e '/^EOF$/d' "$script" > /tmp/temp_run.sql
        su - postgres -c "psql -d $PGDB -v ON_ERROR_STOP=1 -f /tmp/temp_run.sql"
        rm /tmp/temp_run.sql
    done
fi

chown -R ${PUID}:${PGID} /data
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
EOF

COPY ./database_scripts /app/database_scripts
RUN chmod +x /app/entrypoint.sh

EXPOSE 5432 3000 8080
ENTRYPOINT ["/app/entrypoint.sh"]
