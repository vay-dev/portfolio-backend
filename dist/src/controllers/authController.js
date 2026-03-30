"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_1 = require("../lib/response");
const adminUserService_1 = require("../services/adminUserService");
const DEFAULT_ADMIN_EMAIL = "admin@vay.systems";
async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        (0, response_1.fail)(res, "Email and password are required");
        return;
    }
    const adminUser = await adminUserService_1.adminUserService.getByEmail(email);
    if (!adminUser || !adminUser.isActive) {
        (0, response_1.fail)(res, "Invalid credentials", 401);
        return;
    }
    if (!bcryptjs_1.default.compareSync(password, adminUser.passwordHash)) {
        (0, response_1.fail)(res, "Invalid credentials", 401);
        return;
    }
    const token = jsonwebtoken_1.default.sign({
        sub: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
    }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    (0, response_1.ok)(res, {
        token,
        user: {
            id: adminUser.id,
            email: adminUser.email,
            role: adminUser.role,
        },
        defaultAdminEmail: process.env.ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL,
    }, "Login successful");
}
