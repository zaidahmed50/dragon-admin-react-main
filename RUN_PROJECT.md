# Dragon Admin React - Run Guide

## 1) Check prerequisites

```bash
node -v
npm -v
docker --version
docker compose version
```

If `node` or `npm` is missing, install with `nvm`:

```bash
# Install nvm (macOS/Linux)
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Reload shell, then install Node LTS (includes npm)
nvm install --lts
nvm use --lts
```

## 2) Install dependencies and build locally

```bash
npm install
npm run build
```

This creates the production build in `dist/`.

## 3) Run with Docker Compose (with host port forwarding)

From project root:

```bash
# Uses .compose.env (default host 8090 -> container 80)
docker compose --env-file .compose.env up --build -d
```

Custom host port in one command:

```bash
# Example: host 3000 -> container 80
HOST_PORT=3000 docker compose --env-file .compose.env up --build -d
```

Open in browser:

```text
http://localhost:8090
```

or if custom port:

```text
http://localhost:<HOST_PORT>
```

To access from another machine on your network:

```text
http://<your-host-ip>:<HOST_PORT>
```

If port is already in use, change `HOST_PORT` in `.compose.env`.

## 4) Docker status and lifecycle

```bash
docker compose --env-file .compose.env ps
docker compose --env-file .compose.env port dragon-admin 80
docker compose --env-file .compose.env down
```

## 5) Logs (Docker-wise and app-wise)

Docker/Compose logs:

```bash
# All service logs
docker compose --env-file .compose.env logs -f

# Only this service logs
docker compose --env-file .compose.env logs -f dragon-admin

# Last 100 lines
docker compose --env-file .compose.env logs --tail=100 dragon-admin
```

Container logs by container name:

```bash
docker logs -f dragon-admin-react
```

App server logs inside container (Nginx access/error):

```bash
docker compose --env-file .compose.env exec dragon-admin sh -c 'tail -f /var/log/nginx/access.log /var/log/nginx/error.log'
```

Local app logs (non-Docker dev mode):

```bash
npm run dev
```
