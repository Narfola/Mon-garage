import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import App from "./App.tsx";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login.tsx";
import Vehicle from "./pages/vehicle/Vehicle.tsx";

const router = createBrowserRouter([
	{
		element: <App />,
		id: "app",
		children: [
			{
				path: "/",
				element: <Home />,
			},
			{
				path: "/login",
				element: <Login />,
			},
			{
				path: "/vehicle",
				element: <Vehicle />,
			},
		],
	},
]);
const rootElement = document.getElementById("root");
if (rootElement == null) {
	throw new Error(`Your HTML Document should contain a <div id="root"></div>`);
}
createRoot(rootElement).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
