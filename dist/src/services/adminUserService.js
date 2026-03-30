"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUserService = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const DEFAULT_ADMIN_EMAIL = "admin@vay.systems";
function normalizeEmail(email) {
    return email.trim().toLowerCase();
}
exports.adminUserService = {
    getByEmail(email) {
        return prisma_1.default.adminUser.findUnique({
            where: { email: normalizeEmail(email) },
        });
    },
    async ensureBootstrapAdmin() {
        const email = normalizeEmail(process.env.ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL);
        const passwordHash = process.env.ADMIN_PASSWORD_HASH;
        if (!passwordHash) {
            throw new Error("ADMIN_PASSWORD_HASH is required to bootstrap the admin user");
        }
        const existing = await prisma_1.default.adminUser.findUnique({ where: { email } });
        if (!existing) {
            await prisma_1.default.adminUser.create({
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
            await prisma_1.default.adminUser.update({
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
