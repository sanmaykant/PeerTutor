import { useNavigate } from "react-router";
import { useState, useEffect, useContext } from "react";
import { useAuthformHook } from "../hooks/AuthformHook"
import { AuthContext } from "../providers/AuthProvider"

export default function Login() {
    const navigate = useNavigate();
    const useFormData = useAuthformHook({ email: "" })
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { setAuthStatus } = useContext(AuthContext);

    useEffect(() => {
        setAuthStatus("authenticated");
        if (isSubmitted) {
            navigate("/meet");
        }
    })

    const [
        formData,
        passwordState,
        handleFormUpdate,
        handlePasswordUpdate
    ] = useFormData();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
            }),
        });

        const data = await response.json();
        if (data.success) {
            localStorage.setItem("auth_token", data.auth_token);
            localStorage.setItem("email", formData.email);
            setIsSubmitted(true);
        }
    };

    return (
        <div id="main">
            <div id="container">
                <div id="heading">
                <h1>Login</h1>
                <p>Start learning and teaching with PeerTutor</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleFormUpdate}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handlePasswordUpdate}
                        required
                    />
                    <p className={passwordState.characterLength}>Password must contain at least 8 characters</p>
                    <p className={passwordState.specialCharacters}>Password must contain at least 1 special character</p>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}
