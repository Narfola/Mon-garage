import { useEffect, useState } from "react";
import type { VehicleType } from "../../hooks/vehiculeSercive";
import "./VehicleModal.css";

interface VehicleModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (vehicle: VehicleType, imageFile?: File) => Promise<void>;
	initialData?: VehicleType;
	onSuccess?: () => Promise<void>;
	id_user: number;
}

const VehicleModal: React.FC<VehicleModalProps> = ({
	isOpen,
	onClose,
	onSave,
	initialData,
	onSuccess,
	id_user,
}) => {
	const [formData, setFormData] = useState<VehicleType>({
		brand: "",
		model: "",
		immat: "",
		first_immat_date: null,
		fuel_type: null,
		transmission_type: null,
		power: null,
		mileage_km: null,
		maintenance_interval_km: null,
		maintenance_interval_time: null,
	});
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isOpen && initialData) {
			setFormData(initialData);
		} else if (isOpen) {
			setFormData({
				brand: "",
				model: "",
				immat: "",
				first_immat_date: null,
				fuel_type: null,
				transmission_type: null,
				power: null,
				mileage_km: null,
				maintenance_interval_km: null,
				maintenance_interval_time: null,
			});
		}
	}, [isOpen, initialData]);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		const { name, value, type } = e.target;
		let finalValue: string | number | Date | null = value;

		if (type === "number") {
			finalValue = value === "" ? null : Number(value);
		} else if (type === "date") {
			finalValue = value === "" ? null : new Date(value);
		}

		setFormData((prev) => ({ ...prev, [name]: finalValue }));
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const finalData = {
				...formData,
				id_user: id_user,
				image: initialData?.image ?? null,
			};

			await onSave(finalData, imageFile ?? undefined);

			if (onSuccess) {
				await onSuccess();
			}

			onClose();
		} catch (error) {
			console.error("Erreur lors de l'enregistrement:", error);
			alert("Une erreur est survenue lors de l'enregistrement.");
		} finally {
			setIsLoading(false);
		}
	};
	if (!isOpen) return null;

	return (
		<div className="modal-overlay">
			<div className="modal-container">
				<div className="modal-header">
					<h2>
						{initialData ? "Modifier le véhicule" : "Ajouter un véhicule"}
					</h2>
					<button type="button" className="close-button" onClick={onClose}>
						&times;
					</button>
				</div>

				<form className="modal-body" onSubmit={handleSubmit}>
					<div className="form-grid">
						<div className="form-group">
							<label htmlFor="brand">Marque</label>
							<input
								id="brand"
								type="text"
								name="brand"
								value={formData.brand}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="form-group">
							<label htmlFor="model">Modèle</label>
							<input
								id="model"
								type="text"
								name="model"
								value={formData.model}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="form-group">
							<label htmlFor="immat">Immatriculation</label>
							<input
								id="immat"
								type="text"
								name="immat"
								value={formData.immat}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="form-group">
							<label htmlFor="first_immat_date">Date 1ère Immat.</label>
							<input
								id="first_immat_date"
								type="date"
								name="first_immat_date"
								value={
									formData.first_immat_date
										? new Date(formData.first_immat_date)
												.toISOString()
												.split("T")[0]
										: ""
								}
								onChange={handleChange}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="fuel_type">Type de Carburant</label>
							<input
								id="fuel_type"
								type="text"
								name="fuel_type"
								value={formData.fuel_type || ""}
								onChange={handleChange}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="transmission_type">Transmission</label>
							<select
								id="transmission_type"
								name="transmission_type"
								value={formData.transmission_type || ""}
								onChange={handleChange}
							>
								<option value="">Sélectionner</option>
								<option value="Manuel">Manuel</option>
								<option value="Automatique">Automatique</option>
							</select>
						</div>
						<div className="form-group">
							<label htmlFor="power">Puissance</label>
							<input
								id="power"
								name="power"
								value={formData.power || ""}
								onChange={handleChange}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="mileage_km">Kilométrage</label>
							<input
								id="mileage_km"
								name="mileage_km"
								value={formData.mileage_km || ""}
								onChange={handleChange}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="maintenance_interval_km">
								Intervalle Entretien (km)
							</label>
							<input
								id="maintenance_interval_km"
								name="maintenance_interval_km"
								value={formData.maintenance_interval_km || ""}
								onChange={handleChange}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="maintenance_interval_time">
								Intervalle Entretien (temps)
							</label>
							<input
								id="maintenance_interval_time"
								name="maintenance_interval_time"
								value={formData.maintenance_interval_time || ""}
								onChange={handleChange}
							/>
						</div>
						<div className="form-group full-width">
							<label htmlFor="vehicle_image">Photo du véhicule</label>
							<input
								id="vehicle_image"
								type="file"
								accept="image/*"
								onChange={handleFileChange}
							/>
						</div>
					</div>

					<div className="modal-footer">
						<button type="button" className="btn-cancel" onClick={onClose}>
							Annuler
						</button>
						<button type="submit" className="btn-save" disabled={isLoading}>
							{isLoading ? "Enregistrement..." : "Enregistrer"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default VehicleModal;
