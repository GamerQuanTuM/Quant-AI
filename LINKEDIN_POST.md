Built a production-grade AI content generator using Next.js 15 and an event-driven architecture.

Instead of blocking the UI for realtime notifications, the system offloads heavy work to background workers. The frontend triggers an action, the API enqueues a job in RabbitMQ and returns immediately, and a Node.js worker processes the task and stores the result in PostgreSQL. Completion events are pushed back to the client in real time using Socket.IO.

The result is a fast, responsive UI regardless of backend load.

Features include AI-generated content (blogs, tweets, LinkedIn posts), Redis-based rate limiting, real-time notifications, project-based workspaces, and a credit-based usage system.

Stack: Next.js 15 (App Router), Tailwind CSS v4, Node.js, Prisma, Zod, RabbitMQ, PostgreSQL, Redis, and Socket.IO.

#NextJS #TypeScript #AI #WebDevelopment #SoftwareArchitecture #RabbitMQ #FullStack #EventDrivenArchitecture #RealTimeNotifications #Redis #PostgreSQL #SocketIO #NodeJS #Prisma #Zod #LangChain