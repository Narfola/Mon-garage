import { useState } from "react";
import Swal from "sweetalert2";
import { maintenanceService } from "../../hooks/maintenanceService";
import type { VehicleType } from "../../hooks/vehiculeSercive";
import { vehicleService } from "../../hooks/vehiculeSercive";
import MaintenanceGrid from "../maintenanceGrid/MaintenanceGrid";
import MaintenanceModal from "../maintenanceModal/MaintenanceModal";
import VehicleModal from "../vehicleModal/VehicleModal";
import "./VehicleDetails.css";
import type { MaintenanceType } from "../../hooks/maintenanceService";

interface VehicleDetailsProps {
	vehicle: VehicleType;
	onUpdate?: () => Promise<void>;
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

const API_URL = import.meta.env.VITE_API_URL;

const VehicleDetails: React.FC<VehicleDetailsProps> = ({
	vehicle,
	onUpdate,
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);

	const [selectedMaintenance, setSelectedMaintenance] = useState<
		MaintenanceType | undefined
	>(undefined);
	const [modalType, setModalType] = useState<"add" | "edit" | "delete">("add");

	const refreshData = async () => {
		if (onUpdate) {
			await onUpdate();
		}
		setRefreshKey((prev) => prev + 1);
	};

	const handleSave = async (updatedData: VehicleType, imageFile?: File) => {
		try {
			if (!vehicle.id_vehicle) {
				Swal.fire("Erreur", "ID du véhicule non trouvé", "error");
				return;
			}

			await vehicleService.updateVehicle(
				vehicle.id_vehicle,
				updatedData,
				imageFile,
			);

			setIsModalOpen(false);

			Swal.fire("Succès", "Mise à jour réussie !", "success");

			await refreshData();
		} catch (error) {
			console.error("Erreur lors de la mise à jour:", error);
			Swal.fire(
				"Erreur",
				"Une erreur est survenue lors de la mise à jour.",
				"error",
			);
		}
	};

	const handleSaveMaintenance = async (data: {
		maintenance_date: string;
		maintenance_km: number;
		id_vehicle: number;
	}) => {
		try {
			if (
				modalType === "delete" &&
				selectedMaintenance?.id_maintenance !== undefined
			) {
				await maintenanceService.deleteMaintenance(
					selectedMaintenance.id_maintenance,
				);
				Swal.fire("Succès", "Entretien supprimé avec succès !", "success");
			} else if (
				modalType === "edit" &&
				selectedMaintenance?.id_maintenance !== undefined
			) {
				await maintenanceService.updateMaintenance(
					selectedMaintenance.id_maintenance,
					{
						maintenance_date: data.maintenance_date,
						maintenance_km: data.maintenance_km,
					},
				);
				Swal.fire("Succès", "Entretien mis à jour avec succès !", "success");
			} else {
				await maintenanceService.createMaintenance(data);
				Swal.fire("Succès", "Entretien ajouté avec succès !", "success");
			}

			setIsMaintenanceModalOpen(false);
			setSelectedMaintenance(undefined);
			await refreshData();
		} catch (error) {
			console.error("Erreur lors de la maintenance:", error);
			Swal.fire("Erreur", "Une erreur est survenue.", "error");
		}
	};

	const handleOpenEdit = (m: MaintenanceType) => {
		setSelectedMaintenance(m);
		setModalType("edit");
		setIsMaintenanceModalOpen(true);
	};

	const handleOpenDelete = (m: MaintenanceType) => {
		setSelectedMaintenance(m);
		setModalType("delete");
		setIsMaintenanceModalOpen(true);
	};

	const handleDelete = async () => {
		if (!vehicle.id_vehicle) {
			Swal.fire("Erreur", "ID du véhicule non trouvé", "error");
			return;
		}

		const result = await Swal.fire({
			title: "Êtes-vous sûr ?",
			text: "Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Oui, supprimer !",
			cancelButtonText: "Non, annuler",
		});

		if (!result.isConfirmed) return;

		try {
			await vehicleService.deleteVehicle(vehicle.id_vehicle);
			Swal.fire("Succès", "Véhicule supprimé avec succès !", "success");

			await refreshData();
		} catch (error) {
			console.error("Erreur lors de la suppression:", error);
			Swal.fire(
				"Erreur",
				"Une erreur est survenue lors de la suppression.",
				"error",
			);
		}
	};

	return (
		<div className="vehicle-details">
			<div className="vehicle-details__top">
				<div className="vehicle-details__image-section">
					<img
						src={`${API_URL}${vehicle.image ?? undefined}`}
						alt={vehicle.brand}
						className="vehicle-details__main-image"
					/>
				</div>

				<div className="vehicle-details__sidebar">
					<button
						type="button"
						className="vehicle-details__btn"
						onClick={() => setIsModalOpen(true)}
					>
						Modifier les spécifications
					</button>
					<button
						type="button"
						className="vehicle-details__btn"
						onClick={() => {
							setModalType("add");
							setIsMaintenanceModalOpen(true);
						}}
					>
						Ajouter un entretien
					</button>
					<button
						type="button"
						className="vehicle-details__btn delete"
						onClick={handleDelete}
					>
						Supprimer le véhicule
					</button>
				</div>
			</div>

			<div className="vehicle-details__grid">
				<div className="vehicle-details__params">
					<h3 className="vehicle-details__params-title">
						Paramètres Techniques
					</h3>
					<div className="vehicle-details__params-grid">
						<div className="vehicle-details__param-item">
							<p className="vehicle-details__param-label">
								DATE DE PREMIERE IMMATRICULATION
							</p>
							<p className="vehicle-details__param-value">
								{vehicle.first_immat_date
									? formatDate(vehicle.first_immat_date)
									: "Date non renseignée"}
							</p>
						</div>
						<div className="vehicle-details__param-item">
							<p className="vehicle-details__param-label">
								PLAQUE D'IMMATRICULATION
							</p>
							<p className="vehicle-details__param-value">{vehicle.immat}</p>
						</div>
						<div className="vehicle-details__param-item">
							<p className="vehicle-details__param-label">KILOMÉTRAGE ACTUEL</p>
							<p className="vehicle-details__param-value">
								{vehicle.mileage_km} KM
							</p>
						</div>
						<div className="vehicle-details__param-item">
							<p className="vehicle-details__param-label">TYPE DE CARBURANT</p>
							<p className="vehicle-details__param-value">
								{vehicle.fuel_type}
							</p>
						</div>
						<div className="vehicle-details__param-item">
							<p className="vehicle-details__param-label">TRANSMISSION</p>
							<p className="vehicle-details__param-value">
								{vehicle.transmission_type}
							</p>
						</div>
						<div className="vehicle-details__param-item">
							<p className="vehicle-details__param-label">PUISSANCE</p>
							<p className="vehicle-details__param-value">{vehicle.power} CV</p>
						</div>
						<div className="vehicle-details__param-item">
							<p className="vehicle-details__param-label">
								INTERVALLE MAINTENANCE (KM)
							</p>
							<p className="vehicle-details__param-value">
								{vehicle.maintenance_interval_km} KM
							</p>
						</div>
						<div className="vehicle-details__param-item">
							<p className="vehicle-details__param-label">
								INTERVALLE MAINTENANCE (TEMPS)
							</p>
							<p className="vehicle-details__param-value">
								{vehicle.maintenance_interval_time} mois
							</p>
						</div>
					</div>
				</div>
			</div>

			<MaintenanceGrid
				key={refreshKey}
				id_vehicle={vehicle.id_vehicle || null}
				onEdit={handleOpenEdit}
				onDelete={handleOpenDelete}
			/>

			<VehicleModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				initialData={vehicle}
				id_user={vehicle.id_user ?? 0}
				onSave={handleSave}
			/>
			<MaintenanceModal
				isOpen={isMaintenanceModalOpen}
				onClose={() => setIsMaintenanceModalOpen(false)}
				id_vehicle={vehicle.id_vehicle || null}
				onSave={handleSaveMaintenance}
				initialData={selectedMaintenance}
				modalType={modalType}
			/>
		</div>
	);
};

export default VehicleDetails;
