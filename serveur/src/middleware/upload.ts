import fs from "node:fs";
import path from "node:path";
import type { Request } from "express";
import multer from "multer";

export interface MulterRequest extends Request {
	file?: Express.Multer.File;
}

const uploadsDir = path.join(__dirname, "../../public/uploads/vehicle");

if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, uploadsDir);
	},
	filename: (_req, file, cb) => {
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
	},
});

const fileFilter = (
	_req: Request,
	file: Express.Multer.File,
	cb: multer.FileFilterCallback,
) => {
	const allowed = ["image/jpeg", "image/png", "image/webp"];
	if (allowed.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(
			new Error(
				"Type de fichier non autorisé. Seuls les JPEG, PNG et WebP sont acceptés.",
			),
		);
	}
};

export const upload = multer({
	storage,
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
	fileFilter,
});

export default upload;
