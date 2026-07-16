# DreamStay — Hotel Room Booking Application

A complete, production-ready full-stack hotel room booking application.

- **Frontend:** Angular 21 (standalone components, current stable/LTS release) + Tailwind CSS
- **Backend:** Spring Boot 3.2.5 (Java 17)
- **Database:** MySQL
- **Auth:** JWT-based authentication with role-based access control (User / Admin)

---

## Features

**Guests (Users)**
- Register / log in with JWT authentication
- Browse all rooms, filter by type
- Search rooms by check-in / check-out dates (only shows rooms with no overlapping bookings)
- View detailed room pages with amenities, capacity, pricing
- Book a room with automatic total-price calculation
- View and cancel their own bookings

**Admin**
- Everything above, plus:
- Create, edit, delete rooms
- View all bookings across all guests
- Update booking status (Pending / Confirmed / Cancelled / Completed)

**Backend safeguards**
- Prevents double-booking (checks for overlapping date ranges per room)
- Validates guest count against room capacity
- Role-based endpoint protection (Spring Security + JWT)
- Global exception handling with clean JSON error responses

---

## Project Structure

```
DreamStay/
├── backend/                # Spring Boot application
│   ├── pom.xml
│   └── src/main/java/com/dreamstay/
│       ├── config/         # Security & CORS configuration
│       ├── controller/     # REST controllers
│       ├── dto/            # Request/response DTOs
│       ├── entity/         # JPA entities
│       ├── exception/      # Global exception handling
│       ├── repository/     # Spring Data JPA repositories
│       ├── security/       # JWT filter, JWT util, UserDetails
│       └── service/        # Business logic
├── frontend/                # Angular 17 application
│   └── src/app/
│       ├── core/            # models, services, guards, interceptors
│       ├── shared/          # navbar, footer
│       └── features/        # home, auth, rooms, bookings, admin
└── database/
    └── schema_reference.sql # Reference SQL (auto-created by Hibernate)
```

---

## Prerequisites

- **Java 17+** and **Maven 3.8+**
- **Node.js 20.19+ or 22.12+** and **npm** (Angular 21 requirement)
- **MySQL 8+** running locally (or update the connection string)

> **Windows note:** if `npm install` fails with `EIDLETIMEOUT` or `EBUSY` errors, that's a network/antivirus issue, not a project issue. Try: close any editor/terminal with the folder open, run `npm cache clean --force`, then `npm install` again. If you're on a corporate network/VPN, `npm config set fetch-timeout 120000` before installing can help.

---

## 1. Database Setup

You don't need to run any SQL manually — Hibernate will create the schema automatically. Just make sure MySQL is running and you have a user with permission to create databases.

By default the backend connects to:
```
jdbc:mysql://localhost:3306/dreamstay_db
username: root
password: root
```

Update these in `backend/src/main/resources/application.properties` if your MySQL credentials differ.

---

## 2. Run the Backend

```bash
cd backend
mvn spring-boot:run
```

The API will start on **http://localhost:8080**.

On first run, Hibernate creates all tables and `data.sql` seeds:
- 8 sample rooms (Single, Double, Deluxe, Suite, Family)
- One admin account:
  - **Email:** `admin@dreamstay.com`
  - **Password:** `admin123`

### Key API Endpoints

| Method | Endpoint                          | Access        | Description                       |
|--------|------------------------------------|---------------|------------------------------------|
| POST   | `/api/auth/register`              | Public        | Register a new user               |
| POST   | `/api/auth/login`                 | Public        | Log in, returns JWT               |
| GET    | `/api/rooms`                      | Public        | List all rooms                    |
| GET    | `/api/rooms/search?checkIn&checkOut` | Public     | Search available rooms            |
| GET    | `/api/rooms/{id}`                 | Public        | Room details                      |
| POST   | `/api/rooms`                      | Admin         | Create a room                     |
| PUT    | `/api/rooms/{id}`                 | Admin         | Update a room                     |
| DELETE | `/api/rooms/{id}`                 | Admin         | Delete a room                     |
| POST   | `/api/bookings`                   | User          | Create a booking                  |
| GET    | `/api/bookings/my`                 | User          | Current user's bookings           |
| PUT    | `/api/bookings/{id}/cancel`       | User          | Cancel own booking                |
| GET    | `/api/bookings/admin/all`         | Admin         | All bookings                      |
| PUT    | `/api/bookings/admin/{id}/status` | Admin         | Update booking status             |

---

## 3. Run the Frontend

```bash
cd frontend
npm install
npm start
```

The app will start on **http://localhost:4200** and is already configured to call the backend at `http://localhost:8080/api` (see `src/environments/environment.ts`).

---

## 4. Try It Out

1. Open http://localhost:4200
2. Register a new account, or sign in as the seeded admin (`admin@dreamstay.com` / `admin123`)
3. Browse rooms, search by date, and book a stay
4. Sign in as admin to manage rooms and view/update all bookings

---

## Building for Production

**Backend:**
```bash
cd backend
mvn clean package
java -jar target/dreamstay-backend.jar
```

**Frontend:**
```bash
cd frontend
npm run build
# outputs to dist/dreamstay-frontend/browser — deploy behind any static host / nginx
```

For production, update `dreamstay.app.jwtSecret`, database credentials, and `dreamstay.app.corsAllowedOrigins` in `application.properties`, and point `src/environments/environment.prod.ts` at your production API URL.

---

## Tech Notes

- Passwords are hashed with BCrypt.
- JWT tokens are valid for 24 hours by default (`dreamstay.app.jwtExpirationMs`).
- Room availability search excludes rooms with any non-cancelled booking that overlaps the requested date range.
- The Angular app uses an `HttpInterceptor` to attach the JWT to every request and to log the user out automatically on a 401 response.
