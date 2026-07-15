import fs from "node:fs";
import path from "node:path";
import type { RequestHandler } from "express";
import type { Rows } from "../../../database/client";
import databaseClient from "../../../database/client";
import type {
	CreateVehicleInput,
	UpdateVehicleInput,
} from "./vehicleRepository";
import vehicleRepository from "./vehicleRepository";

const readbyUserId: RequestHandler = async (req, res, next) => {
	try {
		const repository = new vehicleRepository();
		const vehicles = await repository.readbyUserId(Number(req.params.id_user));
		res.json(vehicles);
	} catch (error) {
		next(error);
	}
};

const readbyImmat: RequestHandler = async (req, res, next) => {
	try {
		const repository = new vehicleRepository();
		const vehicles = await repository.readbyImmat(req.params.immat as string);
		res.json(vehicles);
	} catch (error) {
		next(error);
	}
};

const create: RequestHandler = async (req, res, next) => {
	try {
		const repository = new vehicleRepository();

		const data: CreateVehicleInput = {
			image: req.file ? req.file.filename : null,
			brand: req.body.brand,
			model: req.body.model,
			immat: req.body.immat,
			first_immat_date: req.body.first_immat_date
				? new Date(req.body.first_immat_date)
				: null,
			fuel_type: req.body.fuel_type || null,
			transmission_type: req.body.transmission_type || null,
			power: req.body.power ? Number(req.body.power) : null,
			mileage_km: req.body.mileage_km ? Number(req.body.mileage_km) : null,
			maintenance_interval_km: req.body.maintenance_interval_km
				? Number(req.body.maintenance_interval_km)
				: null,
			maintenance_interval_time: req.body.maintenance_interval_time
				? Number(req.body.maintenance_interval_time)
				: null,
			id_user: Number(req.body.id_user),
		};

		const result = await repository.create(data);
		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
};

const update: RequestHandler = async (req, res, next) => {
	try {
		const repository = new vehicleRepository();
		const id_vehicle = Number(req.params.id_vehicle);

		const [result] = await databaseClient.query<Rows>(
			"SELECT image FROM vehicles WHERE id_vehicle = ?",
			[id_vehicle],
		);
		const currentVehicle = result[0] as { image: string | null } | undefined;

		const data: UpdateVehicleInput = {
			id_vehicle: id_vehicle,
			image: req.file ? req.file.filename : currentVehicle?.image || null,
			brand: req.body.brand,
			model: req.body.model,
			immat: req.body.immat,
			first_immat_date: req.body.first_immat_date
				? new Date(req.body.first_immat_date)
				: null,
			fuel_type: req.body.fuel_type || null,
			transmission_type: req.body.transmission_type || null,
			power: req.body.power ? Number(req.body.power) : null,
			mileage_km: req.body.mileage_km ? Number(req.body.mileage_km) : null,
			maintenance_interval_km: req.body.maintenance_interval_km
				? Number(req.body.maintenance_interval_km)
				: null,
			maintenance_interval_time: req.body.maintenance_interval_time
				? Number(req.body.maintenance_interval_time)
				: null,
			id_user: Number(req.body.id_user),
		};

		if (req.file && currentVehicle?.image) {
			const oldImagePath = path.join(
				"public/uploads/vehicle",
				currentVehicle.image,
			);
			if (fs.existsSync(oldImagePath)) {
				fs.unlinkSync(oldImagePath);
			}
		}

		await repository.update(data);
		res.json({ message: "Updated successfully" });
	} catch (error) {
		next(error);
	}
};

const deleteVehicle: RequestHandler = async (req, res, next) => {
	try {
		const repository = new vehicleRepository();
		const id_vehicle = Number(req.params.id_vehicle);

		const [result] = await databaseClient.query<Rows>(
			"SELECT image FROM vehicles WHERE id_vehicle = ?",
			[id_vehicle],
		);
		const vehicle = result[0] as { image: string | null } | undefined;

		if (vehicle?.image) {
			const imagePath = path.join("public/uploads/vehicle", vehicle.image);
			if (fs.existsSync(imagePath)) {
				fs.unlinkSync(imagePath);
			}
		}

		await repository.delete(id_vehicle);
		res.json({ message: "Deleted successfully" });
	} catch (error) {
		next(error);
	}
};

export default { readbyUserId, readbyImmat, create, update, deleteVehicle };
