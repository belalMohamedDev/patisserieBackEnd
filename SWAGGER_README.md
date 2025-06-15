# Swagger API Documentation

This project includes comprehensive Swagger/OpenAPI 3.0 documentation for the Elminiawy Patisserie RESTful API.

## 🚀 Quick Start

### Accessing the Documentation

1. Start the development server:

   ```bash
   npm run start:dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:8080/api-docs
   ```

### Production Access

In production, the Swagger UI will be available at:

```
https://your-production-domain.com/api-docs
```

## 📋 Features

### ✅ What's Included

- **Complete API Documentation**: All endpoints are documented with detailed descriptions
- **Interactive Testing**: Test API endpoints directly from the Swagger UI
- **Authentication Support**: JWT Bearer token authentication
- **Request/Response Examples**: Detailed schemas for all data models
- **Error Handling**: Comprehensive error response documentation
- **File Upload Support**: Documentation for multipart/form-data endpoints
- **Pagination Support**: Query parameters for paginated endpoints

### 🏷️ Available API Tags

1. **Authentication** - User registration, login, password reset
2. **Users** - User management (profile, admin operations)
3. **Products** - Product management with options and customization
4. **Orders** - Order management and status updates
5. **Categories** - Product category management
6. **Reviews** - Product review system
7. **Cart** - Shopping cart operations
8. **Wishlist** - User wishlist management
9. **Coupons** - Discount coupon system
10. **Banners** - Promotional banner management
11. **Addresses** - User address management
12. **Notifications** - User notification system
13. **Drivers** - Delivery driver management

## 🔧 Configuration

### Swagger Setup Files

- **`swagger.js`** - Main Swagger configuration
- **`index.js`** - Express app with Swagger UI integration
- **Route files** - Individual route documentation with JSDoc comments

### Environment Variables

The Swagger configuration automatically detects the environment:

- **Development**: `http://localhost:8080` (or PORT from environment)
- **Production**: Uses `API_URL` environment variable or defaults to production domain

## 📝 Adding New Endpoints

### 1. Add JSDoc Comments to Route Files

```javascript
/**
 * @swagger
 * /v1/api/your-endpoint:
 *   get:
 *     summary: Brief description of what the endpoint does
 *     tags: [YourTag]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Description of the parameter
 *     responses:
 *       200:
 *         description: Success response description
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/YourSchema'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
```

### 2. Define Schemas (if needed)

```javascript
/**
 * @swagger
 * components:
 *   schemas:
 *     YourSchema:
 *       type: object
 *       required:
 *         - requiredField
 *       properties:
 *         requiredField:
 *           type: string
 *           description: Description of the field
 *         optionalField:
 *           type: number
 *           description: Optional field description
 */
```

### 3. Add Tags (if new category)

```javascript
/**
 * @swagger
 * tags:
 *   name: YourTag
 *   description: Description of this API category
 */
```

## 🔐 Authentication

### JWT Bearer Token

Most endpoints require authentication using JWT Bearer tokens:

1. **Login** using `/v1/api/auth/login` or `/v1/api/auth/signUp`
2. **Copy the token** from the response
3. **Click "Authorize"** in the Swagger UI
4. **Enter**: `Bearer YOUR_TOKEN_HERE`
5. **Click "Authorize"**

### Public Endpoints

Some endpoints don't require authentication:

- User registration
- User login
- Password reset
- Public product listings

## 📊 Response Formats

### Success Response

```json
{
  "status": "success",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Error description"
}
```

### Paginated Response

```json
{
  "status": "success",
  "results": 25,
  "paginationResult": {
    "currentPage": 1,
    "numberOfPages": 3,
    "limit": 10
  },
  "data": [
    // Array of items
  ]
}
```

## 🛠️ Development

### Testing Endpoints

1. **Use the Swagger UI**: Test endpoints directly in the browser
2. **Copy cURL**: Generate cURL commands for external testing
3. **Download OpenAPI Spec**: Export the complete API specification

### Common Query Parameters

- `page` - Page number for pagination (default: 1)
- `limit` - Items per page (default: 10)
- `sort` - Sort field (e.g., "price", "createdAt")
- `category` - Filter by category ID
- `role` - Filter by user role

### File Upload Endpoints

For endpoints that accept file uploads:

1. Use the file input in Swagger UI
2. Files are automatically uploaded to Cloudinary
3. Image resizing is handled automatically

## 🚨 Troubleshooting

### Common Issues

1. **Swagger UI not loading**

   - Check if the server is running
   - Verify the `/api-docs` endpoint is accessible
   - Check browser console for errors

2. **Authentication not working**

   - Ensure you're using the correct token format: `Bearer TOKEN`
   - Check if the token is expired
   - Verify the user has the required permissions

3. **Missing endpoints**
   - Check if JSDoc comments are properly formatted
   - Verify the route file is being scanned by swagger-jsdoc
   - Restart the server after adding new documentation

### Debug Mode

To debug Swagger configuration:

```javascript
// Add to your route file temporarily
console.log("Swagger paths:", Object.keys(swaggerSpecs.paths));
```

## 📚 Additional Resources

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger JSDoc Documentation](https://github.com/Surnet/swagger-jsdoc)
- [Swagger UI Express Documentation](https://github.com/scottie1984/swagger-ui-express)

## 🤝 Contributing

When adding new endpoints:

1. **Follow the existing JSDoc format**
2. **Include comprehensive parameter descriptions**
3. **Document all possible response codes**
4. **Add appropriate security requirements**
5. **Test the documentation in Swagger UI**

---

**Happy API Documentation! 🎉**
