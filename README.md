# 🍰 Elminiawy Patisserie - Backend

A Node.js + Express backend for managing a sweets shop system. The platform supports product management, orders, user authentication, image uploads, notifications, and multilingual content.

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

| Layer         | Technology                   |
| ------------- | ---------------------------- |
| Runtime       | Node.js                      |
| Framework     | Express.js                   |
| Database      | MongoDB + Mongoose           |
| Auth          | JWT                          |
| Caching       | Redis                        |
| Uploads       | Cloudinary + Sharp           |
| Notifications | Firebase Admin               |
| Email         | Nodemailer                   |
| Localization  | i18n, mongoose-i18n-localize |

---

## 📁 Project Structure

````
elminiawy-patisserie/
├── config/ # Config files (DB, cloud, etc.)
├── middleware/ # Auth, error, i18n
├── modules/ # Business logic split by domain
├── routes/ # API routes
├── services/ # External services (email, push)
├── locales/ # Language files
├── utils/ # Helpers (validators, uploaders)
├── index.js # Entry point



---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/elminiawy-patisserie.git
cd backend
````

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

### 5. Authentication

JWT tokens are used to authenticate users. Use the token returned on login in the Authorization header:

```
Authorization: Bearer <token>
```

### 6. Localization

Supports Arabic and English using i18n and mongoose-i18n-localize. Add lang=ar or lang=en as query parameter.

### 7. Deployment

Make sure .env is configured

Install using npm install

Use npm run start or a process manager like PM2

### 8. Contact

Developed by [Belal Mohamed]
Email: [belalagwa0@gmail.com]
phone: [+201069225923]
