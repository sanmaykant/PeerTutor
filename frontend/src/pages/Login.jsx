import { useNavigate } from "react-router";
import { useState, useEffect, useContext } from "react";
import { useAuthformHook } from "../hooks/AuthformHook"
import { AuthContext } from "../providers/AuthProvider"
import { errorStyle, hideStyle } from "../utils/styles";
import { login } from "../utils/apiControllers";
import styles from "./styles/Auth.module.scss";

export default function Login() {
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

        const response = await login(formData.email, formData.password);
        if (response) {
            setErrorMsg(response);
            setErrorMsgStyle(errorStyle);
        } else {
            setIsSubmitted(true);
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
