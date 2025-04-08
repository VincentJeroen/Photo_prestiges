#!/bin/bash

set -e

services=("auth-service" "clock-service")

for service in "${services[@]}"
do
  echo "👉 Starten: $service"
  (cd "$service" && docker-compose up --build -d)
done

echo "✅ Alle services zijn gestart!"
