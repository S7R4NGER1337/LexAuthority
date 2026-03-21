# LexAuthority

A full-stack web application for a premium international law firm. Built with the MERN stack, the platform combines a polished public-facing website with a fully functional content management system.

---

## Overview

LexAuthority presents the firm's services, team, and legal insights through a modern, performance-oriented interface. The admin panel allows authorised staff to manage all website content — articles, team members, practice areas, and client inquiries — without any technical knowledge.

---

## Tech Stack

**Frontend**
- React 18 with React Router v6
- Vite (build tool)
- DOMPurify (client-side HTML sanitisation)
- CSS Modules / custom CSS (no UI framework)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication via `httpOnly` cookie
- `helmet`, `cors`, `express-rate-limit`, `express-mongo-sanitize`
- `xss` library (server-side HTML sanitisation)

---

## Features

### Public Site

| Page | Description |
|---|---|
| Home | Hero section, animated statistics counter, practice area cards, about section |
| Practice Areas | Grid of all practice areas with icons and descriptions |
| Practice Area Detail | Full page per area: core services, sector specialisations |
| Team | Attorney profiles with photos, titles, and bios |
| Insights | Paginated legal blog with category filtering (6 per page) |
| Insight Detail | Full article view with related articles sidebar |
| Contact | Inquiry form with client-side and server-side validation |

### Admin Panel (`/admin`)

- JWT login with rate limiting (10 attempts / 15 min)
- Full CRUD for: Insights, Team Members, Practice Areas
- Inquiry management: view, change status (new / read / replied), delete
- Protected by `httpOnly; SameSite=Strict` JWT cookie

---

## Project Structure

```
LexAuthority/
├── client/                  # React frontend (Vite)
│   └── src/
│       ├── components/      # Navbar, Footer, PublicLayout
│       ├── hooks/           # useInView, useCountUp
│       ├── pages/           # Public + Admin pages
│       └── utils/           # apiFetch, adminFetch helpers
└── server/                  # Express API
    ├── middleware/          # adminAuth (JWT cookie)
    ├── models/              # Mongoose schemas
    ├── routes/              # insights, team, practice-areas, inquiries, admin
    ├── ecosystem.config.js  # PM2 production config
    └── seed.js              # Database seed script
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### Environment Variables

Create `server/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/lexauthority
JWT_SECRET=<random-string-min-32-chars>
ADMIN_USERNAME=<your-username>
ADMIN_PASSWORD=<your-password>
CLIENT_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### Running in Development

```bash
# Terminal 1 — API server
cd server && npm run dev

# Terminal 2 — React dev server
cd client && npm run dev
```

App runs at `http://localhost:3000`. API at `http://localhost:5000`.

### Seed the Database

```bash
cd server && npm run seed
```

---

## Production Deployment

### Build the frontend

```bash
cd client && npm run build
```

Serve the `dist/` folder via Nginx or any static host.

### Start the API with PM2

```bash
cd server
NODE_ENV=production pm2 start ecosystem.config.js --env production
```

### Nginx reverse proxy (example)

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    # Serve React build
    root /var/www/lexauthority/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:5000;
    }
}
```

---

## Security Highlights

- JWT stored in `httpOnly; Secure; SameSite=Strict` cookie — not accessible to JavaScript
- `express-mongo-sanitize` blocks NoSQL operator injection
- `xss` + `DOMPurify` double-layer HTML sanitisation for rich text content
- Rate limiting on all endpoints (global, per-route, per-login)
- Helmet security headers on all responses
- CORS restricted to the configured `CLIENT_ORIGIN`
- Input validation and field whitelisting on all write operations
- Body size limits (200 KB for HTML content, 16 KB otherwise)

---

## API Endpoints

### Public

```
GET  /api/insights               Paginated insights list
GET  /api/insights/:slug         Single insight
GET  /api/team                   All team members
GET  /api/practice-areas         All practice areas
GET  /api/practice-areas/:slug   Single practice area
POST /api/inquiries              Submit contact inquiry
GET  /health                     Health check
```

### Admin (requires authentication)

```
POST   /api/admin/login                    Login
POST   /api/admin/logout                   Logout

GET    /api/admin/insights                 List insights
POST   /api/admin/insights                 Create insight
PUT    /api/admin/insights/:id             Update insight
DELETE /api/admin/insights/:id             Delete insight

GET    /api/admin/team                     List team members
POST   /api/admin/team                     Create member
PUT    /api/admin/team/:id                 Update member
DELETE /api/admin/team/:id                 Delete member

GET    /api/admin/practice-areas           List practice areas
POST   /api/admin/practice-areas           Create area
PUT    /api/admin/practice-areas/:id       Update area
DELETE /api/admin/practice-areas/:id       Delete area

GET    /api/admin/inquiries                List inquiries
PATCH  /api/admin/inquiries/:id/status     Update status
DELETE /api/admin/inquiries/:id            Delete inquiry
```
