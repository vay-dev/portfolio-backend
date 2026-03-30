"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
exports.projectService = {
    // Public — hidden projects are excluded
    getAll() {
        return prisma_1.default.project.findMany({
            where: { isHidden: false },
            orderBy: [{ featured: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
        });
    },
    // Admin — returns all projects including hidden ones
    getAllAdmin() {
        return prisma_1.default.project.findMany({
            orderBy: [{ featured: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
        });
    },
    getBySlug(slug) {
        return prisma_1.default.project.findUnique({ where: { slug } });
    },
    getById(id) {
        return prisma_1.default.project.findUnique({ where: { id } });
    },
    create(data) {
        return prisma_1.default.project.create({ data });
    },
    update(id, data) {
        return prisma_1.default.project.update({ where: { id }, data });
    },
    delete(id) {
        return prisma_1.default.project.delete({ where: { id } });
    },
    toggleHidden(id, isHidden) {
        return prisma_1.default.project.update({ where: { id }, data: { isHidden } });
    },
    saveGeneratedDescription(id, fullDescription) {
        return prisma_1.default.project.update({ where: { id }, data: { fullDescription } });
    },
};
