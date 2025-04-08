#!/bin/bash

services=("auth-service" "clock-service")

for service in "${services[@]}"
do
  echo "🛑 Stoppen: $service"
  (cd "$service" && docker-compose down)
done

echo "🧼 Alles is gestopt."
