import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { chromium } from "playwright";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

// Store uploads in /uploads folder at project root
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("Only image files are allowed (jpg, png, webp, gif)"));
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
router.post(
  "/upload",
  requireAuth,
  upload.single("file"),
  (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    const baseUrl = process.env.SITE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const url = `${baseUrl}/uploads/${req.file.filename}`;
    res.json({ url, filename: req.file.filename });
  }
);

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
router.post("/screenshot", requireAuth, async (req: Request, res: Response) => {
  const { url, fullPage = false } = req.body as { url?: string; fullPage?: boolean };

  if (!url || !/^https?:\/\/.+/.test(url)) {
    res.status(400).json({ error: "A valid http/https URL is required" });
    return;
  }

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

    const filename = `screenshot-${Date.now()}-${Math.random().toString(36).slice(2)}.png`;
    const filepath = path.join(UPLOAD_DIR, filename);
    await page.screenshot({ path: filepath, fullPage: fullPage as boolean });

    const baseUrl = process.env.SITE_URL || `http://localhost:${process.env.PORT || 5000}`;
    res.json({ url: `${baseUrl}/uploads/${filename}`, filename });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Screenshot failed";
    res.status(500).json({ error: message });
  } finally {
    if (browser) await browser.close();
  }
});

// DELETE /api/media/:filename
router.delete("/:filename", requireAuth, (req: Request, res: Response) => {
  const filename = req.params["filename"] as string;
  // Basic path traversal guard
  if (filename.includes("..") || filename.includes("/")) {
    res.status(400).json({ error: "Invalid filename" });
    return;
  }
  const filepath = path.join(UPLOAD_DIR, filename);
  if (!fs.existsSync(filepath)) {
    res.status(404).json({ error: "File not found" });
    return;
  }
  fs.unlinkSync(filepath);
  res.status(204).send();
});

export default router;
