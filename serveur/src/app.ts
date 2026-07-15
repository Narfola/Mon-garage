import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import router from "./router";

const app = express();

if (process.env.CLIENT_URL != null) {
	app.use(cors({ origin: [process.env.CLIENT_URL] }));
}
app.use(express.json());
app.use(cookieParser());

app.use(router);
// import fs from "node:fs";
// import path from "node:path";
export default app;
