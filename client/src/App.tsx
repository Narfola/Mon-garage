import { Outlet } from "react-router";
import "./App.css";
import NavBar from "./components/navBar/NavBar";

function App() {
	return (
		<main>
			<NavBar />
			<Outlet />
		</main>
	);
}

export default App;
