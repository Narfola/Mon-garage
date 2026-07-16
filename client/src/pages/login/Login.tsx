import { useState } from "react";
import { useNavigate } from "react-router";
import "./Login.css";

function Login() {
	const API_URL = import.meta.env.VITE_API_URL;
	const navigate = useNavigate();
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setMessage("");

		const endpoint = isLogin ? "/login" : "/register";

		try {
			const response = await fetch(`${API_URL}${endpoint}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				setMessage(data.message || "Une erreur est survenue");
			} else {
				if (isLogin) {
					setMessage(data.message);
					navigate("/vehicle");
				} else {
					setMessage(data.message);
					setIsLogin(false);
				}
			}
		} catch (_error) {
			setMessage("Erreur de connexion au serveur");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="login-container">
			<div className="login-card">
				<div className="tabs">
					<button
						type="button"
						className={isLogin ? "active" : ""}
						onClick={() => setIsLogin(true)}
					>
						Connexion
					</button>
					<button
						type="button"
						className={!isLogin ? "active" : ""}
						onClick={() => setIsLogin(false)}
					>
						Inscription
					</button>
				</div>

				<h2 className="card-title">
					{isLogin ? "Connexion Opérateur" : "Création de Compte"}
				</h2>
				<p className="card-subtitle">
					{isLogin
						? "Accès terminal sécurisé requis."
						: "Créez votre compte pour accéder au système."}
				</p>

				<form onSubmit={handleSubmit} className="login-form">
					<div className="form-group">
						<span>IDENTIFIANT PERSONNEL</span>
						<div className="input-wrapper">
							<span className="icon">👤</span>
							<input
								type="email"
								placeholder="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
					</div>

					<div className="form-group">
						<span>CLÉ D'ACCÈS</span>
						<div className="input-wrapper">
							<span className="icon">🔒</span>
							<input
								type={showPassword ? "text" : "password"}
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<button
								type="button"
								className="toggle-password-btn"
								onClick={togglePasswordVisibility}
								title={
									showPassword
										? "Masquer le mot de passe"
										: "Afficher le mot de passe"
								}
							>
								{showPassword ? "🙈" : "👁️"}{" "}
							</button>
						</div>
					</div>

					{isLogin && (
						<div className="form-footer">
							<span>
								<input type="checkbox" /> Mémoriser la station
							</span>
							<a href="#perdu">CLÉ PERDUE </a>
						</div>
					)}

					<button type="submit" className="submit-btn" disabled={isLoading}>
						{isLoading
							? "CHARGEMENT..."
							: isLogin
								? "S'AUTHENTIFIER"
								: "S'INSCRIRE"}
					</button>
				</form>

				{message && <p className="message">{message}</p>}
			</div>
		</div>
	);
}

export default Login;
