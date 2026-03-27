import { Request, Response } from "express";
import { projectService } from "../services/projectService";
import { generateProjectDescription, generateAllDescriptions } from "../services/aiService";
import { ok, created, fail } from "../lib/response";

export const generateDescriptionsFromContext = async (req: Request, res: Response) => {
  const { title, aiContext, techStack, role, status, architectureNotes } = req.body;
  if (!aiContext || !title) return fail(res, "title and aiContext are required");
  const result = await generateAllDescriptions({ title, aiContext, techStack: techStack ?? [], role, status, architectureNotes });
  ok(res, result, "Descriptions generated");
};

export const getAllProjects = async (_req: Request, res: Response) => {
  const projects = await projectService.getAll();
  ok(res, projects);
};

export const getProjectBySlug = async (req: Request, res: Response) => {
  const project = await projectService.getBySlug(req.params["slug"] as string);
  if (!project) return fail(res, "Project not found", 404);
  ok(res, project);
};

export const createProject = async (req: Request, res: Response) => {
  const project = await projectService.create(req.body);
  created(res, project, "Project created");
};

export const updateProject = async (req: Request, res: Response) => {
  const id = req.params["id"] as string;
  const project = await projectService.getById(id);
  if (!project) return fail(res, "Project not found", 404);
  const updated = await projectService.update(id, req.body);
  ok(res, updated, "Project updated");
};

export const deleteProject = async (req: Request, res: Response) => {
  const id = req.params["id"] as string;
  const project = await projectService.getById(id);
  if (!project) return fail(res, "Project not found", 404);
  await projectService.delete(id);
  ok(res, null, "Project deleted");
};

export const generateDescription = async (req: Request, res: Response) => {
  const id = req.params["id"] as string;
  const project = await projectService.getById(id);
  if (!project) return fail(res, "Project not found", 404);
  if (!project.aiContext) return fail(res, "Project has no aiContext — add it first");

  const fullDescription = await generateProjectDescription({
    title: project.title,
    aiContext: project.aiContext,
    techStack: project.techStack,
    features: project.features,
    role: project.role ?? undefined,
    status: project.status,
    architectureNotes: project.architectureNotes ?? undefined,
  });

  const updated = await projectService.saveGeneratedDescription(id, fullDescription);
  ok(res, { fullDescription: updated.fullDescription }, "Description generated");
};
