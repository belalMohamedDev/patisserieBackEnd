# 🍰 Patisserie Backend API

A robust Node.js + Express backend API for managing an Eastern and Western sweets shop. This comprehensive e-commerce platform provides full-stack functionality for product management, user authentication, order processing, and delivery services.

## ✨ Key Features

- 🔐 **Authentication & Authorization**: JWT-based authentication with access and refresh tokens
- 👥 **User Management**: Complete user registration, login, and profile management
- 🛍️ **Product Management**: Categories, subcategories, and product CRUD operations
- 🛒 **Shopping Cart**: Add, remove, and manage cart items
- ❤️ **Wishlist**: Save and manage favorite products
- 📦 **Order Management**: Complete order lifecycle from cart to delivery
- 🚚 **Driver Management**: Delivery driver registration and order assignment
- 💳 **Payment Integration**: Stripe payment processing
- 📧 **Email Notifications**: Nodemailer integration for order confirmations
- 🔔 **Push Notifications**: Firebase Cloud Messaging for real-time updates
- 🌍 **Localization**: Multi-language support (English & Arabic)
- 📱 **Mobile Optimized**: Responsive API design for mobile applications
- 🔍 **Search & Filtering**: Advanced product search and filtering capabilities
- ⭐ **Reviews & Ratings**: Product review and rating system
- 🎫 **Coupon System**: Discount coupon management
- 📍 **Address Management**: User and store address handling
- 🖼️ **Image Management**: Cloudinary integration for product images
- ⚡ **Caching**: Redis caching for improved performance
- 🛡️ **Security**: Rate limiting, XSS protection, and data sanitization

## 🛠️ Tech Stack

### Core Technologies

- **Node.js** (v20.14.0+) - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Redis** - In-memory caching and session storage

### Authentication & Security

- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **express-rate-limit** - Rate limiting protection
- **xss-clean** - XSS attack prevention
- **express-mongo-sanitize** - NoSQL injection protection

### External Services

- **Cloudinary** - Cloud image storage and optimization
- **Stripe** - Payment processing
- **Firebase Admin** - Push notifications
- **Nodemailer** - Email service
- **Sharp** - Image processing

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development server with auto-reload
- **Husky** - Git hooks

## 📁 Project Structure

```
elminiawy-patisserie/
├── 📁 config/                 # Configuration files
│   ├── database.js           # MongoDB connection
│   ├── redisConnection.js    # Redis client setup
│   └── cloudinaryConfig.js   # Cloudinary configuration
├── 📁 middleware/            # Custom middleware
│   └── errorMiddleware.js    # Global error handling
├── 📁 modules/              # Database models
│   ├── userModel.js         # User schema
│   ├── productModel.js      # Product schema
│   ├── orderModel.js        # Order schema
│   ├── cartModel.js         # Cart schema
│   └── ...                  # Other models
├── 📁 routes/               # API routes
│   ├── index.js             # Route mounting
│   ├── authRoute.js         # Authentication routes
│   ├── userRoute.js         # User management routes
│   ├── productRoute.js      # Product routes
│   ├── orderRoute.js        # Order routes
│   └── ...                  # Other route files
├── 📁 services/             # Business logic
├── 📁 utils/                # Utility functions
│   └── apiError/            # Error handling utilities
├── 📁 locales/              # Internationalization
│   ├── en.json              # English translations
│   └── ar.json              # Arabic translations
├── 📁 uploads/              # File uploads directory
├── 📄 index.js              # Application entry point
├── 📄 package.json          # Dependencies and scripts
├── 📄 config.env            # Environment variables
├── 📄 vercel.json           # Vercel deployment config
└── 📄 README.md             # This file
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v20.14.0 or higher)
- MongoDB database
- Redis server
- Cloudinary account
- Stripe account
- Firebase project

### 1. Clone the Repository

```bash
git clone <repository-url>
cd elminiawy-patisserie
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `config.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=8080
NODE_ENV=development
BASE_URL=http://localhost:8080

# Database
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/database_name

# JWT Configuration
JWT_ACCESS_TOKEN_SECRET_KEY=your-access-token-secret
JWT_REFRESH_TOKEN_SECRET_KEY=your-refresh-token-secret
JWT_EXPIER_ACCESS_TIME_TOKEN=15m
JWT_EXPIER_REFRESH_TIME_TOKEN=90d

# Email Configuration (Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Cloudinary Configuration
CLOUD_NAME=your-cloud-name
API_KEY=your-api-key
API_SECRET=your-api-secret

# Stripe Configuration
STRIPE_SECRET=your-stripe-secret-key

# Firebase Configuration
type=service_account
PROJECT_ID=your-project-id
private_key_id=your-private-key-id
PRIVATE_KEY=your-private-key
client_email=your-client-email
client_id=your-client-id
auth_uri=https://accounts.google.com/o/oauth2/auth
token_uri=https://oauth2.googleapis.com/token
auth_provider_x509_cert_url=https://www.googleapis.com/oauth2/v1/certs
client_x509_cert_url=your-cert-url

# Redis Configuration
REDIS_HOST=your-redis-host
REDIS_PORT=your-redis-port
REDIS_PASSWORD=your-redis-password

# Google API
GOOGLE_API_KEY=your-google-api-key
```

### 4. Run the Application

**Development Mode:**

```bash
npm run start:dev
```

**Production Mode:**

```bash
npm start
```

The server will start on `http://localhost:8080` (or the port specified in your environment variables).

## 🔐 API Authentication

This API uses JWT (JSON Web Tokens) for authentication:

### Authentication Flow

1. **Login/Register**: Users authenticate and receive access and refresh tokens
2. **Access Token**: Short-lived token (15 minutes) for API requests
3. **Refresh Token**: Long-lived token (90 days) to obtain new access tokens
4. **Protected Routes**: Include the access token in the Authorization header

### Usage Example

```javascript
// Include token in request headers
const headers = {
  Authorization: "Bearer YOUR_ACCESS_TOKEN",
  "Content-Type": "application/json",
};

// Make authenticated request
fetch("/v1/api/user/profile", {
  method: "GET",
  headers: headers,
});
```

### Token Refresh

When the access token expires, use the refresh token to get a new one:

```javascript
POST /v1/api/auth/refresh-token
{
  "refreshToken": "your-refresh-token"
}
```

## 🌍 Localization

The API supports multiple languages through the `i18n` package:

### Supported Languages

- **English (en)** - Default language
- **Arabic (ar)** - Right-to-left (RTL) support

### Usage

Set the language in request headers:

```javascript
// For English
headers: { 'lang': 'en' }

// For Arabic
headers: { 'lang': 'ar' }
```

### Language Files

- `locales/en.json` - English translations
- `locales/ar.json` - Arabic translations

## 🚀 Deployment

### Vercel Deployment

The project includes `vercel.json` configuration for easy deployment on Vercel:

1. **Install Vercel CLI:**

   ```bash
   npm i -g vercel
   ```

2. **Deploy:**

   ```bash
   vercel
   ```

3. **Set Environment Variables:**
   Configure all environment variables in your Vercel dashboard.

### Other Deployment Options

- **Heroku**: Use the `start` script in package.json
- **DigitalOcean**: Deploy using App Platform or Droplets
- **AWS**: Use Elastic Beanstalk or EC2 instances

### Environment Variables for Production

Ensure all environment variables are properly configured in your production environment, especially:

- Database connection strings
- JWT secrets
- External service API keys
- Redis connection details

## 📚 API Examples

### User Registration

```javascript
POST /v1/api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "phone": "+1234567890"
}
```

### Product Search

```javascript
GET /v1/api/product?search=cake&category=bakery&page=1&limit=10
```

### Create Order

```javascript
POST /v1/api/order
{
  "items": [
    {
      "productId": "product_id_here",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  },
  "paymentMethod": "stripe"
}
```

## 📞 Contact Information

### Developer Details

- **Email**: belalagwa01@gmail.com
- **Phone**: 01069225923
- **Project**: Patisserie Backend API

### Support

For technical support, feature requests, or bug reports, please contact the developer using the information above.

---


**Built with ❤️ for the Patisserie team**
