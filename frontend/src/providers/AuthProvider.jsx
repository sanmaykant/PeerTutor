import { useNavigate } from "react-router";
import React, {
    createContext,
    useState,
    useEffect,
    useContext
} from "react";
import { fetchMetrics } from "../utils/apiControllers.js"

export const AuthContext = createContext("loading");

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === "loading") {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default function AuthProvider({ children }) {
    const [authStatus, setAuthStatus] = useState("loading");
    const [user, setUser] = useState();
    const [metrics, setMetrics] = useState({
        strengths: [],
        weaknesses: [],
    });

    useEffect(() => {
        const authenticate = async () => {
            const token = localStorage.getItem("auth_token");
            const email = localStorage.getItem("email");
            if (!token) {
                setAuthStatus("unauthenticated");
                return;
            }

            const response = await fetch("http://localhost:5000/api/auth/authenticate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    authenticating: true,
                    auth_token: token,
                    email: email,
                }),
            });

            const jsonResponse = await response.json();
            setUser(jsonResponse.user);
            if (!jsonResponse.success) {
                setAuthStatus("unauthenticated");
            } else {
                setAuthStatus("authenticated");
                const metrics = await fetchMetrics();
                if (metrics) {
                    setMetrics({
                        strengths: metrics.strengths,
                        weaknesses: metrics.weaknesses,
                    });
                }
            }
        };

        authenticate();
    }, [authStatus]);

    return (
        <AuthContext.Provider value={{ authStatus, setAuthStatus, user, metrics }}>
            {children}
        </AuthContext.Provider>
    );
}

export function ProtectedRoute({ children }) {
    const navigate = useNavigate();
    const { authStatus } = useContext(AuthContext);

    useEffect(() => {
        if (authStatus === "unauthenticated") {
            navigate("/signup");
        }
    }, [authStatus, navigate]);

    if (authStatus !== "authenticated") {
        return <div>Loading...</div>;
    }

    return authStatus === "authenticated" ? children : <div>huh?</div>;
}
