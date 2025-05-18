# AppNation – Backend Engineer Case Study ☁️⚡

🌐 [Try It On Live Deployment](https://app-nation-case-study-backend-api-production.up.railway.app/)

##           Weather API Backend

This project is a backend application built with NestJS, Prisma, and Redis to demonstrate API integration, caching, and role-based access control.

---

## 🚀 Features

- 🔐 JWT-based authentication with `USER` and `ADMIN` roles
- ☁️ OpenWeather API integration to fetch live weather data
- ⚡ Redis caching via Upstash to reduce redundant API calls
- 🧾 Logging user queries to PostgreSQL via Prisma
- 🔐 Role-based route protection (e.g., only admins see all queries)
- 🧠 `adminKey` query param to allow admin-level user creation via Postman
- 📦 Modular, clean, and maintainable code structure

---

## 🛠️ Tech Stack

- NestJS (TypeScript)
- PostgreSQL (Railway)
- Prisma ORM
- Redis (Upstash)
- OpenWeather API
- JWT Auth

---

## 📂 Endpoints

| Method | URL                            | Access      | Description                      |
|--------|--------------------------------|-------------|----------------------------------|
| POST   | `/auth/register`               | Public      | Create USER                      |
| POST   | `/auth/register?adminkey=XYZ`  | Public+Key  | Create ADMIN (if key matches)    |
| POST   | `/auth/login`                  | Public      | Login and get JWT                |
| GET    | `/weather?city=London`         | User/Admin  | Get weather + cache + log        |
| GET    | `/weather/queries/me`          | User/Admin  | See your own weather queries     |
| GET    | `/weather/queries/all`         | Admin only  | See all users' queries           |
| GET    | `/users/all`                   | Admin only  | Dummy admin-only route           |

---

## 🧪 Testing via Postman

1. Register user:

```http
POST /auth/register
{
  "email": "user@example.com",
  "password": "123456"
}
```
2.	Register admin:
```
POST /auth/register?adminKey=eLeoVDtwPm5XbphiOM
```
3.	Login:
````
POST /auth/login
````
4.	Use token in header:
````
Authorization: Bearer <access_token>
`````

🔧 Setup Instructions
````
git clone https://github.com/yourusername/weather-api-case.git
cd weather-api-case
npm install
npm run start:dev
````

### 🧠 Caching Behavior

- TTL = 300 seconds (5 min)
- Caching is applied per `city` key
- Redis (Upstash) used as cloud cache store

---

### 📈 DB Logging (via Prisma)

- All weather requests are logged into `WeatherQuery` table
- Logged fields: `userId`, `city`, `createdAt`, and full `result`

---

### 📌 Notes

- Admins can register users via `/auth/register?adminkey=...`
- All weather routes require a valid JWT token
- Role-based guards (`USER`, `ADMIN`) protect sensitive endpoints
- Runs out of the box using `.env` + Postman

---

### 🙌 Author

Ahmet Emir Arslan  
[GitHub → @emirrcodes](https://github.com/emirrcodes)
