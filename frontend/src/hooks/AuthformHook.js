import { useState, useDebugValue } from "react";
import { errorStyle, successStyle, hideStyle } from "../utils/styles";

export function useAuthformHook(userFields) {
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
