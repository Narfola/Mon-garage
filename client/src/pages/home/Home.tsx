import { useNavigate } from "react-router";
import "./Home.css";

const Home: React.FC = () => {
	const navigate = useNavigate();
	return (
		<div className="home-container">
			<section className="hero-section">
				<div className="hero-content">
					<h1 className="hero-title">Gérez votre flotte comme un pro.</h1>
					<p className="hero-description">
						Diagnostics en temps réel, planification de la maintenance et suivi
						de précision conçus pour l'infrastructure logistique moderne.
						Comblez le fossé entre l'efficacité numérique et la réalité du
						terrain.
					</p>
					<div className="hero-actions">
						<button
							type="button"
							className="btn-primary"
							onClick={() => navigate("/login")}
						>
							COMMENCER
						</button>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Home;
