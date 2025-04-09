#!/bin/bash

set -e

services=("auth-service" "clock-service" "gateway" "mail-service" "read-service" "register-service" "score-service" "target-service")

for service in "${services[@]}"
do
  echo "📦 Installeren van dependencies voor: $service"
  (cd "$service" && npm install)
done

echo "✅ Alle services zijn up-to-date!"
