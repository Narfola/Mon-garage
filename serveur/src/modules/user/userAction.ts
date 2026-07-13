import "dotenv/config";
import argon2 from "argon2";
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

import { emailRegex, passwordRegex } from "../../utils/validation";
import userRepository from "./userRepository";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
	throw new Error(
		"ERREUR : La variable d'environnement JWT_SECRET est manquante dans le fichier .env",
	);
}
const browse: RequestHandler = async (_req, res, next) => {
	try {
		const repository = new userRepository();
		const users = await repository.readAll();
		res.json(users);
	} catch (error) {
		next(error);
	}
};

const register: RequestHandler = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		if (!emailRegex.test(email)) {
			return res.status(400).json({ message: "Format d'email invalide" });
		}
		if (!passwordRegex.test(password)) {
			return res.status(400).json({
				message:
					"Mot de passe trop faible (doit contenir majuscule, minuscule, chiffre et caractère spécial, min 8 caractères)",
			});
		}

		const repository = new userRepository();

		const existingUser = await repository.readByEmail(email);
		if (existingUser) {
			return res.status(400).json({ message: "Cet email est déjà utilisé" });
		}

		const hashedPassword = await argon2.hash(password);

		await repository.create({
			email,
			password: hashedPassword,
		});

		res.status(201).json({ message: "Utilisateur créé avec succès" });
	} catch (error) {
		next(error);
	}
};

const login: RequestHandler = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		const repository = new userRepository();
		const user = await repository.readByEmail(email);

		if (!user) {
			return res
				.status(401)
				.json({ message: "Email ou mot de passe incorrect" });
		}

		const isPasswordValid = await argon2.verify(user.password, password);
		if (!isPasswordValid) {
			return res
				.status(401)
				.json({ message: "Email ou mot de passe incorrect" });
		}

		const token = jwt.sign(
			{ id_user: user.id_user, email: user.email },
			JWT_SECRET,
			{ expiresIn: "24h" },
		);

		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 24 * 60 * 60 * 1000,
		});

		res.json({ message: "Connexion réussie", user: { email: user.email } });
	} catch (error) {
		next(error);
	}
};

const deleteUser: RequestHandler = async (req, res, next) => {
	try {
		const repository = new userRepository();
		await repository.delete(Number(req.params.id_user));
		res.json({ message: "Utilisateur supprimé" });
	} catch (error) {
		next(error);
	}
};

export default { browse, register, login, deleteUser };
