import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
	throw new Error(
		"ERREUR : La variable d'environnement JWT_SECRET est manquante dans le fichier .env",
	);
}
interface AuthRequest extends Request {
	user?: {
		id_user: number;
		email: string;
	};
}

export const authenticateToken = (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
) => {
	const token = req.cookies.token;

	if (!token) {
		return res
			.status(401)
			.json({ message: "Accès refusé. Vous devez être connecté." });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET) as {
			id_user: number;
			email: string;
		};
		req.user = decoded;
		next();
	} catch (_error) {
		res.status(401).json({ message: "Token invalide ou expiré." });
	}
};
