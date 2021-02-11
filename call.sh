#!/usr/bin/env bash

curl -X POST \
-H "Content-Type: application/json" \
-H "Authorization: Basic xxx2f403433-ba0b-4ce9-be02-d1cf4ad6f453" \
--data '{"query": "{ properties { listingId favoriteCount } }"}' \
http://localhost:4000/graphql


