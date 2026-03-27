import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vay Portfolio API",
      version: "1.0.0",
      description: "Backend API for Vay's developer portfolio",
    },
    servers: [{ url: "http://localhost:5000" }],
    security: [{ bearerAuth: [] }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Project: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            slug: { type: "string", example: "pendu" },
            title: { type: "string", example: "Pendu" },
            shortDescription: { type: "string" },
            fullDescription: { type: "string", nullable: true },
            role: { type: "string", nullable: true, example: "Solo Developer" },
            status: { type: "string", example: "live" },
            techStack: { type: "array", items: { type: "string" } },
            features: { type: "array", items: { type: "string" } },
            architectureNotes: { type: "string", nullable: true },
            githubUrl: { type: "string", nullable: true },
            demoUrl: { type: "string", nullable: true },
            screenshots: { type: "array", items: { type: "string" } },
            aiContext: { type: "string", nullable: true },
            featured: { type: "boolean" },
            displayOrder: { type: "integer" },
            buyMeCoffeeUrl: { type: "string", nullable: true },
            partnerName: { type: "string", nullable: true },
            partnerGithubUrl: { type: "string", nullable: true },
            partnerPortfolioUrl: { type: "string", nullable: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CreateProjectInput: {
          type: "object",
          required: ["slug", "title", "shortDescription", "techStack"],
          properties: {
            slug: { type: "string", example: "pendu" },
            title: { type: "string", example: "Pendu" },
            shortDescription: { type: "string" },
            fullDescription: { type: "string" },
            role: { type: "string", example: "Solo Developer" },
            status: { type: "string", example: "live" },
            techStack: { type: "array", items: { type: "string" } },
            features: { type: "array", items: { type: "string" } },
            architectureNotes: { type: "string" },
            githubUrl: { type: "string" },
            demoUrl: { type: "string" },
            screenshots: { type: "array", items: { type: "string" } },
            aiContext: { type: "string" },
            featured: { type: "boolean" },
            displayOrder: { type: "integer" },
            buyMeCoffeeUrl: { type: "string" },
            partnerName: { type: "string" },
            partnerGithubUrl: { type: "string" },
            partnerPortfolioUrl: { type: "string" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
