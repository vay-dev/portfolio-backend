import { Response } from "express";

export function ok<T>(res: Response, data: T, message = "Success") {
  res.json({ success: true, message, data });
}

export function created<T>(res: Response, data: T, message = "Created") {
  res.status(201).json({ success: true, message, data });
}

export function fail(res: Response, message: string, status = 400) {
  res.status(status).json({ success: false, message, data: null });
}
