import { Router } from "express";
import {
  getAllProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  generateDescription,
  generateDescriptionsFromContext,
} from "../controllers/projectController";
import { validateProject } from "../middlewares/validateProject";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of projects ordered by featured, displayOrder, createdAt
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 */
router.get("/", getAllProjects);

/**
 * @swagger
 * /api/projects/generate-descriptions:
 *   post:
 *     summary: AI-generate shortDescription + fullDescription from raw aiContext (no project ID needed)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, aiContext]
 *             properties:
 *               title:        { type: string }
 *               aiContext:    { type: string }
 *               techStack:    { type: array, items: { type: string } }
 *               role:         { type: string }
 *               status:       { type: string }
 *               architectureNotes: { type: string }
 *     responses:
 *       200:
 *         description: Generated short and full descriptions
 */
router.post("/generate-descriptions", requireAuth, generateDescriptionsFromContext);

/**
 * @swagger
 * /api/projects/{slug}:
 *   get:
 *     summary: Get a project by slug
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         example: pendu
 *     responses:
 *       200:
 *         description: Project found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:slug", getProjectBySlug);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProjectInput'
 *     responses:
 *       201:
 *         description: Project created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", requireAuth, validateProject, createProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProjectInput'
 *     responses:
 *       200:
 *         description: Project updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Project not found
 */
router.put("/:id", requireAuth, updateProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Project deleted
 *       404:
 *         description: Project not found
 */
router.delete("/:id", requireAuth, deleteProject);

/**
 * @swagger
 * /api/projects/{id}/generate-description:
 *   post:
 *     summary: AI-generate a deep fullDescription from aiContext
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Generated description saved to project
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fullDescription:
 *                   type: string
 *       400:
 *         description: No aiContext set on project
 *       404:
 *         description: Project not found
 */
router.post("/:id/generate-description", requireAuth, generateDescription);

export default router;
