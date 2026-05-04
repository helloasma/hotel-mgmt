# 🌿 Lovender Resort — Hotel Management System

A full-stack hotel management web application built with React, Node.js, Express, and MongoDB.
The platform allows guests to browse rooms, make bookings, and chat with an AI concierge,
while management staff have a dedicated admin dashboard to manage rooms, bookings, users, and staff.

**Live Website:** https://resortlovender.onrender.com
GitHub Link: https://github.com/helloasma/hotel-mgmt

---

## 👥 Group Members

| Name | Student ID |
|------|------------|
| Salma Ahrari | 20220001773 |
| Asma Nazari | 20220002330 |
| Fatima Bey | 20220001636 |

---

## 🛠 Tech Stack

**Frontend:** React 19, React Router DOM, Axios, React Icons, Vite  
**Backend:** Node.js, Express 5, Mongoose, JWT, bcryptjs, express-validator  
**Database:** MongoDB (Atlas)  
**AI Chatbot:** Google Gemini API (`gemini-2.5-flash`)  
**Deployment:** Render

---

## 📦 Installation Guide

### Prerequisites

- Node.js v18 or higher
- npm v9 or higher
- MongoDB Atlas account (or a local MongoDB instance)
- A `.env` file configured for both `client/` and `server/` (see below)

---

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd hotel-mgmt
```

---

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_google_gemini_api_key
```

Start the backend server:

```bash
# Development (with hot-reload)
npm run dev

# Production
npm start
```

Optional — seed the database with initial data:

```bash
npm run seed:admin    # Seeds the default admin account
npm run seed:staff    # Seeds sample staff and contact messages
```

---

### 3. Frontend Setup

```bash
cd ../client
npm install
```

Create a `.env` file inside the `client/` folder:

```env
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

To build for production:

```bash
npm run build
```

---

## 🗄 Database Schema

The application uses **MongoDB** with **Mongoose** ODM. There are six collections:

---

### `users`

Stores guest accounts and admin staff.

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Full name (required) |
| `email` | String | Unique email address (required) |
| `password` | String | Hashed password via bcryptjs (min 6 chars) |
| `phone` | String | Optional phone number |
| `role` | String | `"user"` or `"admin"` (default: `"user"`) |
| `responsibility` | String | Admin role label: `Manager`, `Receptionist`, `Housekeeper`, `Maintenance`, or `New Staff` |
| `resetPasswordToken` | String | Token for password reset flow |
| `resetPasswordExpire` | Date | Expiry timestamp for password reset token |
| `createdAt` / `updatedAt` | Date | Auto-managed timestamps |

---

### `rooms`

Stores all room listings available for booking.

| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Room name (required) |
| `type` | String | `"Suite"` or `"Standard"` (required) |
| `description` | String | Full room description (required) |
| `price` | Number | Price per night in USD (required) |
| `capacity` | Number | Max guests, 1–6 (required) |
| `amenities` | [String] | List of included amenities |
| `images` | [String] | Array of image identifiers |
| `available` | Boolean | Auto-set based on `availableRooms` |
| `category` | String | `"Bungalow"`, `"Cabin"`, or `"Hotel"` (required) |
| `size` | String | Room size description |
| `bed` | String | Bed type description |
| `view` | String | View type (e.g., Ocean View, Forest View) |
| `totalRooms` | Number | Total number of rooms of this type (required) |
| `availableRooms` | Number | Remaining bookable rooms (required) |
| `createdAt` / `updatedAt` | Date | Auto-managed timestamps |

---

### `bookings`

Records every room reservation made by a guest.

| Field | Type | Description |
|-------|------|-------------|
| `user` | ObjectId → `users` | The guest who made the booking (required) |
| `room` | ObjectId → `rooms` | The booked room (required) |
| `checkIn` | Date | Check-in date (required) |
| `checkOut` | Date | Check-out date (required) |
| `adults` | Number | Number of adults, min 1 (required) |
| `children` | Number | Number of children (default: 0) |
| `firstName` | String | Guest first name (required) |
| `lastName` | String | Guest last name (required) |
| `email` | String | Contact email (required) |
| `phone` | String | Contact phone number |
| `paymentMethod` | String | `"card"`, `"apple_pay"`, or `"paypal"` (required) |
| `totalPrice` | Number | Total booking cost (required) |
| `specialRequest` | String | Optional guest requests |
| `status` | String | `"confirmed"` or `"cancelled"` (default: `"confirmed"`) |
| `confirmationCode` | String | Unique auto-generated code (e.g., `BK-ABC123`) |
| `createdAt` / `updatedAt` | Date | Auto-managed timestamps |

---

### `management_staff`

Admin portal accounts for senior hotel staff.

| Field | Type | Description |
|-------|------|-------------|
| `fullName` | String | Full name — minimum two words (required) |
| `email` | String | Must end in `@lovendermgmt.com` (required, unique) |
| `password` | String | Hashed password, min 8 chars with number and special character |
| `phone` | String | 10-digit number starting with `0` (required) |
| `role` | String | `"Chief Manager"`, `"Manager"`, `"User support"`, or `"Receptionist"` (required) |
| `createdAt` / `updatedAt` | Date | Auto-managed timestamps |

> **Note:** Only one `Chief Manager` can exist at a time — enforced at schema level.

---

### `operation_staff`

Operational/field staff records managed by the admin.

| Field | Type | Description |
|-------|------|-------------|
| `fullName` | String | Full name — minimum two words (required) |
| `email` | String | Must end in `@lovenderstaff.com` (required, unique) |
| `phone` | String | 10-digit number starting with `0` (required) |
| `role` | String | `"Housekeeper"`, `"Maintenance"`, `"Guest Service"`, `"Groundskeeper"`, or `"Activities Coordinator"` (required) |
| `createdAt` / `updatedAt` | Date | Auto-managed timestamps |

---

### `contactpage_messages`

Messages submitted through the public contact form.

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Sender's name (required) |
| `email` | String | Sender's email (required, validated format) |
| `message` | String | Message body, 10–1000 characters (required) |
| `attachments` | [Object] | Up to 5 files; each has `filename`, `fileType`, `size`, and `url` |
| `status` | String | `"New"` or `"Closed"` (default: `"New"`) |
| `createdAt` / `updatedAt` | Date | Auto-managed timestamps |

> Allowed attachment types: `jpg`, `jpeg`, `png`, `pdf`, `doc`, `docx` (max 5MB each).

---

## 📡 API Documentation

Base URL: `https://resortlovender.onrender.com/api`  
All protected routes require a `Bearer <token>` in the `Authorization` header.

---

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | Public | Register a new guest account |
| `POST` | `/login` | Public | Login as a guest user |
| `POST` | `/management-login` | Public | Login as management staff |
| `POST` | `/forgot-password` | Public | Request a password reset email |
| `PUT` | `/reset-password` | Public | Reset password using a token |

**POST `/register`** — Request body:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securepass",
  "phone": "0501234567"
}
```

**POST `/login`** — Request body:
```json
{
  "email": "jane@example.com",
  "password": "securepass"
}
```

---

### Rooms — `/api/rooms`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | Public | Get all rooms |
| `GET` | `/:id` | Public | Get a single room by ID |
| `POST` | `/` | Admin (Chief Manager, Manager) | Create a new room |
| `PUT` | `/:id` | Admin (Chief Manager, Manager) | Update a room |
| `DELETE` | `/:id` | Admin (Chief Manager, Manager) | Delete a room |

---

### Bookings — `/api/bookings`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/availability` | Public | Check room availability by date range |
| `POST` | `/create` | User | Create a new booking |
| `GET` | `/my` | User | Get the logged-in user's bookings |
| `PUT` | `/:id/cancel` | User | Cancel a booking |
| `POST` | `/admin/create` | Admin (Chief Manager, Receptionist) | Create a booking for a guest |
| `GET` | `/all` | Admin (Chief Manager, Receptionist) | Get all bookings |
| `PUT` | `/admin/:id` | Admin (Chief Manager, Receptionist) | Update booking status |
| `DELETE` | `/admin/:id` | Admin (Chief Manager, Receptionist) | Delete a booking |

**GET `/availability`** — Query params:
```
?roomId=<id>&checkIn=2025-06-01&checkOut=2025-06-05
```

**POST `/create`** — Request body:
```json
{
  "room": "<roomId>",
  "checkIn": "2025-06-01",
  "checkOut": "2025-06-05",
  "adults": 2,
  "children": 0,
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "phone": "0501234567",
  "paymentMethod": "card",
  "totalPrice": 2600,
  "specialRequest": "High floor preferred"
}
```

---

### Admin Profile — `/api/admin`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/me` | Admin (all roles) | Get logged-in admin's profile |
| `PUT` | `/me` | Admin (all roles) | Update admin profile |
| `PUT` | `/me/password` | Admin (all roles) | Update admin password |
| `GET` | `/dashboard` | Admin (Chief Manager only) | Get dashboard statistics |

---

### Users — `/api/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | Admin (Chief Manager, User support) | Get all guest users |
| `POST` | `/` | Admin (Chief Manager, User support) | Create a guest user |
| `PUT` | `/:id` | Admin (Chief Manager, User support) | Update a guest user |
| `DELETE` | `/:id` | Admin (Chief Manager, User support) | Delete a guest user |

---

### Management Staff — `/api/management-staff`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | Admin (Chief Manager only) | Get all management staff |
| `GET` | `/:id` | Admin (Chief Manager only) | Get a staff member by ID |
| `POST` | `/` | Admin (Chief Manager only) | Add a new management staff member |
| `PUT` | `/:id` | Admin (Chief Manager only) | Update a management staff member |
| `DELETE` | `/:id` | Admin (Chief Manager only) | Delete a management staff member |

---

### Operation Staff — `/api/operation-staff`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | Admin (Chief Manager, Manager) | Get all operation staff |
| `GET` | `/:id` | Admin (Chief Manager, Manager) | Get an operation staff member by ID |
| `POST` | `/` | Admin (Chief Manager, Manager) | Add a new operation staff member |
| `PUT` | `/:id` | Admin (Chief Manager, Manager) | Update an operation staff member |
| `DELETE` | `/:id` | Admin (Chief Manager, Manager) | Delete an operation staff member |

---

### Contact Messages — `/api/contact-messages`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | Public | Submit a contact form message |
| `GET` | `/` | Admin (Chief Manager, User support) | Get all contact messages |
| `GET` | `/:id` | Admin (Chief Manager, User support) | Get a message by ID |
| `PUT` | `/:id` | Admin (Chief Manager, User support) | Update message status |
| `DELETE` | `/:id` | Admin (Chief Manager, User support) | Delete a message |

---

### AI Chat — `/api/chat`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | Public | Send a message to the AI concierge (Lova) |

**POST `/chat`** — Request body:
```json
{
  "message": "What rooms do you have available?",
  "history": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi! I'm Lova, how can I help?" }
  ]
}
```

---

### Health Check

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/health` | Public | Confirms the API is running |

---

## 🔐 Admin Role Permissions Summary

| Feature | Chief Manager | Manager | Receptionist | User support |
|---------|:---:|:---:|:---:|:---:|
| View dashboard stats | ✅ | ❌ | ❌ | ❌ |
| Manage rooms | ✅ | ✅ | ❌ | ❌ |
| Manage all bookings | ✅ | ❌ | ✅ | ❌ |
| Manage guest users | ✅ | ❌ | ❌ | ✅ |
| Manage management staff | ✅ | ❌ | ❌ | ❌ |
| Manage operation staff | ✅ | ✅ | ❌ | ❌ |
| View contact messages | ✅ | ❌ | ❌ | ✅ |
| View/update own profile | ✅ | ✅ | ✅ | ✅ |
