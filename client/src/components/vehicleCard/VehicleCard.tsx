import "./VehicleCard.css";

interface VehicleProps {
	brand: string;
	model: string;
	immat: string;
	image: string;
	onClick: () => void;
	isSelected: boolean;
}
const API_URL = import.meta.env.VITE_API_URL;
const VehicleCard: React.FC<VehicleProps> = ({
	brand,
	model,
	immat,
	image,
	onClick,
	isSelected,
}) => {
	return (
		<button
			className={`vehicle-card ${isSelected ? "vehicle-card--selected" : ""}`}
			onClick={onClick}
			type="button"
			style={{ cursor: "pointer" }}
		>
			<div className="vehicle-card__header">
				<div className="vehicle-card__brand-model">
					<h3 className="vehicle-card__title">
						{brand} {model}
					</h3>
					<p className="vehicle-card__immat">{immat}</p>
				</div>
			</div>
			<div className="vehicle-card__image-container">
				<img
					src={`${API_URL}${image}`}
					alt={`${brand} ${model}`}
					className="vehicle-card__image"
				/>
			</div>
		</button>
	);
};

export default VehicleCard;
