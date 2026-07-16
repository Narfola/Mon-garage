import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import router from "./router";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
if (process.env.CLIENT_URL != null) {
	app.use(
		cors({
			origin: [process.env.CLIENT_URL],
			credentials: true,
		}),
	);
}
app.use(express.json());
app.use(cookieParser());
const uploadsFolderPath = path.join(__dirname, "../public/uploads");
if (fs.existsSync(uploadsFolderPath)) {
	app.use("/uploads", express.static(uploadsFolderPath));
}
app.use(router);
// import fs from "node:fs";
// import path from "node:path";
export default app;
