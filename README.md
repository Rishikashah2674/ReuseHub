# ♻️ ReuseHub - Smart Waste Exchange Marketplace

ReuseHub is a smart waste management platform that connects **waste suppliers** and **buyers/seeker businesses** to promote recycling, reuse, and sustainable material exchange.

The platform allows suppliers to list their reusable waste materials and enables buyers to raise demands for required materials. An intelligent matching system automatically finds suitable suppliers based on category, material type, location, and quantity availability.

---

# 🌱 Features

## 👥 User Management

- User registration and authentication
- Secure login using JWT authentication
- Two types of users:
  - Supplier
  - Buyer / Seeker

- Profile management
- Role-based access control

---

# 🏭 Supplier Features

Suppliers can:

- Create waste listings
- Upload waste details
- Add:
  - Material name
  - Category
  - Description
  - Quantity
  - Unit
  - Price
  - Location
  - Contact details

- Manage their listings
- Update listings
- Delete listings
- View buyer demands
- Receive smart matches

---

# 🛒 Buyer Features

Buyers can:

- Browse available waste materials
- Search and filter listings
- Raise material demands
- Specify:
  - Required material
  - Category
  - Quantity
  - Location
  - Required date
  - Contact information

- View supplier matches
- Accept or reject matches

---

# 🤖 Smart Matching System

ReuseHub includes an intelligent matching algorithm that connects buyers with suitable suppliers.

Match score is calculated using:

| Criteria | Weight |
|----------|--------|
| Category Matching | 40% |
| Material Similarity | 25% |
| Location Matching | 20% |
| Quantity Availability | 15% |

Example:

Buyer Demand:

```
Material:
Craft Paper Scraps

Quantity:
150 kg

Location:
Ahmedabad
```

Supplier Listing:

```
Material:
Craft Paper Scraps

Quantity:
200 kg

Location:
Ahmedabad
```

Result:

```
Match Score: 100%

✓ Category matches
✓ Material matches
✓ Location matches
✓ Required quantity available

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Framer Motion
- Lucide React Icons

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## Tools

- Git & GitHub
- Postman
- VS Code

---

# 📂 Project Structure

```
ReuseHub
│
├── frontend
│   │
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── assets
│   │   └── App.jsx
│   │
│   └── package.json
│
│
├── backend
│   │
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── services
│   ├── middleware
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1. Clone Repository

```bash
git clone https://github.com/Rishikashah2674/ReuseHub.git
```

Move into project folder:

```bash
cd ReuseHub
```

---

# Backend Setup

Navigate to backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside backend folder:

```
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

Start backend server:

```bash
npm run dev
```

Backend will run on:

```
http://localhost:5000
```

---

# Frontend Setup

Open another terminal:

Navigate to frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start frontend:

```bash
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

# 🔐 Authentication Flow

1. User registers
2. Password is securely stored
3. User logs in
4. JWT token is generated
5. Token is stored in local storage
6. Protected routes become accessible

---

# 🔌 API Endpoints

## Authentication

### Register

```
POST /api/auth/register
```

### Login

```
POST /api/auth/login
```

---

# Waste Listings

### Create Listing

```
POST /api/listings
```

### Get All Listings

```
GET /api/listings
```

### Get My Listings

```
GET /api/listings/my
```

### Update Listing

```
PUT /api/listings/:id
```

### Delete Listing

```
DELETE /api/listings/:id
```

---

# Buyer Demands

### Create Demand

```
POST /api/demands
```

### Get All Demands

```
GET /api/demands
```

### Get My Demands

```
GET /api/demands/my
```

### Update Demand

```
PUT /api/demands/:id
```

### Delete Demand

```
DELETE /api/demands/:id
```

---

# Smart Matching APIs

### Generate Matches

```
POST /api/matches/generate
```

### Get User Matches

```
GET /api/matches/my
```

### Update Match Status

```
PUT /api/matches/:id/status
```

---

# 🗃️ Database Models

## User Model

Stores:

- Business details
- Owner information
- Account type
- Authentication details


## Waste Listing Model

Stores:

- Waste material details
- Supplier information
- Quantity
- Location
- Availability


## Demand Model

Stores:

- Required material
- Buyer information
- Quantity needed
- Required date


## Match Model

Stores:

- Buyer
- Supplier
- Demand
- Listing
- Match score
- Match reasons
- Status

---

# 🌍 Future Enhancements

Planned improvements:

- AI-based advanced material similarity
- Image-based waste classification
- Real-time chat between buyer and supplier
- Payment integration
- Pickup scheduling
- Google Maps location integration
- Notification system
- Analytics dashboard improvements

---

# 🤝 Contribution

Contributions are welcome.

Steps:

1. Fork the repository

2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added new feature"
```

4. Push changes

```bash
git push origin feature-name
```

5. Create a Pull Request

---

# 📄 License

This project is developed for educational and sustainability purposes.

---

# 👩‍💻 Developed By

**Rishika Shah**

ReuseHub - Connecting Waste With Opportunity ♻️
