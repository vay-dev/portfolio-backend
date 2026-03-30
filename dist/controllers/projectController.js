"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDescription = exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectBySlug = exports.toggleProjectHidden = exports.getAllAdminProjects = exports.getAllProjects = exports.generateDescriptionsFromContext = void 0;
const projectService_1 = require("../services/projectService");
const aiService_1 = require("../services/aiService");
const response_1 = require("../lib/response");
const generateDescriptionsFromContext = async (req, res) => {
    const { title, aiContext, techStack, role, status, architectureNotes } = req.body;
    if (!aiContext || !title)
        return (0, response_1.fail)(res, "title and aiContext are required");
    const result = await (0, aiService_1.generateAllDescriptions)({ title, aiContext, techStack: techStack ?? [], role, status, architectureNotes });
    (0, response_1.ok)(res, result, "Descriptions generated");
};
exports.generateDescriptionsFromContext = generateDescriptionsFromContext;
const getAllProjects = async (_req, res) => {
    const projects = await projectService_1.projectService.getAll();
    (0, response_1.ok)(res, projects);
};
exports.getAllProjects = getAllProjects;
const getAllAdminProjects = async (_req, res) => {
    const projects = await projectService_1.projectService.getAllAdmin();
    (0, response_1.ok)(res, projects);
};
exports.getAllAdminProjects = getAllAdminProjects;
const toggleProjectHidden = async (req, res) => {
    const id = req.params["id"];
    const project = await projectService_1.projectService.getById(id);
    if (!project)
        return (0, response_1.fail)(res, "Project not found", 404);
    const { isHidden } = req.body;
    if (typeof isHidden !== "boolean")
        return (0, response_1.fail)(res, "isHidden must be a boolean", 400);
    const updated = await projectService_1.projectService.toggleHidden(id, isHidden);
    (0, response_1.ok)(res, updated, `Project ${isHidden ? "hidden" : "visible"}`);
};
exports.toggleProjectHidden = toggleProjectHidden;
const getProjectBySlug = async (req, res) => {
    const project = await projectService_1.projectService.getBySlug(req.params["slug"]);
    if (!project)
        return (0, response_1.fail)(res, "Project not found", 404);
    (0, response_1.ok)(res, project);
};
exports.getProjectBySlug = getProjectBySlug;
const createProject = async (req, res) => {
    const project = await projectService_1.projectService.create(req.body);
    (0, response_1.created)(res, project, "Project created");
};
exports.createProject = createProject;
const updateProject = async (req, res) => {
    const id = req.params["id"];
    const project = await projectService_1.projectService.getById(id);
    if (!project)
        return (0, response_1.fail)(res, "Project not found", 404);
    const updated = await projectService_1.projectService.update(id, req.body);
    (0, response_1.ok)(res, updated, "Project updated");
};
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    const id = req.params["id"];
    const project = await projectService_1.projectService.getById(id);
    if (!project)
        return (0, response_1.fail)(res, "Project not found", 404);
    await projectService_1.projectService.delete(id);
    (0, response_1.ok)(res, null, "Project deleted");
};
exports.deleteProject = deleteProject;
const generateDescription = async (req, res) => {
    const id = req.params["id"];
    const project = await projectService_1.projectService.getById(id);
    if (!project)
        return (0, response_1.fail)(res, "Project not found", 404);
    if (!project.aiContext)
        return (0, response_1.fail)(res, "Project has no aiContext — add it first");
    const fullDescription = await (0, aiService_1.generateProjectDescription)({
        title: project.title,
        aiContext: project.aiContext,
        techStack: project.techStack,
        features: project.features,
        role: project.role ?? undefined,
        status: project.status,
        architectureNotes: project.architectureNotes ?? undefined,
    });
    const updated = await projectService_1.projectService.saveGeneratedDescription(id, fullDescription);
    (0, response_1.ok)(res, { fullDescription: updated.fullDescription }, "Description generated");
};
exports.generateDescription = generateDescription;
