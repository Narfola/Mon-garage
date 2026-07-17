import { NavLink, useNavigate } from "react-router";
import "./NavBar.css";
import { useAuth } from "../../hooks/useAuth";

function NavBar() {
	const { isAuthenticated, logout } = useAuth();
	const navigate = useNavigate();

	const handleNavigation = () => {
		navigate("/login");
	};
	const getVehicleLink = () => {
		return isAuthenticated ? "/vehicle" : "/login";
	};
	return (
		<nav className="navbar">
			<div className="nav-brand">
				<NavLink to="/" className="nav-link-home">
					<h1>Mon Garage</h1>
				</NavLink>
			</div>
			<div className="nav-menu">
				<NavLink to={getVehicleLink()} className="nav-link">
					Véhicules
				</NavLink>
			</div>
			<div className="nav-connect">
				{isAuthenticated ? (
					<button type="button" onClick={logout} className="nav-link-connect">
						Déconnexion
					</button>
				) : (
					<button
						type="button"
						onClick={handleNavigation}
						className="nav-link-connect"
					>
						Connection
					</button>
				)}
			</div>
		</nav>
	);
}
export default NavBar;
