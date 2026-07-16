import "./VehicleDetails.css";

interface VehicleDetailsProps {
	vehicle: {
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
	};
}

const VehicleDetails: React.FC<VehicleDetailsProps> = ({ vehicle }) => {
	return (
		<div className="vehicle-details">
			<div className="vehicle-details__top">
				<div className="vehicle-details__image-section">
					<img
						src={vehicle.image}
						alt={vehicle.brand}
						className="vehicle-details__main-image"
					/>
				</div>

				<div className="vehicle-details__sidebar">
					<button type="button" className="vehicle-details__btn-specs">
						Modifier les spécifications
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
							<p className="vehicle-details__param-label">ID VÉHICULE</p>
							<p className="vehicle-details__param-value">
								{vehicle.id_vehicle}
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
		</div>
	);
};

export default VehicleDetails;
