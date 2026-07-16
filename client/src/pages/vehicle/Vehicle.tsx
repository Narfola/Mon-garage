import { useCallback, useEffect, useMemo, useState } from "react";

import VehicleCard from "../../components/vehicleCard/VehicleCard";
import VehicleDetails from "../../components/vehicleDetails/VehicleDetails";
import VehicleModal from "../../components/vehicleModal/VehicleModal";
import { useAuth } from "../../hooks/useAuth";
import type { VehicleType } from "../../hooks/vehiculeSercive";
import { vehicleService } from "../../hooks/vehiculeSercive";

import "./Vehicle.css";

const Vehicle = () => {
	const { user, isAuthenticated } = useAuth();
	const [vehicles, setVehicles] = useState<VehicleType[]>([]);
	const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
		null,
	);
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const fetchVehicles = useCallback(async () => {
		if (isAuthenticated && user?.id_user) {
			setLoading(true);
			try {
				const res = await fetch(
					`${import.meta.env.VITE_API_URL}/vehicles/${user.id_user}`,
					{ credentials: "include" },
				);
				if (res.ok) {
					const data = await res.json();
					setVehicles(data);
				}
			} catch (error) {
				console.error("Erreur lors du chargement des véhicules:", error);
			} finally {
				setLoading(false);
			}
		}
	}, [isAuthenticated, user]);

	useEffect(() => {
		fetchVehicles();
	}, [fetchVehicles]);

	const selectedVehicle = useMemo(() => {
		if (!selectedVehicleId) return null;
		return vehicles.find((v) => v.id_vehicle === selectedVehicleId) || null;
	}, [vehicles, selectedVehicleId]);

	if (!isAuthenticated) return <div className="loading">Chargement...</div>;

	const handleAddSuccess = async () => {
		await fetchVehicles();
		setIsModalOpen(false);
	};

	const handleVehicleUpdate = async () => {
		await fetchVehicles();
	};

	return (
		<div className="vehicle-page">
			<main className="vehicle-page__content">
				<aside className="vehicle-page__sidebar">
					<header className="vehicle-page__header">
						<h1 className="vehicle-page__title">Votre Flotte</h1>
						<button
							type="button"
							className="vehicle-page__add-btn"
							onClick={() => setIsModalOpen(true)}
						>
							+ Ajouter
						</button>
					</header>
					{loading ? (
						<p>Chargement...</p>
					) : (
						vehicles.map((v) => (
							<VehicleCard
								key={v.id_vehicle}
								brand={v.brand}
								model={v.model}
								immat={v.immat}
								image={v.image || "/placeholder.png"}
								onClick={() =>
									v.id_vehicle !== undefined &&
									setSelectedVehicleId(v.id_vehicle)
								}
								isSelected={selectedVehicleId === v.id_vehicle}
							/>
						))
					)}
				</aside>

				<section className="vehicle-page__main">
					{selectedVehicle ? (
						<VehicleDetails
							vehicle={selectedVehicle}
							onUpdate={handleVehicleUpdate}
						/>
					) : (
						<div className="vehicle-page__empty">
							<p>Sélectionnez un véhicule pour voir les détails</p>
						</div>
					)}
				</section>
			</main>
			<VehicleModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSave={async (data: VehicleType, imageFile?: File) => {
					try {
						await vehicleService.createVehicle(data, imageFile);
						alert("Véhicule ajouté avec succès !");
						handleAddSuccess();
					} catch (error) {
						console.error(error);
						alert("Erreur lors de l'ajout.");
					}
				}}
				id_user={user?.id_user || 0}
			/>
		</div>
	);
};

export default Vehicle;
