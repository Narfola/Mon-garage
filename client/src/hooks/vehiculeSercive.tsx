const API_URL = import.meta.env.VITE_API_URL;

export interface VehicleType {
	id_vehicle?: number;
	image?: string | null;
	brand: string;
	model: string;
	immat: string;
	first_immat_date: string | null;
	fuel_type: string | null;
	transmission_type: string | null;
	power: number | null;
	mileage_km: number | null;
	maintenance_interval_km: number | null;
	maintenance_interval_time: number | null;
	id_user?: number;
}

export const vehicleService = {
	getVehiclesByUserId: async (id_user: number): Promise<VehicleType[]> => {
		const response = await fetch(`${API_URL}/vehicles/user/${id_user}`, {
			credentials: "include",
		});
		if (!response.ok)
			throw new Error("Erreur lors de la récupération des véhicules");
		return response.json();
	},

	getVehicleByImmat: async (immat: string): Promise<VehicleType> => {
		const response = await fetch(`${API_URL}/vehicles/immat/${immat}`, {
			credentials: "include",
		});
		if (!response.ok)
			throw new Error("Erreur lors de la récupération du véhicule");
		return response.json();
	},

	createVehicle: async (
		data: VehicleType,
		imageFile?: File,
	): Promise<VehicleType> => {
		const formData = new FormData();

		Object.entries(data).forEach(([key, value]) => {
			if (key !== "image" && value !== undefined && value !== null) {
				if (value instanceof Date) {
					formData.append(key, value.toISOString().split("T")[0]);
				} else {
					formData.append(key, String(value));
				}
			}
		});

		if (imageFile) {
			formData.append("image", imageFile);
		}

		const response = await fetch(`${API_URL}/vehicles`, {
			method: "POST",
			body: formData,
			credentials: "include",
		});

		if (!response.ok) throw new Error("Erreur lors de la création du véhicule");
		return response.json();
	},

	updateVehicle: async (
		id_vehicle: number,
		data: VehicleType,
		imageFile?: File,
	): Promise<{ message: string }> => {
		const formData = new FormData();

		Object.entries(data).forEach(([key, value]) => {
			if (key !== "image" && value !== undefined && value !== null) {
				if (value instanceof Date) {
					formData.append(key, value.toISOString().split("T")[0]);
				} else {
					formData.append(key, String(value));
				}
			}
		});

		if (imageFile) {
			formData.append("image", imageFile);
		}

		const response = await fetch(`${API_URL}/vehicles/${id_vehicle}`, {
			method: "PUT",
			body: formData,
			credentials: "include",
		});

		if (!response.ok)
			throw new Error("Erreur lors de la mise à jour du véhicule");
		return response.json();
	},
	deleteVehicle: async (id_vehicle: number): Promise<{ message: string }> => {
		const response = await fetch(`${API_URL}/vehicles/${id_vehicle}`, {
			method: "DELETE",
			credentials: "include",
		});

		if (!response.ok)
			throw new Error("Erreur lors de la suppression du véhicule");
		return response.json();
	},
};
