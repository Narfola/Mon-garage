import { NavLink } from "react-router";
import "./NavBar.css";

function NavBar() {
	return (
		<nav className="navbar">
			<div className="nav-brand">
				<NavLink to="/" className="nav-link-home">
					<h1>Mon Garage</h1>
				</NavLink>
			</div>
			<div className="nav-menu">
				<NavLink to="/vehicle" className="nav-link">
					Véhicules
				</NavLink>
			</div>
			<div className="nav-connect">
				<NavLink to="/login" className="nav-link-connect">
					Connection
				</NavLink>
			</div>
		</nav>
	);
}
export default NavBar;
