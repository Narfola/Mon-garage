import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

interface User {
	id_user: number;
	email: string;
}
interface AuthContextType {
	isAuthenticated: boolean;
	user: User | null;
	logout: () => Promise<void>;
	checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const API_URL = import.meta.env.VITE_API_URL;

	const verifyAuth = useCallback(async () => {
		try {
			const res = await fetch(`${API_URL}/users/me`, {
				credentials: "include",
			});
			if (res.ok) {
				const data = await res.json();
				setIsAuthenticated(true);
				setUser(data.user);
			} else {
				setIsAuthenticated(false);
				setUser(null);
			}
		} catch {
			setIsAuthenticated(false);
			setUser(null);
		}
	}, []);

	useEffect(() => {
		verifyAuth();
	}, [verifyAuth]);

	const logout = async () => {
		await fetch(`${API_URL}/logout`, {
			method: "POST",
			credentials: "include",
		});
		setIsAuthenticated(false);
		setUser(null);
	};

	const checkAuth = useCallback(async () => {
		await verifyAuth();
	}, [verifyAuth]);

	return (
		<AuthContext.Provider value={{ isAuthenticated, user, logout, checkAuth }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used within an AuthProvider");
	return context;
};
