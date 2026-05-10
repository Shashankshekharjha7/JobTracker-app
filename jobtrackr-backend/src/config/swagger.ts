import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Tracker API",
      version: "1.0.0",
      description: "Track your job applications with stats and filters"
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" }
          }
        },
        Job: {
          type: "object",
          properties: {
            id: { type: "string" },
            company: { type: "string" },
            role: { type: "string" },
            status: { type: "string", enum: ["APPLIED","INTERVIEW","OFFER","REJECTED"] },
            location: { type: "string" },
            appliedAt: { type: "string", format: "date-time" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        CreateJobInput: {
          type: "object",
          required: ["company","role"],
          properties: {
            company: { type: "string" },
            role: { type: "string" },
            status: { type: "string", enum: ["APPLIED","INTERVIEW","OFFER","REJECTED"], default: "APPLIED" },
            location: { type: "string" }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./src/modules/**/*.ts"]
});
