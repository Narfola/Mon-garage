import type { ResultSetHeader } from "mysql2";
import type { Rows } from "../../../database/client";
import databaseClient from "../../../database/client";

type user = {
	id_user: number;
	email: string;
	password: string;
};

class userRepository {
	async readAll() {
		const [rows] = await databaseClient.query<Rows>("SELECT * FROM users");
		return rows as user[];
	}

	async readByEmail(email: string) {
		const [rows] = await databaseClient.query(
			"SELECT * FROM users WHERE email = ?",
			[email],
		);
		return (rows as user[])[0];
	}

	async create(user: { email: string; password: string }) {
		const [result] = await databaseClient.query<ResultSetHeader>(
			`INSERT INTO users (email, password)
      VALUES (? , ? )`,
			[user.email, user.password],
		);
		return result;
	}
	async delete(id: number) {
		const query = "DELETE FROM users WHERE id_user = ?";
		await databaseClient.query(query, [id]);
		return true;
	}
}
export default userRepository;
