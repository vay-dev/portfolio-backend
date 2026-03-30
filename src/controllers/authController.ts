import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ok, fail } from "../lib/response";
import { adminUserService } from "../services/adminUserService";

const DEFAULT_ADMIN_EMAIL = "admin@vay.systems";

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    fail(res, "Email and password are required");
    return;
  }

  const adminUser = await adminUserService.getByEmail(email);
  if (!adminUser || !adminUser.isActive) {
    fail(res, "Invalid credentials", 401);
    return;
  }

  if (!bcrypt.compareSync(password, adminUser.passwordHash)) {
    fail(res, "Invalid credentials", 401);
    return;
  }

  const token = jwt.sign(
    {
      sub: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    },
  );

  ok(
    res,
    {
      token,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
      },
      defaultAdminEmail: process.env.ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL,
    },
    "Login successful",
  );
}
