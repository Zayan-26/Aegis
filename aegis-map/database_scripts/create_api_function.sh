#!/bin/sh
docker compose exec -T pois psql -U o2p -d o2p -v ON_ERROR_STOP=1 <<'SQL'
CREATE OR REPLACE FUNCTION public.nearby_pois(
  lat double precision,
  lng double precision
)
RETURNS TABLE (
  osm_id bigint,
  name text,
  kind text,
  poi_lat double precision,
  poi_lng double precision,
  meters double precision
)
LANGUAGE sql
STABLE
AS $$
  WITH q AS (
    SELECT
      ST_Transform(
        ST_SetSRID(ST_MakePoint(lng, lat), 4326),
        3857
      ) AS q3857
  ),

  poly_candidates AS (
    SELECT
      p.osm_id,
      p.name,
      'polygon'::text AS kind,
      ST_PointOnSurface(p.way) AS geom3857
    FROM public.planet_osm_polygon p
    WHERE
      p.way IS NOT NULL
      AND p.name IS NOT NULL
      AND btrim(p.name) <> ''
      AND p.name !~ '^[0-9]+$'
      AND (
        p.building IS NOT NULL OR
        p.amenity  IS NOT NULL OR
        p.shop     IS NOT NULL OR
        p.tourism  IS NOT NULL OR
        p.leisure  IS NOT NULL OR
        p.office   IS NOT NULL OR
        p.historic IS NOT NULL OR
        p.man_made IS NOT NULL
      )
  ),

  point_candidates AS (
    SELECT
      p.osm_id,
      p.name,
      'point'::text AS kind,
      p.way AS geom3857
    FROM public.planet_osm_point p
    WHERE
      p.way IS NOT NULL
      AND p.name IS NOT NULL
      AND btrim(p.name) <> ''
      AND p.name !~ '^[0-9]+$'
      AND (
        p.amenity  IS NOT NULL OR
        p.shop     IS NOT NULL OR
        p.tourism  IS NOT NULL OR
        p.leisure  IS NOT NULL OR
        p.office   IS NOT NULL OR
        p.historic IS NOT NULL OR
        p.man_made IS NOT NULL OR
        p.railway  IS NOT NULL OR
        p.aeroway  IS NOT NULL
      )
  ),

  all_candidates AS (
    SELECT * FROM poly_candidates
    UNION ALL
    SELECT * FROM point_candidates
  ),

  scored AS (
    SELECT
      c.osm_id,
      c.name,
      c.kind,
      c.geom3857,
      lower(regexp_replace(btrim(c.name), '\s+', ' ', 'g')) AS name_norm,
      ST_Distance(c.geom3857, q.q3857) AS meters
    FROM all_candidates c
    CROSS JOIN q
    WHERE
      ST_DWithin(c.geom3857, q.q3857, 175)

      -- junk filters (simple + reliable)
      AND c.name NOT ILIKE 'drop off %'
      AND c.name NOT ILIKE 'drop-off %'
      AND c.name NOT ILIKE 'entrance%'
      AND c.name NOT ILIKE 'crossing%'
      AND c.name NOT ILIKE 'pedestrian crossing%'
  ),

  one_per_name AS (
    SELECT DISTINCT ON (name_norm)
      osm_id,
      name,
      kind,
      geom3857,
      meters
    FROM scored
    ORDER BY name_norm, meters ASC
  )

  SELECT
    osm_id,
    name,
    kind,
    ST_Y(ST_Transform(geom3857, 4326)) AS poi_lat,
    ST_X(ST_Transform(geom3857, 4326)) AS poi_lng,
    meters
  FROM one_per_name
  ORDER BY meters
  LIMIT 100;
$$;
SQL
