import prisma from "../lib/prisma";
import { CreateProjectInput, UpdateProjectInput } from "../interfaces/project.interface";

export const projectService = {
  // Public — hidden projects are excluded
  getAll(): Promise<CreateProjectInput[]> {
    return prisma.project.findMany({
      where: { isHidden: false },
      orderBy: [{ featured: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
    }) as Promise<any>;
  },

  // Admin — returns all projects including hidden ones
  getAllAdmin(): Promise<CreateProjectInput[]> {
    return prisma.project.findMany({
      orderBy: [{ featured: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
    }) as Promise<any>;
  },

  getBySlug(slug: string) {
    return prisma.project.findUnique({ where: { slug } });
  },

  getById(id: string) {
    return prisma.project.findUnique({ where: { id } });
  },

  create(data: CreateProjectInput) {
    return prisma.project.create({ data });
  },

  update(id: string, data: UpdateProjectInput) {
    return prisma.project.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.project.delete({ where: { id } });
  },

  toggleHidden(id: string, isHidden: boolean) {
    return prisma.project.update({ where: { id }, data: { isHidden } });
  },

  saveGeneratedDescription(id: string, fullDescription: string) {
    return prisma.project.update({ where: { id }, data: { fullDescription } });
  },
};
