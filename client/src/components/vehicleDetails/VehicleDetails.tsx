import { useState } from "react";
import type { VehicleType } from "../../hooks/vehiculeSercive";
import { vehicleService } from "../../hooks/vehiculeSercive";
import VehicleModal from "../vehicleModal/VehicleModal";
import "./VehicleDetails.css";

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

	const handleSave = async (updatedData: VehicleType, imageFile?: File) => {
		try {
			if (!vehicle.id_vehicle) {
				alert("Erreur : ID du véhicule non trouvé");
				return;
			}

			await vehicleService.updateVehicle(
				vehicle.id_vehicle,
				updatedData,
				imageFile,
			);

			setIsModalOpen(false);

			alert("Mise à jour réussie !");

			if (onUpdate) {
				await onUpdate();
			}
		} catch (error) {
			console.error("Erreur lors de la mise à jour:", error);
			alert("Une erreur est survenue lors de la mise à jour.");
		}
	};

	const handleDelete = async () => {
		if (!vehicle.id_vehicle) {
			alert("Erreur : ID du véhicule non trouvé");
			return;
		}

		const confirmed = window.confirm(
			"Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible.",
		);

		if (!confirmed) return;

		try {
			await vehicleService.deleteVehicle(vehicle.id_vehicle);
			alert("Véhicule supprimé avec succès !");

			if (onUpdate) {
				await onUpdate();
			}
		} catch (error) {
			console.error("Erreur lors de la suppression:", error);
			alert("Une erreur est survenue lors de la suppression.");
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
					<button type="button" className="vehicle-details__btn">
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
			<VehicleModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				initialData={vehicle}
				id_user={vehicle.id_user ?? 0}
				onSave={handleSave}
			/>
		</div>
	);
};

export default VehicleDetails;
