# 📘 LinkForge — URL Shortener (Work in Progress)

**LinkForge** is a full-stack URL shortener built with **Angular**, **Node.js + Express**, **MongoDB Atlas**, and **Redis**. It’s containerized for cloud deployment and designed to be scalable and efficient. This project is part of my learning journey — build a practical tool while improving my coding skills.

> ⚠️ **Note:** This is an ongoing learning project. Expect bugs, evolving patterns, and new features over time.

---

## Table of Contents

- [Features](#features)

  - [Frontend (Angular)](#frontend-angular)

    - [Generate](#generate)
    - [Analytics](#analytics)
    - [View All](#view-all)

  - [Backend (Node.js + Express)](#backend-nodejs--express)

- [Architecture](#architecture)
- [Environment Variables](#environment-variables-env-in-server)
- [Redis Cache](#️-redis-cache)
- [Dockerized Setup](#-dockerized-setup)
- [Prerequisites](#-prerequisites)
- [Configuration (Angular environments)](#configuration-angular-environments)
- [Build & Run](#-build--run)
- [Demo](#-demo)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Features

### Frontend (Angular)

The UI is built using **Angular 20** with three primary tabs:

#### 🔗 Generate

- Paste a long URL to generate a short version.
- Click-to-copy or click-to-open functionality.
- QR code generation (with option to download).
- Optional inputs:

  - **Custom Key**
  - **Never Expire** toggle (prevents auto-expiration after 30 days)

#### 📊 Analytics

- **Stats Cards**:

  - Total clicks
  - Total URLs
  - Most clicked URL
  - Newest created URL

- **Charts**:

  - Clicks over time
  - Top 5 URLs (tabbed by views, etc.)

- **Visual breakdowns of**:

  - Referrers
  - OS
  - Devices
  - Browsers

#### 📄 View All

- List of all generated URLs.
- View details and copy links easily.

### Backend (Node.js + Express)

The backend is structured using common design patterns to separate responsibilities.

---

## 🏗️ Architecture

| **Layer**        | **Description**                                                          |
| ---------------- | ------------------------------------------------------------------------ |
| **Models**       | Define the MongoDB schemas.                                              |
| **Repositories** | Handle raw database interactions.                                        |
| **Services**     | Contain business logic; talk to repos, cache, and manage input/output.   |
| **Controllers**  | Handle the route logic; call services.                                   |
| **Config**       | MongoDB + Redis connection setup (using Mongo Atlas + Dockerized Redis). |

---

## 🔐 Environments (Server & Angular)

### Server (.env in `/server`)

You must provide the following:

```env
MONGO_URI=<your_mongo_uri>
REDIS_HOST=redis
REDIS_PORT=6379
```

- Redis is containerized using **Docker Compose**.
- MongoDB is hosted on **MongoDB Atlas**.

### Angular (`/link-forge-client/src/environments/environment.ts`)

Create `environment.ts` with:

```ts
export const environment = {
  production: true,
  apiUrl: "http://localhost:3000", // Adjust if needed
};
```

Create the environments folder by running:

```bash
ng generate environments
```

Then add the contents above.

---

## ⚙️ Redis Cache

- Short URLs are cached for **60 minutes** by default.
- Cache is updated when:

  - A new key is created
  - A key is accessed

Redis service runs locally via **Docker Compose**.

---

## 🐳 Dockerized Setup

The project includes Docker support for:

- **frontend** (Angular)
- **backend** (Node.js + Express)
- **redis** (official Docker image)

---

## 📋 Prerequisites

- Install **Docker Desktop**
- Clone the repository
- Create the **.env** file in the `/server` directory with the values above
- Create the `environment.ts` in `/link-forge-client/src/environments/` (see below)

---

## 🛠️ Build & Run

From the **root** directory:

```bash
docker compose up --build
```

This will spin up:

- Angular app on [http://localhost:4200](http://localhost:4200)
- Node.js API on [http://localhost:3000](http://localhost:3000)
- Redis on `localhost:6379`

---

## 📹 Demo

> 🎥 Click the image below to watch a short walkthrough of the project.

<p align="center">
  <a href="https://www.youtube.com/watch?v=yS13FvkfxTs" target="_blank">
    <img src="https://img.youtube.com/vi/yS13FvkfxTs/0.jpg" alt="Watch the demo" width="600">
  </a>
</p>

---

## 📝 Roadmap

- Nginx reverse proxy setup for production deployment
- Fix Snowflake ID generation (currently WIP and not reliable)
- Docker image publishing for ease of use
- Add user auth & rate limiting
- Full test coverage
- CI/CD pipeline (GitHub Actions)

---

## 🤝 Contributing

Not open to contributions at the moment — it's a personal learning project. But feel free to fork and try it out!

---

## 📜 License

[MIT](https://choosealicense.com/licenses/mit/)
