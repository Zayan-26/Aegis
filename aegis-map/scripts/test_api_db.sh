#!/bin/sh
#replace map.burntheatlantic.com with your endpoint.
curl -s https://map.burntheatlantic.com/rpc/nearby_pois \
  -H "Content-Type: application/json" \
  -d '{"lat":52.4778995,"lng":-1.900092}'