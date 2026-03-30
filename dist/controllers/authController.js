"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_1 = require("../lib/response");
function login(req, res) {
    const { password } = req.body;
    if (!password) {
        (0, response_1.fail)(res, "Password required");
        return;
    }
    const hash = process.env.ADMIN_PASSWORD_HASH;
    if (!bcryptjs_1.default.compareSync(password, hash)) {
        (0, response_1.fail)(res, "Invalid credentials", 401);
        return;
    }
    const token = jsonwebtoken_1.default.sign({ role: "admin" }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    (0, response_1.ok)(res, { token }, "Login successful");
}
