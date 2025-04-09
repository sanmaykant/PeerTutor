import { useState, useDebugValue } from "react";

export function useAuthformHook(userFields) {
    const errorStyle = {
        display: "block",
        color: "rgb(255, 52, 52)",
    };

    const successStyle = {
        display: "block",
        color: "#44be88",
    };

    const hideStyle = {
        display: "none",
    };

    function useAuthForm() {
        const [formData, setFormData] = useState({
            ...userFields,
            password: ""
        });
        const [passwordState, setValidPasswordState] = useState({
            characterLength: hideStyle,
            specialCharacters: hideStyle,
        });

        useDebugValue(formData);
        useDebugValue(passwordState);

        const handleFormUpdate = (e) => {
            const { name, value } = e.target;
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        };

        const handlePasswordUpdate = (e) => {
            const { name, value } = e.target;

            setValidPasswordState({
                ...passwordState,
                characterLength: value.length < 8 ? errorStyle : successStyle,
                specialCharacters: !/[\@\#\$\%\^\&\*\!\(\)]/.test(value)
                                        ? errorStyle : successStyle,
            });

            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        };

        return [formData, passwordState, handleFormUpdate, handlePasswordUpdate];
    }

    return useAuthForm;
}
