const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Elminiawy Patisserie API",
      version: "1.0.0",
      description: "Eastern and Western sweets shop RESTful API documentation",
      contact: {
        name: "API Support",
        email: "support@elminiawy-patisserie.com",
      },
      license: {
        name: "ISC",
        url: "https://opensource.org/licenses/ISC",
      },
    },
    servers: [
      {
        url: "https://elminiawy-patisserie.vercel.app",
        description: "Production server",
      },
      {
        url:
          process.env.NODE_ENV === "production"
            ? process.env.API_URL || "https://elminiawy-patisserie.vercel.app"
            : `http://localhost:${process.env.PORT || 8080}`,
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token in the format: Bearer <token>",
        },
      },
      schemas: {
        // Common schemas will be defined here
        Error: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "error",
            },
            message: {
              type: "string",
              example: "Error message",
            },
          },
        },
        Success: {
          type: "object",
          properties: {
            status: {
              type: "string",
              example: "success",
            },
            message: {
              type: "string",
              example: "Operation completed successfully",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./routes/*.js", "./routes/**/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
