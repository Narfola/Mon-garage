const API_URL = import.meta.env.VITE_API_URL;

export interface MaintenanceType {
	id_maintenance?: number;
	maintenance_date: string | null;
	maintenance_km: number | null;
	id_vehicle: number | null;
}

export const maintenanceService = {
	getMaintenanceByVehicleId: async (
		id_vehicle: number,
	): Promise<MaintenanceType[]> => {
		const response = await fetch(`${API_URL}/maintenance/${id_vehicle}`, {
			credentials: "include",
		});
		if (!response.ok)
			throw new Error("Erreur lors de la récupération des maintenances");
		return response.json();
	},

	createMaintenance: async (data: {
		maintenance_date: string;
		maintenance_km: number;
		id_vehicle: number;
	}): Promise<MaintenanceType> => {
		const response = await fetch(`${API_URL}/maintenance`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
			credentials: "include",
		});

		if (!response.ok)
			throw new Error("Erreur lors de la création de la maintenance");
		return response.json();
	},

	updateMaintenance: async (
		id_maintenance: number,
		data: {
			maintenance_date: string;
			maintenance_km: number;
		},
	): Promise<{ message: string }> => {
		const response = await fetch(`${API_URL}/maintenance/${id_maintenance}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				maintenance_date: data.maintenance_date,
				maintenance_km: data.maintenance_km,
			}),
			credentials: "include",
		});

		if (!response.ok)
			throw new Error("Erreur lors de la mise à jour de la maintenance");
		return response.json();
	},

	deleteMaintenance: async (
		id_maintenance: number,
	): Promise<{ message: string }> => {
		const response = await fetch(`${API_URL}/maintenance/${id_maintenance}`, {
			method: "DELETE",
			credentials: "include",
		});

		if (!response.ok)
			throw new Error("Erreur lors de la suppression de la maintenance");
		return response.json();
	},
};
