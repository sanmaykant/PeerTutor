import { useNavigate } from "react-router";
import React, {
    createContext,
    useState,
    useEffect,
    useContext
} from "react";

export const AuthContext = createContext("loading");

export default function AuthProvider({ children }) {
    const [authStatus, setAuthStatus] = useState("loading");

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
            if (!jsonResponse.success) {
                setAuthStatus("unauthenticated");
            } else {
                setAuthStatus("authenticated");
            }
        };

        authenticate();
    }, []);

    return (
        <AuthContext.Provider value={{ authStatus, setAuthStatus }}>
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

    if (authStatus === "loading") {
        return <div>Loading...</div>;
    }

    return authStatus === "authenticated" ? children : <div>huh?</div>;
}
