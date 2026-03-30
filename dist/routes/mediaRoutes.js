"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const playwright_1 = require("playwright");
const requireAuth_1 = require("../middlewares/requireAuth");
const router = (0, express_1.Router)();
// Store uploads in /uploads folder at project root
const UPLOAD_DIR = path_1.default.join(process.cwd(), "uploads");
if (!fs_1.default.existsSync(UPLOAD_DIR))
    fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
        cb(null, name);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (_req, file, cb) => {
        const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext))
            cb(null, true);
        else
            cb(new Error("Only image files are allowed (jpg, png, webp, gif)"));
    },
});
/**
 * @swagger
 * tags:
 *   name: Media
 *   description: File upload and management
 */
/**
 * @swagger
 * /api/media/upload:
 *   post:
 *     summary: Upload a single image file
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file (jpg, png, webp, gif — max 10MB)
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: http://localhost:5000/uploads/1234567890-abc123.png
 *                 filename:
 *                   type: string
 *                   example: 1234567890-abc123.png
 *       400:
 *         description: No file uploaded or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 */
// POST /api/media/upload  — single file
router.post("/upload", requireAuth_1.requireAuth, upload.single("file"), (req, res) => {
    if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
    }
    const baseUrl = process.env.SITE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const url = `${baseUrl}/uploads/${req.file.filename}`;
    res.json({ url, filename: req.file.filename });
});
/**
 * @swagger
 * /api/media/{filename}:
 *   delete:
 *     summary: Delete an uploaded file
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         example: 1234567890-abc123.png
 *     responses:
 *       204:
 *         description: File deleted
 *       400:
 *         description: Invalid filename
 *       404:
 *         description: File not found
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /api/media/screenshot:
 *   post:
 *     summary: Auto-screenshot a live URL (Playwright headless)
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [url]
 *             properties:
 *               url:
 *                 type: string
 *                 example: https://yourproject.com
 *               fullPage:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       200:
 *         description: Screenshot taken and saved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                 filename:
 *                   type: string
 *       400:
 *         description: Missing or invalid URL
 *       500:
 *         description: Screenshot failed
 */
// POST /api/media/screenshot
router.post("/screenshot", requireAuth_1.requireAuth, async (req, res) => {
    const { url, fullPage = false } = req.body;
    if (!url || !/^https?:\/\/.+/.test(url)) {
        res.status(400).json({ error: "A valid http/https URL is required" });
        return;
    }
    let browser;
    try {
        browser = await playwright_1.chromium.launch({ headless: true });
        const page = await browser.newPage();
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
        const filename = `screenshot-${Date.now()}-${Math.random().toString(36).slice(2)}.png`;
        const filepath = path_1.default.join(UPLOAD_DIR, filename);
        await page.screenshot({ path: filepath, fullPage: fullPage });
        const baseUrl = process.env.SITE_URL || `http://localhost:${process.env.PORT || 5000}`;
        res.json({ url: `${baseUrl}/uploads/${filename}`, filename });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Screenshot failed";
        res.status(500).json({ error: message });
    }
    finally {
        if (browser)
            await browser.close();
    }
});
// DELETE /api/media/:filename
router.delete("/:filename", requireAuth_1.requireAuth, (req, res) => {
    const filename = req.params["filename"];
    // Basic path traversal guard
    if (filename.includes("..") || filename.includes("/")) {
        res.status(400).json({ error: "Invalid filename" });
        return;
    }
    const filepath = path_1.default.join(UPLOAD_DIR, filename);
    if (!fs_1.default.existsSync(filepath)) {
        res.status(404).json({ error: "File not found" });
        return;
    }
    fs_1.default.unlinkSync(filepath);
    res.status(204).send();
});
exports.default = router;
