import fs from "node:fs";
import path from "node:path";
import multer from "multer";

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

export const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 },
	fileFilter: (_req, file, cb) => {
		const allowed = ["image/jpeg", "image/png", "image/webp"];
		cb(null, allowed.includes(file.mimetype));
	},
});

export default upload;
