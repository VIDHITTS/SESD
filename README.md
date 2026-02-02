# Library Management System

A full-fledged CRUD backend for Library Management built with Node.js, Express, TypeScript, and MongoDB following OOP principles.

## Features

- Complete CRUD operations for Books, Members, and Borrow Records
- Search, filter, sorting, and pagination
- JWT Authentication
- Input validation and error handling
- Clean OOP structure: Controllers → Services → Models

## Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Project Structure

```
src/
├── controllers/     # Request handlers
├── services/        # Business logic
├── models/          # Mongoose schemas
├── routes/          # API routes
├── middlewares/     # Auth middleware
└── interfaces/      # TypeScript interfaces
```

## API Endpoints

### Books
- `GET /api/books` - Get all books (with search, filter, pagination)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book (auth required)
- `PUT /api/books/:id` - Update book (auth required)
- `DELETE /api/books/:id` - Delete book (auth required)

### Members
- `POST /api/members/register` - Register new member
- `POST /api/members/login` - Login
- `GET /api/members` - Get all members (auth required)
- `GET /api/members/:id` - Get single member (auth required)
- `PUT /api/members/:id` - Update member (auth required)
- `DELETE /api/members/:id` - Delete member (auth required)

### Borrow Records
- `POST /api/borrow` - Borrow a book (auth required)
- `PATCH /api/borrow/:id/return` - Return a book (auth required)
- `GET /api/borrow` - Get all records (auth required)
- `GET /api/borrow/overdue` - Get overdue books (auth required)
- `GET /api/borrow/:id` - Get single record (auth required)

## Query Parameters

### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

### Sorting
- `sortBy` - Field to sort by
- `sortOrder` - asc or desc

### Filtering (Books)
- `search` - Search in title, author, category
- `category` - Filter by category
- `author` - Filter by author
- `available` - Filter available books (true/false)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file:
   ```
   MONGODB_URI=mongodb://localhost:27017/library_db
   JWT_SECRET=your_secret_key
   PORT=8080
   ```
4. Run the server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
