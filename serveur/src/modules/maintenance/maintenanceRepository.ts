import databaseClient from "../../../database/client";

export type Maintenance = {
	id_maintenance: number;
	maintenance_date: Date;
	maintenance_km: number;
	id_vehicle: number;
};
export type CreateMaintenanceInput = Omit<Maintenance, "id_maintenance">;
export type UpdateMaintenanceInput = Pick<
	Maintenance,
	"id_maintenance" | "maintenance_date" | "maintenance_km"
>;
class maintenanceRepository {
	async readbyVehicleId(id_vehicle: number) {
		const [rows] = await databaseClient.query(
			"SELECT * FROM maintenances WHERE id_vehicle = ?",
			[id_vehicle],
		);
		return rows as Maintenance[];
	}
	async create(data: CreateMaintenanceInput) {
		const [result] = await databaseClient.query(
			`INSERT INTO maintenances (maintenance_date, maintenance_km, id_vehicle)
      VALUES (? , ? , ?)`,
			[data.maintenance_date, data.maintenance_km, data.id_vehicle],
		);
		return result;
	}
	async update(data: UpdateMaintenanceInput) {
		const query = `UPDATE maintenances SET maintenance_date = ?, maintenance_km = ? WHERE id_maintenance = ?`;
		await databaseClient.query(query, [
			data.maintenance_date,
			data.maintenance_km,
			data.id_maintenance,
		]);
		return true;
	}
	async delete(id_maintenance: number) {
		const query = "DELETE FROM maintenances WHERE id_maintenance = ?";
		await databaseClient.query(query, [id_maintenance]);
		return true;
	}
}

export default maintenanceRepository;
