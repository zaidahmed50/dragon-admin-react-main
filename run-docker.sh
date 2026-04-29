#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

ENV_FILE=".compose.env"
DEFAULT_PORT="8090"

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker is not installed."
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "Error: Docker daemon is not running."
  exit 1
fi

env_port=""
if [[ -f "$ENV_FILE" ]]; then
  env_port="$(grep -E '^HOST_PORT=' "$ENV_FILE" | tail -n1 | cut -d'=' -f2- | tr -d '[:space:]' || true)"
fi

HOST_PORT="${1:-${HOST_PORT:-${env_port:-$DEFAULT_PORT}}}"

if ! [[ "$HOST_PORT" =~ ^[0-9]+$ ]] || (( HOST_PORT < 1 || HOST_PORT > 65535 )); then
  echo "Error: invalid port '$HOST_PORT'. Use a number between 1 and 65535."
  exit 1
fi

echo "Using host port: $HOST_PORT"

docker_ids="$(docker ps --filter "publish=${HOST_PORT}" -q || true)"
if [[ -n "$docker_ids" ]]; then
  echo "Stopping Docker container(s) using port $HOST_PORT..."
  docker stop $docker_ids >/dev/null
fi

if command -v lsof >/dev/null 2>&1; then
  pids="$(lsof -tiTCP:"$HOST_PORT" -sTCP:LISTEN || true)"
else
  echo "Error: lsof is required to find and kill port listeners."
  exit 1
fi

if [[ -n "$pids" ]]; then
  echo "Killing process(es) on port $HOST_PORT: $pids"
  kill $pids || true
  sleep 1

  pids_after="$(lsof -tiTCP:"$HOST_PORT" -sTCP:LISTEN || true)"
  if [[ -n "$pids_after" ]]; then
    echo "Force-killing remaining process(es): $pids_after"
    kill -9 $pids_after || true
  fi
fi

if lsof -tiTCP:"$HOST_PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Error: port $HOST_PORT is still busy."
  exit 1
fi

echo "Starting docker compose..."
HOST_PORT="$HOST_PORT" docker compose --env-file "$ENV_FILE" up --build -d

echo "Container started at http://localhost:$HOST_PORT"
docker compose --env-file "$ENV_FILE" ps
