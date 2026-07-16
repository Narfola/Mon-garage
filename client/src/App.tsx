import { Outlet } from "react-router";
import "./App.css";
import NavBar from "./components/navBar/NavBar";
import { AuthProvider } from "./hooks/useAuth";

function App() {
	return (
		<main>
			<AuthProvider>
				<NavBar />
				<Outlet />
			</AuthProvider>
		</main>
	);
}

export default App;
