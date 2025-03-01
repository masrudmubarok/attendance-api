import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Attendance API",
      description: "API documentation for Employees Attendance System",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Local server",
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
          },
        },
        Attendance: {
          type: "object",
          properties: {
            userId: {
              type: "string",
              example: "64a7b2f6d1f10c1234567890",
            },
            clockInTime: {
              type: "string",
              format: "date-time",
              example: "2024-03-01T08:00:00Z",
            },
            clockOutTime: {
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