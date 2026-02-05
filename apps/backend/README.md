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

## API Documentation

### Base URL: `/api`

#### **Authentication**

- `ALL /api/auth/*` - Handled by Better Auth

#### **Categories** (`/api/categories`)

- `GET /` - Get all categories
- `GET /:id` - Get category by ID
- `GET /slug/:slug` - Get category by slug
- `POST /` - Create category (Admin only)
- `PUT /:id` - Update category (Admin only)
- `DELETE /:id` - Delete category (Admin only)

#### **Menu** (`/api/menu`)

- `GET /` - Get all menu items (Supports filters: `categoryId`, `search`, `minPrice`, `maxPrice`, `available`, `isVegetarian`, `isVegan`, `isGlutenFree`)
- `GET /:id` - Get menu item by ID
- `POST /` - Create menu item (Admin only)
- `PUT /:id` - Update menu item (Admin only)
- `DELETE /:id` - Soft delete menu item (Admin only)

#### **Orders** (`/api/orders`)

- `GET /` - Get all orders (Kitchen/Admin only. Filter by `status`)
- `GET /my` - Get current user's orders (Auth required)
- `GET /session/:sessionId` - Get orders by session ID (for guests)
- `GET /:id` - Get order by ID
- `POST /validate` - Validate cart items and get totals
- `POST /` - Create a new order (Auth required)
- `PUT /:id/status` - Update order status (Kitchen only)
- `POST /:id/cancel` - Cancel an order

#### **System**

- `GET /health` - Health check endpoint

## Managing User Roles

To assign roles (Admin, Kitchen) to users, use Drizzle Studio:

1.  **Run Drizzle Studio:**
    ```bash
    pnpm db:studio
    ```
    This will open Drizzle Studio in your browser (usually at https://local.drizzle.studio).
2.  **Update User Role:**
    - Navigate to the `user` table.
    - Find the target user.
    - Update the `role` column to either `admin` or `kitchen`.
    - Changes are saved automatically.

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

## ER diagram

 <img width="2308" height="2637" alt="image" src="https://github.com/user-attachments/assets/360abcce-86f6-4a01-8f1d-6999d9746d77" />
