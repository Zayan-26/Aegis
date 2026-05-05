# syntax=docker/dockerfile:1.4
FROM postgrest/postgrest:latest AS postgrest_bin
FROM postgis/postgis:latest

ENV DEBIAN_FRONTEND=noninteractive

# Map Configuration
ENV MAP_NAME="brum"
ENV OSM_URL="https://download.geofabrik.de/europe/united-kingdom/england/west-midlands-latest.osm.pbf"
ENV BBOX="-2.1,52.35,-1.7,52.6"
ENV PUID=1000
ENV PGID=1000

# Database Configuration
ENV POSTGRES_DB=o2p
ENV POSTGRES_USER=o2p
ENV POSTGRES_PASSWORD=o2p
ENV PGRST_SERVER_HOST=0.0.0.0
ENV PGRST_DB_URI=postgres://o2p:o2p@127.0.0.1:5432/o2p
ENV PGRST_DB_ANON_ROLE=web_anon
ENV PGRST_SERVER_PORT=3000

COPY --from=postgrest_bin /bin/postgrest /usr/local/bin/postgrest

RUN apt-get update && apt-get install -y \
    curl wget gnupg supervisor osm2pgsql osmium-tool git ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g tileserver-gl-light \
    && rm -rf /var/lib/apt/lists/*

RUN wget -q https://download.java.net/java/GA/jdk21/fd2272bbf8e04c3dbaee13770090416c/35/GPL/openjdk-21_linux-x64_bin.tar.gz -O /tmp/jdk21.tar.gz \
    && tar -xzf /tmp/jdk21.tar.gz -C /opt && mv /opt/jdk-21 /opt/jdk && rm /tmp/jdk21.tar.gz
ENV PATH="/opt/jdk/bin:${PATH}"

WORKDIR /app
RUN wget -q https://github.com/onthegomap/planetiler/releases/latest/download/planetiler.jar -O /app/planetiler.jar

# Style Patcher
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

COPY <<-"EOF" /etc/supervisor/conf.d/supervisord.conf
[supervisord]
nodaemon=true
user=root

[program:postgresql]
command=docker-entrypoint.sh postgres
user=postgres
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:postgrest]
command=/usr/local/bin/postgrest
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:tileserver]
directory=/data
command=/usr/bin/env npx tileserver-gl-light -c config.json --port 8080
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
EOF

# Entrypoint with the "Dawg-Fix" Script Patcher
COPY <<-"EOF" /app/entrypoint.sh
#!/bin/bash
set -e

mkdir -p /data/source /data/fonts /data/styles_src

[ ! -f "/data/source/region.osm.pbf" ] && wget -O /data/source/region.osm.pbf "${OSM_URL}"
[ ! -f "/data/source/${MAP_NAME}.osm.pbf" ] && osmium extract -b "${BBOX}" /data/source/region.osm.pbf -o "/data/source/${MAP_NAME}.osm.pbf"
if [ ! -d "/data/fonts/Noto Sans Regular" ]; then
    git clone --depth 1 https://github.com/korywka/fonts.pbf.git /tmp/fonts
    cp -r /tmp/fonts/* /data/fonts/ && rm -rf /tmp/fonts
fi

[ ! -d "/data/styles_src/openmaptiles/.git" ] && git clone --depth 1 https://github.com/openmaptiles/osm-bright-gl-style /data/styles_src/openmaptiles
[ ! -d "/data/styles_src/dark-matter/.git" ] && git clone --depth 1 https://github.com/openmaptiles/dark-matter-gl-style.git /data/styles_src/dark-matter
[ ! -f "/data/openmaptiles.mbtiles" ] && java -Xmx2g -jar /app/planetiler.jar --download --osm-path="/data/source/${MAP_NAME}.osm.pbf" --output="/data/openmaptiles.mbtiles" --maxzoom=14

node /app/setup_styles.js

# Database Background Start
docker-entrypoint.sh postgres &
POSTGRES_PID=$!
until pg_isready -h 127.0.0.1 -U o2p; do sleep 2; done

# Import OSM if missing
if ! psql -h 127.0.0.1 -U o2p -d o2p -c '\dt' | grep -q 'planet_osm_point'; then
    echo "Importing OSM Data..."
    osm2pgsql -d o2p -U o2p -H 127.0.0.1 -P 5432 -W "/data/source/${MAP_NAME}.osm.pbf"
fi

# THE SCRIPTHACK: Strips out the host-side commands and runs the SQL
if [ -d "/app/database_scripts" ]; then
    for script in /app/database_scripts/*; do
        echo "Processing script: $script"
        # 1. Remove bash shebangs
        # 2. Remove 'docker compose' host commands
        # 3. Remove heredoc markers (SQL, EOF)
        # 4. Pipe resulting clean SQL into the local DB
        sed -e '/^#!/d' \
            -e 's/docker compose exec -T [^ ]* psql/psql/g' \
            -e 's/docker-compose exec -T [^ ]* psql/psql/g' \
            -e '/<<.*SQL/d' \
            -e '/^SQL$/d' \
            -e '/^EOF$/d' "$script" > /tmp/temp_run.sql
            
        psql -h 127.0.0.1 -U o2p -d o2p -v ON_ERROR_STOP=1 -f /tmp/temp_run.sql
        rm /tmp/temp_run.sql
    done
fi

kill $POSTGRES_PID
wait $POSTGRES_PID

chown -R ${PUID}:${PGID} /data
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
EOF

# Copy the scripts as-is
COPY ./database_scripts /app/database_scripts
RUN chmod +x /app/entrypoint.sh

EXPOSE 5432 3000 8080
ENTRYPOINT ["/app/entrypoint.sh"]
