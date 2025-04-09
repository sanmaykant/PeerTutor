import { useNavigate } from "react-router";
import { useState, useEffect, useContext } from "react";
import { useAuthformHook } from "../hooks/AuthformHook"
import { AuthContext } from "../providers/AuthProvider"
import styles from "./Signup.module.scss";

export default function Signup() {
    const navigate = useNavigate();
    const { setAuthStatus } = useContext(AuthContext);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const useFormData = useAuthformHook({
        username: "",
        email: "",
    });

    useEffect(() => {
        setAuthStatus("authenticated");
        if (isSubmitted) {
            navigate("/meet");
        }
    }, [isSubmitted, navigate]);

    const [
        formData,
        passwordState,
        handleFormUpdate,
        handlePasswordUpdate
    ] = useFormData();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5000/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: formData.username,
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
        <div id={styles.main}>
            <div id={styles.container}>
                <div id={styles.heading}>
                <h1>Sign Up</h1>
                <p>Start learning and teaching with PeerTutor</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleFormUpdate}
                        required
                    />
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
                    <p style={passwordState.characterLength}>Password must contain at least 8 characters</p>
                    <p style={passwordState.specialCharacters}>Password must contain at least 1 special character</p>
                    <button type="submit">Signup</button>
                </form>
            </div>
        </div>
    );
}
