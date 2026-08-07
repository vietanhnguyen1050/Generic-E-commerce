# TTCM Full-Stack Starter

Modular full-stack starter with separate React client and Express server.

## Structure

- `client/` - React + Vite + TypeScript frontend
- `server/` - Express + TypeScript backend
- `package.json` - root scripts to run both apps together

## Setup

```bash
npm run install:all
```

## Development

Run both frontend and backend with one command:

```bash
npm run dev
```

- Client runs at `http://localhost:5173`
- Server runs at `http://localhost:5000`
- API base path: `http://localhost:5000/api/v1`

## Environment files

- Copy `server/.env.example` to `server/.env`
- Copy `client/.env.example` to `client/.env`

## API included

- `GET /api/v1/health`
- CRUD endpoints for `items`:
  - `GET /api/v1/items`
  - `GET /api/v1/items/:id`
  - `POST /api/v1/items`
  - `PATCH /api/v1/items/:id`
  - `DELETE /api/v1/items/:id`
