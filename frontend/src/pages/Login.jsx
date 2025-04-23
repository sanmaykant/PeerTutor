import { useNavigate } from "react-router";
import { useState, useEffect, useContext } from "react";
import { useAuthformHook } from "../hooks/AuthformHook"
import { AuthContext } from "../providers/AuthProvider"
import { errorStyle, hideStyle } from "../utils/styles";
import styles from "./Signup.module.scss";

export default function Signup() {
    const navigate = useNavigate();
    const { setAuthStatus } = useContext(AuthContext);
    const [errorMsg, setErrorMsg] = useState("");
    const [errorMsgStyle, setErrorMsgStyle] = useState(hideStyle);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const useFormData = useAuthformHook({
        username: "",
        email: "",
    });

    useEffect(() => {
        setAuthStatus("logged_in");
        if (isSubmitted) {
            navigate("/dashboard");
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

        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();
            console.log(data);
            if (data.success) {
                localStorage.setItem("auth_token", data.auth_token);
                localStorage.setItem("email", formData.email);
                setIsSubmitted(true);
            } else {
                setErrorMsg(data.message);
                setErrorMsgStyle(errorStyle);
            }

        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div id={styles.main}>
            <div id={styles.container}>
                <div id={styles.heading}>
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
                    <p style={passwordState.characterLength}>Password must contain at least 8 characters</p>
                    <p style={passwordState.specialCharacters}>Password must contain at least 1 special character</p>
                    <p style={errorMsgStyle}>{errorMsg}</p>
                    <button type="submit">Login</button>
                    <p>Not a member? <a href="/signup">Signup</a></p>
                </form>
            </div>
        </div>
    );
}
