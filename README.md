# Real‑Time Database Tracker

A full‑stack application that captures real‑time changes from MongoDB and delivers them to connected clients via WebSockets, with Kafka as a durable, scalable event bus. Built with Node.js, Express, MongoDB Change Streams, Socket.IO, Kafka (via Docker), and a React frontend.

---

## 🔍 Features

- **Real‑time Change Capture**: Uses MongoDB Change Streams to detect inserts, updates, and deletes.
- **Durable Event Bus**: Kafka (via Docker) buffers and persists events, enabling replay and horizontal scaling.
- **WebSocket Delivery**: Socket.IO pushes updates to individual users in real time.
- **Frontend Dashboard**: React component displays live updates in a Bootstrap table.
- **History Storage**: Each change is also stored in the user’s MongoDB document (`dbUpdates`) for audit or replay.
- **Auto‑Resume**: On server restart, resumes tracking for users who had active streams.

---

## 🏗 Architecture Overview

```
[MongoDB Change Stream] ──► [Kafka Producer] ──► Kafka Topic "db-change" ──► [Kafka Consumer] ──► [Socket.IO] ──► Browser Client
                     │                                    ▲                          │
                     └──► [History DB: user.dbUpdates]      │                          └──► React Dashboard
```

1. **ChangeStreamManager** watches MongoDB for changes, pushes each event to Kafka, and stores it in the user’s document.
2. **Kafka** retains and distributes events on the `db-change` topic.
3. **Socket.IO** consumer subscribes to `db-change`, extracts `userId` from each message, and emits to that user’s room.
4. **React Frontend** connects with a `userId` query, listens for `realtime-update-<userId>` events, and renders updates.

---

## 📋 Prerequisites

- **Node.js** v16+ and **npm**
- **Docker** & **Docker Compose** (for Kafka & Zookeeper)
- **MongoDB Atlas** or **local MongoDB** running as a replica set (required for Change Streams)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
 git clone git@github.com:NirvedMishra/Real-time-database.git
 cd Real-time-database
```

### 2. Configure Environment Variables

Create a `.env` file at the root of `backend/` with the following:

```ini
# MongoDB connection
USER_DB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/
DB_NAME=RealTimeDB
PORT=3000

# Google OAuth 2.0 credentials
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
GOOGLE_REDIRECT_URI=http://localhost:3000/api/v1/auth/google/callback
```

> **Note:** Replace `<your-google-client-id>` and `<your-google-client-secret>` with the values obtained from the Google Cloud Console. Ensure your OAuth consent screen and redirect URIs are properly configured.

### 3. Start Kafka & Zookeeper with Docker

```bash
docker-compose up -d
```

Verify services:
```bash
docker ps --format "table {{.Names}}	{{.Image}}	{{.Ports}}"
# Should show 'zookeeper' on 2181 and 'kafka' on 9092
```

### 4. Install & Run the Backend

```bash
cd backend
npm install
npm start      # or `node src/index.js`
```

### 5. Install & Run the Frontend

```bash
cd frontend
npm install
npm run dev    # or `npm start` depending on setup
```

Open your browser at `http://localhost:5500` (or your dev server port) and navigate to the dashboard.

---

