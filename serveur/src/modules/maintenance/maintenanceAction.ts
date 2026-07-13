import type { RequestHandler } from "express";
import type {
	CreateMaintenanceInput,
	UpdateMaintenanceInput,
} from "./maintenanceRepository";
import maintenanceRepository from "./maintenanceRepository";

const readbyVehicleId: RequestHandler = async (req, res, next) => {
	try {
		const repository = new maintenanceRepository();
		const maintenances = await repository.readbyVehicleId(
			Number(req.params.id_vehicle),
		);
		res.json(maintenances);
	} catch (error) {
		next(error);
	}
};

const create: RequestHandler = async (req, res, next) => {
	try {
		const repository = new maintenanceRepository();

		const data: CreateMaintenanceInput = {
			maintenance_date: new Date(req.body.maintenance_date),
			maintenance_km: Number(req.body.maintenance_km),
			id_vehicle: Number(req.body.id_vehicle),
		};

		const result = await repository.create(data);
		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
};

const update: RequestHandler = async (req, res, next) => {
	try {
		const repository = new maintenanceRepository();

		const data: UpdateMaintenanceInput = {
			id_maintenance: Number(req.params.id_maintenance),
			maintenance_date: new Date(req.body.maintenance_date),
			maintenance_km: Number(req.body.maintenance_km),
		};

		await repository.update(data);
		res.json({ message: "Updated successfully" });
	} catch (error) {
		next(error);
	}
};

const deleteMaintenance: RequestHandler = async (req, res, next) => {
	try {
		const repository = new maintenanceRepository();
		await repository.delete(Number(req.params.id_maintenance));
		res.json({ message: "Deleted successfully" });
	} catch (error) {
		next(error);
	}
};

export default { readbyVehicleId, create, update, deleteMaintenance };
