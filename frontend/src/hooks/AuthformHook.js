import { useState, useDebugValue } from "react";

export function useAuthformHook(userFields) {
    function useAuthForm() {
        const [formData, setFormData] = useState({
            ...userFields,
            password: ""
        });
        const [passwordState, setValidPasswordState] = useState({
            characterLength: "hide",
            specialCharacters: "hide",
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
                characterLength: value.length < 8 ? "error" : "success",
                specialCharacters: !/[\@\#\$\%\^\&\*\!\(\)]/.test(value) ?
                "error" : "success",
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
