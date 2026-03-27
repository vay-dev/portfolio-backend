import prisma from "../lib/prisma";
import { CreateProjectInput, UpdateProjectInput } from "../interfaces/project.interface";

export const projectService = {
  getAll(): Promise<CreateProjectInput[]> {
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

  saveGeneratedDescription(id: string, fullDescription: string) {
    return prisma.project.update({ where: { id }, data: { fullDescription } });
  },
};
