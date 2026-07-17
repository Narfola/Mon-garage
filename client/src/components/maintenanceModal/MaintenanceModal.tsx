import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import type { MaintenanceType } from "../../hooks/maintenanceService";
import "./MaintenanceModal.css";

interface MaintenanceModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: {
		maintenance_date: string;
		maintenance_km: number;
		id_vehicle: number;
	}) => Promise<void>;
	initialData?: MaintenanceType;
	onSuccess?: () => Promise<void>;
	id_vehicle: number | null;
	modalType?: "add" | "edit" | "delete";
}

const MaintenanceModal: React.FC<MaintenanceModalProps> = ({
	isOpen,
	onClose,
	onSave,
	initialData,
	onSuccess,
	id_vehicle,
	modalType,
}) => {
	const [formData, setFormData] = useState({
		maintenance_date: "" as string,
		maintenance_km: 0 as number | null,
	});
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (isOpen && initialData) {
			setFormData({
				maintenance_date: initialData.maintenance_date || "",
				maintenance_km: initialData.maintenance_km ?? null,
			});
		} else if (isOpen) {
			setFormData({
				maintenance_date: "",
				maintenance_km: null,
			});
		}
	}, [isOpen, initialData]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value, type } = e.target;
		let finalValue: string | number | null = value;

		if (type === "number") {
			finalValue = value === "" ? null : Number(value);
		}

		setFormData((prev) => ({ ...prev, [name]: finalValue }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!id_vehicle) return;

		setIsLoading(true);
		try {
			const finalData = {
				...formData,
				id_vehicle: id_vehicle,
				maintenance_km: formData.maintenance_km ?? 0,
			};

			await onSave(finalData);

			if (onSuccess) {
				await onSuccess();
			}

			onClose();
		} catch (error) {
			console.error("Erreur lors de l'enregistrement:", error);
			Swal.fire(
				"Erreur",
				"Une erreur est survenue lors de l'enregistrement.",
				"error",
			);
		} finally {
			setIsLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="modal-overlay">
			<div className="modal-container">
				<div className="modal-header">
					<h2 className="modal-header__title">
						{modalType === "delete"
							? "Supprimer l'entretien"
							: initialData
								? "Modifier l'entretien"
								: "Ajouter un entretien"}
					</h2>
					<button type="button" className="close-button" onClick={onClose}>
						&times;
					</button>
				</div>

				<div className="modal-body">
					{modalType === "delete" ? (
						<div className="modal-delete">
							<p>
								Êtes-vous sûr de vouloir supprimer cet entretien ? Cette action
								est irréversible.
							</p>
							<button
								type="button"
								className="btn-delete"
								onClick={() =>
									onSave({
										maintenance_date: "",
										maintenance_km: 0,
										id_vehicle: 0,
									})
								}
								disabled={isLoading}
							>
								{isLoading ? "Suppression..." : "Confirmer la suppression"}
							</button>
						</div>
					) : (
						<form onSubmit={handleSubmit}>
							<div className="form-grid">
								<div className="form-group">
									<label htmlFor="maintenance_date">Date de l'entretien</label>
									<input
										id="maintenance_date"
										type="date"
										name="maintenance_date"
										value={formData.maintenance_date}
										onChange={handleChange}
										required
									/>
								</div>
								<div className="form-group">
									<label htmlFor="maintenance_km">Kilométrage</label>
									<input
										id="maintenance_km"
										name="maintenance_km"
										placeholder="Ex: 35000"
										value={formData.maintenance_km ?? ""}
										onChange={handleChange}
										required
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
					)}
				</div>
			</div>
		</div>
	);
};

export default MaintenanceModal;
