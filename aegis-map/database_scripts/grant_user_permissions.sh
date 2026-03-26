#!/bin/sh
docker compose exec -T pois psql -U o2p -d o2p -v ON_ERROR_STOP=1 <<'SQL'
GRANT EXECUTE ON FUNCTION public.nearby_pois(double precision, double precision) TO web_anon;
GRANT SELECT ON TABLE public.planet_osm_point TO web_anon;
GRANT SELECT ON TABLE public.planet_osm_polygon TO web_anon;
SQL