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

3.  **Database Push:**

    Run to set up the database schema:

    ```bash
    pnpm db:push
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

    The server will be available at [http://localhost:3002](http://localhost:3002).

## Testing

Run the integration tests with:

```bash
pnpm test
```

## API Documentation

### Base URL: `/api`

**Response Format:**
All successful responses are wrapped in a `data` object:

```json
{
  "data": { ... }
}
```

Error responses:

```json
{
  "error": "Error message description"
}
```

---

#### **Authentication**

- `ALL /api/auth/*` - Handled by [Better Auth](https://better-auth.com)

---

#### **Categories** (`/api/categories`)

**GET /**

- **Description:** Get all categories
- **Response:** `data: Category[]`

**GET /:id**

- **Description:** Get category by ID
- **Response:** `data: Category`

**GET /slug/:slug**

- **Description:** Get category by slug
- **Response:** `data: Category`

**POST /** (Admin only)

- **Description:** Create category
- **Request Body:**
  ```json
  {
    "name": "string (required, max 100)",
    "slug": "string (required, max 100, lowercase-hyphens)",
    "sortOrder": "number (optional, int >= 0)"
  }
  ```
- **Response:** `data: Category` (Status 201)

**PUT /:id** (Admin only)

- **Description:** Update category
- **Request Body:**
  ```json
  {
    "name": "string (optional)",
    "slug": "string (optional)",
    "sortOrder": "number (optional)"
  }
  ```
- **Response:** `data: Category`

**DELETE /:id** (Admin only)

- **Description:** Delete category
- **Response:** Empty (Status 204)

---

#### **Menu** (`/api/menu`)

**GET /**

- **Description:** Get all menu items
- **Query Params:**
  - `categoryId`: UUID
  - `search`: string
  - `minPrice`: number
  - `maxPrice`: number
  - `available`: "true" | "false"
  - `isVegetarian`: "true"
  - `isVegan`: "true"
  - `isGlutenFree`: "true"
- **Response:** `data: MenuItem[]`

**GET /:id**

- **Description:** Get menu item by ID
- **Response:** `data: MenuItem`

**POST /** (Admin only)

- **Description:** Create menu item
- **Request Body:**
  ```json
  {
    "categoryId": "string (uuid, required)",
    "name": "string (required, max 200)",
    "description": "string (optional, max 1000)",
    "imageUrl": "string (url, optional)",
    "basePrice": "number (int, positive, required in cents)",
    "prepTimeMinutes": "number (int, 1-120, optional)",
    "isVegetarian": "boolean (optional)",
    "isVegan": "boolean (optional)",
    "isGlutenFree": "boolean (optional)",
    "stockQuantity": "number (int >= 0, optional)"
  }
  ```
- **Response:** `data: MenuItem` (Status 201)

**PUT /:id** (Admin only)

- **Description:** Update menu item
- **Request Body:** Supports all fields from POST, plus `isAvailable` (boolean). All fields optional.
- **Response:** `data: MenuItem`

**DELETE /:id** (Admin only)

- **Description:** Soft delete menu item
- **Response:** Empty (Status 204)

---

#### **Orders** (`/api/orders`)

**GET /** (Kitchen/Admin only)

- **Description:** Get all orders
- **Query Params:**
  - `status`: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
- **Response:** `data: Order[]`

**GET /my** (Auth required)

- **Description:** Get current user's orders
- **Response:** `data: Order[]`

**GET /session/:sessionId**

- **Description:** Get orders by session ID (for guests)
- **Response:** `data: Order[]`

**GET /:id**

- **Description:** Get order by ID
- **Response:** `data: Order`

**POST /validate**

- **Description:** Validate cart items and get totals
- **Request Body:** Same as POST `/` (items array)
- **Response:**
  ```json
  {
    "data": {
      "subtotal": "number",
      "tax": "number",
      "total": "number",
      "itemCount": "number"
    }
  }
  ```

**POST /** (Auth required)

- **Description:** Create a new order
- **Request Body:**
  ```json
  {
    "sessionId": "string (required)",
    "items": [
      {
        "menuItemId": "string (uuid, required)",
        "quantity": "number (int, 1-99, required)",
        "notes": "string (optional, max 500)"
      }
    ],
    "notes": "string (optional, max 500)"
  }
  ```
- **Response:** `data: Order` (Status 201)

**PUT /:id/status** (Kitchen only)

- **Description:** Update order status
- **Request Body:**
  ```json
  {
    "status": "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
  }
  ```
- **Response:** `data: Order`

**POST /:id/cancel**

- **Description:** Cancel an order
- **Response:** `{ "message": "Order cancelled successfully" }`

---

#### **System**

- `GET /health` - Health check endpoint
  - **Response:** `{ "status": "ok", "timestamp": "..." }`

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
