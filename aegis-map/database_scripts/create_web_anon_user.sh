#!/bin/sh
docker compose exec pois psql -U o2p -d o2p -v ON_ERROR_STOP=1 <<'SQL'                                                                                                                                               
DO $$                                                                                        
BEGIN                                                     
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'web_anon') THEN
    CREATE ROLE web_anon NOLOGIN;
  END IF;
END$$;
  
GRANT web_anon TO o2p;
    
GRANT USAGE ON SCHEMA public TO web_anon;
GRANT EXECUTE ON FUNCTION public.nearby_pois(double precision, double precision) TO web_anon;
SQL