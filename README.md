
# 🍰 Patisserie - Backend

A Node.js + Express backend for managing a sweets shop system. The platform supports product management, orders, user authentication, image uploads, notifications, and multilingual content.

---

## 🚀 Features

- 🧁 Product management with image upload & translation
- 🛒 Cart and order management
- 👤 User roles (Admin, Customer)
- 📦 Category & Subcategory structure
- 🌍 Multi-language support (Arabic & English)
- 📸 Image upload via Cloudinary
- 🔐 JWT authentication & route protection
- 📬 Firebase Push Notifications
- 📧 Nodemailer for email sending
- ⚡ Redis caching

---

## 🛠️ Tech Stack

| Layer         | Technology             |
|---------------|------------------------|
| Runtime       | Node.js                |
| Framework     | Express.js             |
| Database      | MongoDB + Mongoose     |
| Auth          | JWT                    |
| Caching       | Redis                  |
| Uploads       | Cloudinary + Sharp     |
| Notifications | Firebase Admin         |
| Email         | Nodemailer             |
| Localization  | i18n, mongoose-i18n-localize |

---

## 📁 Project Structure

```
elminiawy-patisserie/
├── config/         # Config files (DB, cloud, etc.)
├── middleware/     # Auth, error, i18n
├── modules/        # Business logic split by domain
├── routes/         # API routes
├── services/       # External services (email, push)
├── locales/        # Language files
├── utils/          # Helpers (validators, uploaders)
├── index.js        # Entry point
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/elminiawy-patisserie.git
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment file

```bash
cp .env.example .env
```

### 4. Start the server

```bash
npm start
```

---

## 🔐 Authentication

JWT tokens are used to authenticate users. Use the token returned on login in the `Authorization` header:

```http
Authorization: Bearer <token>
```

---

## 🌐 Localization

Supports Arabic and English using `i18n` and `mongoose-i18n-localize`. Add `?lang=ar` or `?lang=en` as a query parameter.

---

## 🚀 Deployment

- Ensure `.env` is properly configured.
- Install dependencies using `npm install`.
- Run the server with `npm start` or a process manager like **PM2** for production.

---

## 📞 Contact

**Developed by:** Belal Mohamed  
📧 Email: [belalagwa0@gmail.com](mailto:belalagwa0@gmail.com)  
📱 Phone: [+201069225923](tel:+201069225923)


---

## 🔧 Environment Variables

The following environment variables are required:

| Variable Name           | Description                               |
|-------------------------|-------------------------------------------|
| `PORT`                  | Port number the server will run on        |
| `MONGO_URI`             | MongoDB connection string                 |
| `JWT_SECRET`            | Secret key for JWT                        |
| `CLOUDINARY_CLOUD_NAME`| Cloudinary cloud name                     |
| `CLOUDINARY_API_KEY`   | Cloudinary API key                        |
| `CLOUDINARY_API_SECRET`| Cloudinary API secret                     |
| `REDIS_URL`             | Redis connection string                   |
| `FIREBASE_PRIVATE_KEY` | Firebase private key                      |
| `FIREBASE_CLIENT_EMAIL`| Firebase client email                     |
| `FIREBASE_PROJECT_ID`  | Firebase project ID                       |
| `EMAIL_USER`           | Email address used to send mails          |
| `EMAIL_PASS`           | Password for the email account            |

---

## 🔗 Example API Endpoints

Here are some key endpoints in the backend:

### Auth

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT

### Products

- `GET /api/products` - Get all products
- `POST /api/products` - Create a product (admin only)
- `GET /api/products/:id` - Get product by ID

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin only)

### Orders

- `GET /api/orders` - Get user orders
- `POST /api/orders` - Place a new order

### Cart

- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/:id` - Remove item from cart

### Notifications

- `POST /api/notifications/send` - Send push notification

> All protected routes require `Authorization: Bearer <token>` header.

---

