import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Attendance API",
      description: "API documentation for User Attendance System",
    },
    tags: [
        {
          name: "Authentication",
          description: "User authentication endpoints",
        },
        {
          name: "Attendance",
          description: "User attendance endpoints",
        },
        {
          name: "User",
          description: "User data endpoints",
        },
      ],
    servers: [
      {
        url: process.env.APP_ENV === 'prod' && process.env.SERVER
          ? process.env.SERVER
          : `http://localhost:${process.env.PORT || 3001}/`,
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
            id: {
              type: "integer",
              format: "int64",
              example: 1,
              description: "Auto-increment user ID",
            },
            email: {
              type: "string",
              example: "user@example.com",
            },
            password: {
              type: "string",
              example: "password123",
            },
            name: {
              type: "string",
              example: "John Doe",
            },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2025-03-01T12:00:00Z",
              description: "Timestamp when the user was created, defaults to NOW()",
            },
          },
        },
        Attendance: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              format: "int64",
              example: 1001,
              description: "Auto-increment attendance ID",
            },
            user_id: {
              type: "integer",
              format: "int64",
              example: 1,
              description: "Reference to the user ID",
            },
            clock_in: {
              type: "string",
              format: "date-time",
              example: "2024-03-01T08:00:00Z",
            },
            clock_out: {
              type: "string",
              format: "date-time",
              example: "2024-03-01T17:00:00Z",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(options);
export default swaggerDocs;