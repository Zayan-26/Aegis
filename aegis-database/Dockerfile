FROM mysql:8

COPY schema/*.sql /tmp/schema/
COPY data/*.sql /tmp/data/

# Now make sure they're in the right order by renaming/prefixing in RUN
RUN for f in /tmp/schema/*.sql; do cp "$f" "/docker-entrypoint-initdb.d/a-$(basename $f)"; done && \
    for f in /tmp/data/*.sql; do cp "$f" "/docker-entrypoint-initdb.d/b-$(basename $f)"; done

