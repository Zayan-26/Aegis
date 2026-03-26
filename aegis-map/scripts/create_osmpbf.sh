docker run -it --rm -u $(id -u ${USER}):$(id -g ${USER}) \
           -v "${PWD}:/tileset" \
           -v "./source:/data" openmaptiles/openmaptiles-tools \
           osmconvert /data/united-kingdom-260311.osm.pbf -b=-2.063813,52.372091,-1.756195,52.547394 -o=/data/part_brum.osm.pbf