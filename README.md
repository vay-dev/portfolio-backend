# Victor Ayeni — Developer Portfolio

Personal portfolio website showcasing my projects, skills, and experience as a full-stack developer based in Lagos, Nigeria.

**Live site:** [your-domain.com](https://your-domain.com)

---

## About Me

I'm a full-stack developer with 2+ years of experience building web and mobile applications. I enjoy working across the stack — from crafting clean UIs to designing APIs and integrating AI into products.

- **Email:** ayeniv69@gmail.com
- **GitHub:** [github.com/vay-dev](https://github.com/vay-dev)
- **WhatsApp:** [Chat with me](https://wa.me/2348105315495?text=Hi%20Victor!%20I%20came%20across%20your%20portfolio.)
- **Discord:** discord user name "vaydev24" 

---

## What's in This Repo

This repository contains the backend for my portfolio site.

### Frontend
- Built with **React 19 + TypeScript** and **Vite**
- Animated with **Framer Motion**
- Styled with **TailwindCSS v4** and **Sass**
- Sections: Hero, About, Skills, Projects, Contact

### Backend
- **Express.js + TypeScript** REST API
- **PostgreSQL** database via **Prisma ORM**
- **AI-powered** project description generation using Claude (via OpenRouter — free tier, no billing)
- Admin-protected endpoints with **JWT authentication**
- File upload support for project screenshots via **Multer**
- Auto-screenshot capability via **Playwright**
- API docs at `/api-docs` (Swagger UI)

---

## Running Locally

### Prerequisites
- Node.js 18+
- PostgreSQL running locally

### Backend

```bash
cd portfolio-backend
npm install
cp .env.example .env
```

Set `CORS_ORIGINS` in `.env` as a comma-separated allowlist. For your current frontend setup, use:

```env
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://vay-project-dashboard.vercel.app
```

That allows both local development and your deployed Vercel dashboard frontend to call the backend.

Admin authentication is bootstrapped from env on startup. Set these values in `.env`:

```env
ADMIN_EMAIL=admin@vay.systems
ADMIN_PASSWORD_HASH=replace-me
JWT_SECRET=replace-me
```

On startup, the backend will create or refresh the bootstrap admin user in the database from those values.
