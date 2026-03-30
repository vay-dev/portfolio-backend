"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProject = void 0;
const validateProject = (req, res, next) => {
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
exports.validateProject = validateProject;
