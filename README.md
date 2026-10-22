# Library Management Backend

A RESTful API for managing a library — books, members, and borrow/return records. Built with **Node.js**, **Express 5**, and **ES Modules**.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Known Issues / Notes](#known-issues--notes)

## Tech Stack

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [Express](https://expressjs.com/) v5
- [CORS](https://www.npmjs.com/package/cors)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [Nodemon](https://www.npmjs.com/package/nodemon) (dev auto-restart)

## Project Structure

```
library-management/
├── index.js                        # Express app entry point
├── .env                            # Environment variables
├── .gitignore
├── package.json
├── controllers/
│   └── library.controller.js      # Business logic + in-memory data
├── routers/
│   └── library.router.js          # API route definitions
└── node_modules/
```

## Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm (bundled with Node.js)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd library-management
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables (see below).

4. Start the development server:

   ```bash
   npm start
   ```

   This runs the app via **Nodemon** (`nodemon index.js`), which automatically restarts the server on file changes.

### Environment Variables

Create a `.env` file in the project root (it is already committed in this project) with the following content:

```env
PORT=3000
```

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | Port the Express server listens on | `3000` |

### Running the Server

```bash
npm start
```

The API will be available at:

```
http://localhost:3000/api/library
```

## API Documentation

All endpoints are prefixed with `/api/library`.  
Responses follow a consistent JSON format:

```json
{
  "success": true,
  "message": "...",
  "data": { }
}
```

Errors follow the same shape, with an appropriate HTTP status code (e.g. `400`, `404`, `500`) and `"success": false`.

### Base URL

```
http://localhost:3000/api/library
```

---

### 1. Add a Book

**Endpoint:** `POST /api/library/books`

Adds a new book to the library. The `availableCopies` is initialized to `totalCopies`.

**Request Body:**

```json
{
  "title": "Atomic Habits",
  "author": "James Clear",
  "category": "Self Help",
  "totalCopies": 5
}
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | string | Yes | Title of the book |
| `author` | string | Yes | Author of the book |
| `category` | string | Yes | Category/genre of the book |
| `totalCopies` | number | Yes | Total number of copies in the library |

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "id": 2,
    "title": "Atomic Habits",
    "author": "James Clear",
    "category": "Self Help",
    "totalCopies": 5,
    "availableCopies": 5
  }
}
```

**Error Responses:**

- `400 Bad Request` — Missing required fields:

  ```json
  { "success": false, "message": "Missing required fields" }
  ```

---

### 2. Add a Member

**Endpoint:** `POST /api/library/members`

Registers a new library member.

**Request Body:**

```json
{
  "name": "John",
  "email": "john@gmail.com",
  "phone": "9876543210"
}
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Yes | Full name of the member |
| `email` | string | Yes | Email address of the member |
| `phone` | number | Yes | Phone number of the member |

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "new member created successfully",
  "data": {
    "id": 2,
    "name": "John",
    "email": "john@gmail.com",
    "phone": 9876543210
  }
}
```

**Error Responses:**

- `400 Bad Request` — Missing required fields:

  ```json
  { "success": false, "message": "Missing required fields" }
  ```

---

### 3. Borrow a Book

**Endpoint:** `POST /api/library/borrow/:bookId`

Marks a book as borrowed by a member. Decrements the book's available copies.

**Path Parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| `bookId` | number | ID of the book to borrow |

**Request Body:**

```json
{
  "memberId": 1,
  "borrowDate": "2026-07-05",
  "returnDate": "2026-07-12"
}
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `memberId` | number | Yes | ID of the member borrowing the book |
| `borrowDate` | string | Yes | Borrow date (e.g. `YYYY-MM-DD`) |
| `returnDate` | string | Yes | Expected return date (e.g. `YYYY-MM-DD`) |

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "New borrow record created",
  "data": {
    "id": 2,
    "bookId": 1,
    "memberId": 1,
    "borrowDate": "2026-07-05",
    "returnDate": "2026-07-12",
    "status": "borrowed"
  }
}
```

**Error Responses:**

- `400 Bad Request` — Missing fields or no copies available:

  ```json
  { "success": false, "message": "All fields are required" }
  ```

- `400 Bad Request` — No copies available:

  ```json
  { "success": false, "message": "No copies available" }
  ```

- `404 Not Found` — Book or member not found:

  ```json
  { "success": false, "message": "Book not found" }
  ```

  ```json
  { "success": false, "message": "Member not found" }
  ```

---

### 4. Return a Book

**Endpoint:** `PUT /api/library/return/:borrowId`

Marks a borrow record as returned and increments the book's available copies.

**Path Parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| `borrowId` | number | ID of the borrow record to return |

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Book returned"
}
```

**Error Responses:**

- `400 Bad Request` — Book already returned:

  ```json
  { "success": false, "message": "Book already returned" }
  ```

- `404 Not Found` — Borrow record (or book) not found:

  ```json
  { "success": false, "message": "Borrow record not found" }
  ```

---

### 5. Get All Books

**Endpoint:** `GET /api/library/books`

Returns all books in the library.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Atomic Habits",
      "author": "James Clear",
      "category": "Self Help",
      "totalCopies": 5,
      "availableCopies": 5
    }
  ]
}
```

---

### 6. Get All Borrowed Books

**Endpoint:** `GET /api/library/borrowed`

Returns all current borrow records with book and member details.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "borrowId": 1,
      "bookTitle": "Atomic Habits",
      "memberName": "John",
      "borrowDate": "2026-07-05",
      "returnDate": "2026-07-12",
      "status": "borrowed"
    }
  ]
}
```

---

### 7. Get All Members

**Endpoint:** `GET /api/library/members`

Returns all registered members.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John",
      "email": "john@gmail.com",
      "phone": 9876543210
    }
  ]
}
```

---

## Known Issues / Notes

- **In-memory storage:** Data is kept in arrays inside `controllers/library.controller.js` and is not persisted to a database. The server resets all data on restart.
- **No update/delete endpoints:** Currently only add/borrow/return/list operations are implemented.
- **Borrow/return record shapes:** Some borrow records may reference fields (e.g. `bookTitle`, `memberName`) that differ from the stored book/member field names, so derived fields may fall back to placeholder values like `"Book not found"`.
- **Return logic lookup:** The return endpoint currently looks up the book using the borrow record ID; it may need refinement to look up by `bookId`.
