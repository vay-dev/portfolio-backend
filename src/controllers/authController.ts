import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ok, fail } from "../lib/response";

export function login(req: Request, res: Response): void {
  const { password } = req.body as { password?: string };

  if (!password) { fail(res, "Password required"); return; }

  const hash = process.env.ADMIN_PASSWORD_HASH as string;
  if (!bcrypt.compareSync(password, hash)) {
    fail(res, "Invalid credentials", 401);
    return;
  }

  const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  ok(res, { token }, "Login successful");
}
