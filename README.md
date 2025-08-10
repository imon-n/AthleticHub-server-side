
---

# AthleticHub Server

This is the backend server for **AthleticHub**, a platform to manage athletic events and bookings. It uses **Node.js**, **Express**, **Firebase Admin SDK** for authentication, and **MongoDB** for data storage.

---

## Features

* Event management (CRUD operations)
* Booking system with duplicate booking prevention
* Firebase token verification for secure API access
* RESTful API design with CORS enabled

---

## Technologies Used

* Node.js
* Express.js
* Firebase Admin SDK
* MongoDB (MongoDB Atlas)
* dotenv for environment variables
* cors middleware

---

## Getting Started

### Prerequisites

* Node.js installed
* MongoDB Atlas cluster or local MongoDB instance
* Firebase service account key (JSON file)
* `.env` file configured

---

### Installation

1. Clone the repository:

```bash
git clone https://github.com/imon-n/AthleticHub-server-side.git
cd AthleticHub-server-side
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:

```env
PORT=3000
DB_USER=yourMongoDBUsername
DB_PASS=yourMongoDBPassword
```

4. Add your Firebase service account key JSON file as `firebase-adminsdk-key.json` in the root directory.

---

### Environment Variables

| Variable | Description                |
| -------- | -------------------------- |
| PORT     | Port number for the server |
| DB_USER | MongoDB database username  |
| DB_PASS | MongoDB database password  |

---

### Running the Server

Start the server with:

```bash
npm start
```

The server will start on the specified `PORT` (default 3000).

---

## API Endpoints

### Events

* `GET /events` - Get all events, supports filtering by email and search query.
* `GET /events/:id` - Get a specific event by ID.
* `POST /events` - Create a new event.
* `PUT /events/:id` - Update an existing event.
* `DELETE /events/:id` - Delete an event.

### Bookings

* `GET /bookings?email=your_email` - Get bookings for a user (requires Firebase auth token).
* `POST /bookings` - Create a new booking.
* `DELETE /bookings/:id` - Delete a booking.

---

## Firebase Authentication

Use Firebase ID tokens in the `Authorization` header as a Bearer token to access protected endpoints, e.g.,

```
Authorization: Bearer <firebase_id_token>
```

---

## Notes

* Make sure to keep your Firebase service account JSON file and `.env` file out of version control.
* Add them to your `.gitignore` file.

---


If you want, I can help you generate a more detailed README with examples of requests and responses! Would you like that?
