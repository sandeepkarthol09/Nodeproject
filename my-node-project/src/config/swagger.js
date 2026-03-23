const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My Node Project API",
      version: "1.0.0",
      description:
        "REST API documentation with authentication and user profile management",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: "Local",
      },
      {
        url: `http://192.168.1.25:${process.env.PORT}`,
        description: "Local",
      },
      {
        url: "https://my-node-project-blond.vercel.app",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "660f1e2b3c4e5f6a7b8c9d0e" },
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" },
            phone: { type: "string", example: "9876543210" },
            gender: {
              type: "string",
              enum: ["male", "female", "other"],
              example: "male",
            },
            roleId: { type: "string", example: "user" },
          },
        },
        Product: {
          type: "object",
          required: ["name", "description", "price", "stock"],
          properties: {
            _id: {
              type: "string",
              example: "65f123abc123",
            },
            name: {
              type: "string",
              example: "Nike Shoes",
            },
            description: {
              type: "string",
              example: "Running shoes",
            },
            price: {
              type: "number",
              minimum: 0,
              example: 2999,
            },
            stock: {
              type: "number",
              minimum: 0,
              example: 10,
            },
            category: {
              type: "string",
              example: "Footwear",
            },
            image: {
              type: "string",
              example: "https://example.com/image.jpg",
            },
            isActive: {
              type: "boolean",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Profile: {
          type: "object",
          properties: {
            _id: { type: "string", example: "660f1e2b3c4e5f6a7b8c9d0f" },
            userId: { type: "string", example: "660f1e2b3c4e5f6a7b8c9d0e" },
            bio: { type: "string", example: "Software Engineer" },
            avatar: {
              type: "string",
              example: "https://example.com/avatar.jpg",
            },
            age: { type: "number", example: 25 },
            address: {
              type: "object",
              properties: {
                street: { type: "string", example: "123 Main St" },
                city: { type: "string", example: "Lahore" },
                state: { type: "string", example: "Punjab" },
                country: { type: "string", example: "Pakistan" },
                zipCode: { type: "string", example: "54000" },
              },
            },
            socialLinks: {
              type: "object",
              properties: {
                twitter: {
                  type: "string",
                  example: "https://twitter.com/johndoe",
                },
                linkedin: {
                  type: "string",
                  example: "https://linkedin.com/in/johndoe",
                },
                github: {
                  type: "string",
                  example: "https://github.com/johndoe",
                },
                website: { type: "string", example: "https://johndoe.dev" },
              },
            },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password", "phone", "gender"],
          properties: {
            name: { type: "string", example: "John Doe" },
            email: { type: "string", example: "john@example.com" },
            password: { type: "string", example: "password123" },
            phone: { type: "string", example: "9876543210" },
            gender: {
              type: "string",
              enum: ["male", "female", "other"],
              example: "male",
            },
            roleId: { type: "string", example: "user" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "john@example.com" },
            password: { type: "string", example: "password123" },
          },
        },
        ProfileUpdateRequest: {
          type: "object",
          properties: {
            avatar: {
              type: "string",
              format: "binary",
              description: "Profile image file",
            },
            bio: { type: "string", example: "Full Stack Developer" },
            age: { type: "number", example: 25 },
            address: {
              type: "object",
              description: "Address as JSON object or JSON string",
              properties: {
                street: { type: "string" },
                city: { type: "string" },
                state: { type: "string" },
                country: { type: "string" },
                zipCode: { type: "string" },
              },
            },
            socialLinks: {
              type: "object",
              description: "Social links as JSON object or JSON string",
              properties: {
                twitter: { type: "string" },
                linkedin: { type: "string" },
                github: { type: "string" },
                website: { type: "string" },
              },
            },
          },
        },

        AuthResponse: {
          type: "object",
          properties: {
            user: { $ref: "#/components/schemas/User" },
            accessToken: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            refreshToken: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            status: { type: "integer", example: 400 },
            message: { type: "string", example: "Error message" },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
