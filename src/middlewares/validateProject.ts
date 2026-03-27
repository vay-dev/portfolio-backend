import { Request, Response, NextFunction } from "express";

export const validateProject = (req: Request, res: Response, next: NextFunction) => {
  const { slug, title, shortDescription, techStack } = req.body;

  if (!slug || !title || !shortDescription || !techStack?.length) {
    return res.status(400).json({
      success: false,
      message: "slug, title, shortDescription, and techStack are required",
      data: null,
    });
  }

  next();
};
