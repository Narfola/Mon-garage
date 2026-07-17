import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import type { MaintenanceType } from "../../hooks/maintenanceService";
import { maintenanceService } from "../../hooks/maintenanceService";
import "./MaintenanceGrid.css";

interface MaintenanceGridProps {
	id_vehicle: number | null;
	onRefresh?: () => void;
}

const formatDate = (dateString: string) => {
	if (!dateString) return "";

	const date = new Date(dateString);

	if (Number.isNaN(date.getTime())) return "Date invalide";

	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();

	return `${day}-${month}-${year}`;
};

const MaintenanceGrid = ({ id_vehicle, onRefresh }: MaintenanceGridProps) => {
	const [maintenances, setMaintenances] = useState<MaintenanceType[]>([]);
	const [loading, setLoading] = useState(false);

	const fetchMaintenances = useCallback(async () => {
		if (id_vehicle) {
			setLoading(true);
			try {
				const data =
					await maintenanceService.getMaintenanceByVehicleId(id_vehicle);
				setMaintenances(data);
			} catch (error) {
				console.error("Erreur lors du chargement des maintenances:", error);
			} finally {
				setLoading(false);
			}
		}
	}, [id_vehicle]);

	useEffect(() => {
		fetchMaintenances();
	}, [fetchMaintenances]);

	const handleDelete = async (id: number) => {
		if (!confirm("Êtes-vous sûr de vouloir supprimer cet entretien ?")) return;
		try {
			await maintenanceService.deleteMaintenance(id);
			if (onRefresh) onRefresh();
		} catch (error) {
			console.error("Erreur lors de la suppression:", error);
			Swal.fire("Erreur", "Impossible de supprimer l'entretien.", "error");
		}
	};

	if (!id_vehicle) return null;

	return (
		<div className="maintenance-grid">
			<h2 className="maintenance-grid__title">Derniers Entretiens</h2>
			{loading ? (
				<p className="maintenance-grid__loading">Chargement...</p>
			) : (
				<div className="maintenance-grid__table-container">
					<table className="maintenance-grid__table">
						<thead>
							<tr>
								<th>Date</th>
								<th>Kilométrage</th>
								<th>Modifier entretien</th>
								<th>Supprimer entretien</th>
							</tr>
						</thead>
						<tbody>
							{maintenances.map((m) => (
								<tr key={m.id_maintenance}>
									<td>
										{m.maintenance_date
											? formatDate(m.maintenance_date)
											: "N/A"}
									</td>
									<td>{m.maintenance_km ?? 0} KM</td>
									<td>
										<button
											type="button"
											className="maintenance-grid__btn-edit"
										>
											Modifier entretien
										</button>
									</td>
									<td>
										<button
											type="button"
											className="maintenance-grid__btn-delete"
											onClick={() =>
												m.id_maintenance !== undefined &&
												handleDelete(m.id_maintenance)
											}
										>
											Supprimer entretien
										</button>
									</td>
								</tr>
							))}
							{maintenances.length === 0 && (
								<tr>
									<td colSpan={4} style={{ textAlign: "center" }}>
										Aucun entretien enregistré.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default MaintenanceGrid;
