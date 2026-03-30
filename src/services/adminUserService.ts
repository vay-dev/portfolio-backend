import prisma from "../lib/prisma";

const DEFAULT_ADMIN_EMAIL = "admin@vay.systems";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export const adminUserService = {
  getByEmail(email: string) {
    return prisma.adminUser.findUnique({
      where: { email: normalizeEmail(email) },
    });
  },

  async ensureBootstrapAdmin() {
    const email = normalizeEmail(process.env.ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL);
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!passwordHash) {
      throw new Error("ADMIN_PASSWORD_HASH is required to bootstrap the admin user");
    }

    const existing = await prisma.adminUser.findUnique({ where: { email } });

    if (!existing) {
      await prisma.adminUser.create({
        data: {
          email,
          passwordHash,
          role: "admin",
          isActive: true,
        },
      });
      return;
    }

    if (existing.passwordHash !== passwordHash || !existing.isActive || existing.role !== "admin") {
      await prisma.adminUser.update({
        where: { email },
        data: {
          passwordHash,
          role: "admin",
          isActive: true,
        },
      });
    }
  },
};
