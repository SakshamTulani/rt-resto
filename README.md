# RT Resto

A modern, full-stack Restaurant Management System built as a monorepo using [Turborepo](https://turbo.build/). This system consists of a customer-facing client application, an administration dashboard, and a backend service.

## Project Structure

This project is organized as a monorepo with the following structure:

- **`apps/client`**: The customer-facing web application for browsing menus and placing orders.
- **`apps/admin`**: The administration dashboard for restaurant managers to manage menus, orders, and settings.
- **`apps/backend`**: The backend API service built with Express, providing data to both frontend applications.
- **`packages/*`**: Shared libraries and configurations used across the applications (UI components, TypeScript config, ESLint config, etc.).

## Prerequisites

Before getting started, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v20 or higher)
- [pnpm](https://pnpm.io/) (v9 or higher)
- [Docker](https://www.docker.com/) (required for the database)

## Getting Started

Follow these steps to set up the project locally:

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd rt-resto
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Start the infrastructure:**

    This project uses PostgreSQL for the database. Start the required services using Docker:

    ```bash
    docker-compose up -d
    ```

4.  **Environment Setup:**

    Copy the example environment files to create your local configurations:

    ```bash
    # Root
    cp .env.example .env

    # Apps
    cp apps/client/.env.example apps/client/.env
    cp apps/admin/.env.example apps/admin/.env
    cp apps/backend/.env.example apps/backend/.env
    ```

    Ensure the database connection string in `apps/backend/.env` matches your Docker configuration (default is provided in `.env.example`).

5.  **Database Migration:**

    Run the database migrations to set up the schema:

    ```bash
    pnpm db:migrate
    ```

    _(Note: This runs the `db:migrate` script from `apps/backend`)_

6.  **Start the development server:**

    Start all applications simultaneously:

    ```bash
    pnpm dev
    ```

    - **Client App**: [http://localhost:3000](http://localhost:3000)
    - **Admin App**: [http://localhost:3001](http://localhost:3001)
    - **Backend API**: [http://localhost:3002](http://localhost:3002)

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
    pnpm --filter backend db:studio
    ```

    This will open Drizzle Studio in your browser (usually at https://local.drizzle.studio).

2.  **Update User Role:**
    - Navigate to the `user` table.
    - Find the target user.
    - Update the `role` column to either `admin` or `kitchen`.
    - Changes are saved automatically.

## Commands

- `turbo dev`: Start the development server for all apps.
- `turbo build`: Build all apps and packages.
- `turbo lint`: Lint all codebases.
- `turbo format`: Format code with Prettier.

For app-specific commands, you can filter by workspace:

```bash
pnpm --filter client dev
pnpm --filter admin build
```

## ER diagram

 <img width="2308" height="2637" alt="image" src="https://github.com/user-attachments/assets/360abcce-86f6-4a01-8f1d-6999d9746d77" />
