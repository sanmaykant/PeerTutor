import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../providers/AuthProvider.jsx";
import { updateMetrics, fetchMatches } from "../utils/apiControllers.js";
import styles from "./Dashboard.module.scss";

const subjects = ["Maths", "Science", "History", "Geography", "English"];

function Dashboard() {
    const { metrics } = useContext(AuthContext);
    const [strengths, setStrengths] = useState([]);
    const [weaknesses, setWeaknesses] = useState([]);
    const [matches, setMatches] = useState([]);
    const formInput = metrics.strengths.length === 0 && metrics.weaknesses.length === 0;

    useEffect(() => {
        if (formInput) { return; }

        (async ()=> {
            const matches = await fetchMatches();
            setMatches(matches);
        })();
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        updateMetrics(strengths, weaknesses);
    }

    const handleMultiSelect = (e, setter) => {
        const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
        setter(selected);
    };

    return (
        <>
        {formInput ? (
            <form onSubmit={submit} className={styles.form}>
            <h2>Sign Up</h2>

            <label>Strengths</label>
            <select multiple onChange={(e) => handleMultiSelect(e, setStrengths)}>
            {subjects.map((s) => <option key={s}>{s}</option>)}
            </select>

            <label>Weaknesses</label>
            <select multiple onChange={(e) => handleMultiSelect(e, setWeaknesses)}>
            {subjects.map((s) => <option key={s}>{s}</option>)}
            </select>

            <button type="submit">Register</button>
            </form>

        ) : (
            <div>
            {matches.map((m) => {
                return <div
                key={m.id}
                style={{
                    border: '1px solid gray',
                        borderRadius: '8px',
                        padding: '15px',
                        marginBottom: '20px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
                    >
                    <p><strong>Name:</strong> {m.username}</p>
                    <p><strong>Email:</strong> {m.email}</p>

                    <p><strong>They can help you with:</strong></p>
                    <ul>
                    {m.strengths.map((s, index) => (
                        <li key={index}>{s}</li>
                    ))}
                    </ul>

                    <p><strong>You can help them with:</strong></p>
                    <ul>
                    {m.weaknesses.map((w, index) => (
                        <li key={index}>{w}</li>
                    ))}
                    </ul>
                    </div>

            })}
            </div>
        )
        }
        </>
    )
}

export default Dashboard;
