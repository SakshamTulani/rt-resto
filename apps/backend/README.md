# Backend Service

This is the backend API service for the **RT Resto** Restaurant Management System. It powers both the Client and Admin applications using Express and Drizzle ORM.

**Note:** This service is part of the `rt-resto` monorepo.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth
- **Real-time**: Socket.io

## Prerequisites

- **Docker**: Required to run the PostgreSQL database.

## Getting Started

1.  **Environment Setup:**

    Ensure you have created the `.env` file from `.env.example`. This is critical for database connections.

    ```bash
    cp .env.example .env
    ```

2.  **Start Database:**

    Make sure the Docker containers are running (start from the root of the monorepo):

    ```bash
    docker-compose up -d
    ```

3.  **Database Migration:**

    Run migrations to set up the database schema:

    ```bash
    pnpm db:migrate
    ```

    _Optionally, seed the database:_

    ```bash
    pnpm db:seed
    ```

4.  **Run the Service:**

    You can run this service individually using the workspace filter from the root directory:

    ```bash
    pnpm --filter backend dev
    ```

    Or, if you are inside the `apps/backend` directory:

    ```bash
    pnpm dev
    ```

    The server will be available at [http://localhost:3002](http://localhost:3002).

## Available Scripts

- `pnpm dev`: Starts the development server in watch mode.
- `pnpm build`: Compiles TypeScript to JavaScript.
- `pnpm start`: Starts the compiled application.
- `pnpm db:generate`: Generates Drizzle migrations.
- `pnpm db:migrate`: Runs pending migrations.
- `pnpm db:push`: Pushes schema changes directly to the database.
- `pnpm db:studio`: Opens Drizzle Studio to view data.
- `pnpm db:seed`: Seeds the database with initial data.
- `pnpm test`: Runs tests with Vitest.
