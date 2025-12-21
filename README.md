# 🤖 AI Content Generator Dashboard

A production-grade, event-driven Next.js application designed to generate, manage, and organize AI-generated content. Built with a focus on scalability, real-time feedback, and robust architecture using **Next.js 15**, **TypeScript**, **RabbitMQ**, **Socket.IO**, and **PostgreSQL**.

---

## 🚀 Key Features

*   **AI Content Generation**: Dynamic templates for Blog Posts, LinkedIn usage, and more using LangChain (OpenAI/Anthropic).
*   **Project-Based Organization**: Group content into campaigns/projects for better workflow management.
*   **Real-Time Notifications**: Instant feedback system for background tasks (Project creation, Generation completion) via WebSockets.
*   **Event-Driven Architecture**: Decoupled background workers ensure the dashboard remains fast and responsive.
*   **Smart Caching & History**: Full timeline of user generation history with "Copy to Clipboard" and "Regenerate" capabilities.
*   **Credit System**: Built-in credit management and usage tracking integration (Razorpay ready).
*   **Secure Authentication**: JWT-based stateless authentication with robust middleware protection.

---

## 🛠️ Technical Stack

### **Core**
*   **Framework**: Next.js 15 (App Router)
*   **Language**: TypeScript (Strict Mode)
*   **Styling**: Tailwind CSS v4 + Framer Motion (Animations)
*   **Components**: Lucide React Icons

### **Backend & Infrastructure**
*   **Server**: Custom Node.js Server (`server.ts`) wrapping Next.js to support WebSockets.
*   **Database**: PostgreSQL (via Prisma ORM).
*   **Message Queue**: RabbitMQ (handling async tasks like Notifications).
*   **Real-time**: Socket.IO (Bidirectional communication).
*   **Protection**: Redis (API Rate Limiting & security).
*   **Validation**: Zod (Schema validation).

---

## 🏗️ Architecture & Flows

The application uses a **Microservices-lite** approach within a Monorepo interaction model.

### 1. The Event-Driven Notification System
Instead of blocking the user's request to send notifications or save non-critical data, we utilize an asynchronous queue system.

**The Loopback Flow:**
1.  **Client/API**: User performs an action (e.g., Creates a Project).
2.  **Producer**: The API Route publishes a message to the `notifications` RabbitMQ queue.
3.  **Worker Service** (`worker.ts`):
    *   Runs as a separate process.
    *   Consumes the message.
    *   Saves the notification to Postgres (Prisma).
    *   **Publishes** a new message to the `socket_events` queue.
4.  **Web Server**:
    *   Consumes the `socket_events` queue.
    *   Emits the event via **Socket.IO** to the specific user's room.
5.  **Client**: The `NotificationBell` component receives the event and optimistically updates the UI.

### 2. Worker Offloading
Heavy computational tasks or database-heavy logging operations are offloaded to `worker.ts`. This ensures:
*   The API responds immediately (< 100ms).
*   The main web server isn't bogging down by background processing.
*   The main web server isn't bogging down by background processing.
*   Reliability (Queued tasks are persistent).

### 3. API Rate Limiting (Protection)
To prevent abuse and DDoS attacks, we employ **Redis-based sliding window rate limiting** via the `protect()` middleware.
*   **Logic**: Limits users to ~20 requests/minute.
*   **Storage**: Uses Redis `INCR` and `EXPIRE` for atomic, high-performance tracking.
*   **Fail-Safe**: If Redis is down, the system fails-open to allow legitimate traffic to continue.

---

## 🏁 Getting Started

### Prerequisites
*   Node.js 18+
*   PostgreSQL
*   RabbitMQ (Local or Cloud like CloudAMQP)

### 1. Installation
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file:
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/mydb"
JWT_SECRET="your-super-secret"
RABBITMQ_URL="amqp://user:pass@localhost:5672"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
# OpenAI / Anthropic Keys if applicable
```

### 3. Database Setup
```bash
npx prisma generate
npx prisma db push
```

### 4. Running the Application
You need to run **two** processes for the full system to function:

**Terminal 1: Web Server & Socket Consumer**
```bash
npm run dev
# Starts Next.js + Socket.IO Server on port 3000
```

**Terminal 2: Background Worker**
```bash
npm run worker
# Starts the RabbitMQ Consumer for DB writes
```

---

## 📂 Project Structure

*   **/src/app**: Next.js App Router pages and API routes.
*   **/src/components**: Reusable UI components (NotificationBell, etc.).
*   **/src/lib**: Core utilities.
    *   `rabbitmq.ts`: Connection and pub/sub logic.
    *   `socket.ts`: Singleton Socket instance.
    *   `notification-consumer.ts`: Worker logic for saving notifs.
    *   `socket-event-consumer.ts`: Server logic for emitting events.
*   **/prisma**: Database schema.
*   `server.ts`: Custom server entry point.
*   `worker.ts`: Worker process entry point.


---

## 🤝 Contribution
1.  Fork the repo.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit changes (`git commit -m 'Add amazing feature'`).
4.  Push to branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

---

## 🔌 Public API

The application exposes a public API for developers to programmatically access their data.

### Authentication
All public API requests must include the API Token in the `Authorization` header.
```http
Authorization: Bearer <YOUR_API_TOKEN>
```
*You can generate API Tokens in the Settings page.*

### Endpoints

#### 1. Get All Projects
Retrieves a list of all your projects, ordered by creation date (newest first).

*   **URL**: `/api/public/get-projects`
*   **Method**: `GET`
*   **Response**: Array of Project objects.

```bash
curl -X GET "/api/public/get-projects" \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

#### 2. Get Single Project
Retrieves detailed information about a specific project by its slug.

*   **URL**: `/api/public/get-project/[slug]`
*   **Method**: `GET`
*   **URL Params**: `slug` (required)
*   **Query Params**:
    *   `content` (optional): Set to `true` to include the generated content in the response.

```bash
curl -X GET "/api/public/get-project/my-blog-post?content=true" \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

