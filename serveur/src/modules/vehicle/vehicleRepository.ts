import databaseClient from "../../../database/client";

export type Vehicle = {
	id_vehicle: number;
	image: string | null;
	brand: string;
	model: string;
	immat: string;
	first_immat_date: Date | null;
	fuel_type: string | null;
	transmission_type: string | null;
	power: number | null;
	mileage_km: number | null;
	maintenance_interval_km: number | null;
	maintenance_interval_time: number | null;
	id_user: number;
};

export type CreateVehicleInput = Omit<Vehicle, "id_vehicle">;

export type UpdateVehicleInput = Pick<
	Vehicle,
	| "id_vehicle"
	| "image"
	| "brand"
	| "model"
	| "immat"
	| "first_immat_date"
	| "fuel_type"
	| "transmission_type"
	| "power"
	| "mileage_km"
	| "maintenance_interval_km"
	| "maintenance_interval_time"
	| "id_user"
>;

class vehicleRepository {
	async readbyUserId(id_user: number) {
		const [rows] = await databaseClient.query(
			"SELECT * FROM vehicles WHERE id_user = ?",
			[id_user],
		);
		return rows as Vehicle[];
	}

	async readbyImmat(immat: string) {
		const [rows] = await databaseClient.query(
			"SELECT * FROM vehicles WHERE immat = ?",
			[immat],
		);
		return rows as Vehicle[];
	}

	async create(data: CreateVehicleInput) {
		const query = `
			INSERT INTO vehicles (
				image, brand, model, immat, first_immat_date, 
				fuel_type, transmission_type, power, mileage_km, 
				maintenance_interval_km, maintenance_interval_time, id_user
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`;
		const [result] = await databaseClient.query(query, [
			data.image,
			data.brand,
			data.model,
			data.immat,
			data.first_immat_date,
			data.fuel_type,
			data.transmission_type,
			data.power,
			data.mileage_km,
			data.maintenance_interval_km,
			data.maintenance_interval_time,
			data.id_user,
		]);
		return result;
	}

	async update(data: UpdateVehicleInput) {
		const imagePath = data.image ? `/uploads/vehicle/${data.image}` : null;
		const query = `
			UPDATE vehicles SET 
				image = ?, brand = ?, model = ?, immat = ?, 
				first_immat_date = ?, fuel_type = ?, transmission_type = ?, 
				power = ?, mileage_km = ?, maintenance_interval_km = ?, 
				maintenance_interval_time = ?, id_user = ?
			WHERE id_vehicle = ?`;

		await databaseClient.query(query, [
			imagePath,
			data.brand,
			data.model,
			data.immat,
			data.first_immat_date,
			data.fuel_type,
			data.transmission_type,
			data.power,
			data.mileage_km,
			data.maintenance_interval_km,
			data.maintenance_interval_time,
			data.id_user,
			data.id_vehicle,
		]);
		return true;
	}

	async delete(id_vehicle: number) {
		const query = "DELETE FROM vehicles WHERE id_vehicle = ?";
		await databaseClient.query(query, [id_vehicle]);
		return true;
	}
}

export default vehicleRepository;
