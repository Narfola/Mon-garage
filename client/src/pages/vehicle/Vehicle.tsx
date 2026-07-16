import { useEffect, useState } from "react";

import VehicleCard from "../../components/vehicleCard/VehicleCard";
import VehicleDetails from "../../components/vehicleDetails/VehicleDetails";
import { useAuth } from "../../hooks/useAuth";

import "./Vehicle.css";

interface Vehicle {
	id_vehicle: number;
	image: string;
	brand: string;
	model: string;
	immat: string;
	mileage_km: number;
	fuel_type: string;
	transmission_type: string;
	power: number;
	maintenance_interval_km: number;
	maintenance_interval_time: number;
	id_user: number;
}

const Vehicle = () => {
	const { user, isAuthenticated } = useAuth();
	const [vehicles, setVehicles] = useState<Vehicle[]>([]);
	const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchVehicles = async () => {
			if (isAuthenticated && user?.id_user) {
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
		};

		fetchVehicles();
	}, [isAuthenticated, user]);

	if (!isAuthenticated) return <div className="loading">Chargement...</div>;

	return (
		<div className="vehicle-page">
			<main className="vehicle-page__content">
				<aside className="vehicle-page__sidebar">
					<header className="vehicle-page__header">
						<h1 className="vehicle-page__title">Inventaire Flotte</h1>
						<button type="button" className="vehicle-page__add-btn">
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
								onClick={() => setSelectedVehicle(v)}
								isSelected={selectedVehicle?.id_vehicle === v.id_vehicle}
							/>
						))
					)}
				</aside>

				<section className="vehicle-page__main">
					{selectedVehicle ? (
						<VehicleDetails vehicle={selectedVehicle} />
					) : (
						<div className="vehicle-page__empty">
							<p>Sélectionnez un véhicule pour voir les détails</p>
						</div>
					)}
				</section>
			</main>
		</div>
	);
};

export default Vehicle;
