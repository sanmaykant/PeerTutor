import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../providers/AuthProvider.jsx";
import { updateMetrics, fetchMatches } from "../utils/apiControllers.js";
import ListView from "../components/ListView";
import styles from "./styles/Dashboard.module.scss";
import { User } from "lucide-react";

const subjects = ["Maths", "Science", "History", "Geography", "English"];

function Dashboard() {
    const navigate = useNavigate();

    const { metrics } = useContext(AuthContext);
    const [strengths, setStrengths] = useState([]);
    const [weaknesses, setWeaknesses] = useState([]);
    const [matches, setMatches] = useState([]);
    const formInput = metrics.strengths.length === 0 && metrics.weaknesses.length === 0;
    console.log(matches);

    useEffect(() => {
        if (formInput) { return; }

        (async () => {
            const matches = await fetchMatches();
            setMatches(matches);
        })();
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        updateMetrics(strengths, weaknesses);
        window.location.reload();
    };

    const handleMultiSelect = (e, setter) => {
        const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
        setter(selected);
    };

    return (
        <>
        <div className={styles.mainContainer}>
        {formInput ? (
            <form onSubmit={submit} className={styles.form}>
                <h2 className={styles.formTitle}>Sign Up</h2>

                <label className={styles.label}>Strengths</label>
                <select multiple onChange={(e) => handleMultiSelect(e, setStrengths)} className={styles.select}>
                    {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>

                <label className={styles.label}>Weaknesses</label>
                <select multiple onChange={(e) => handleMultiSelect(e, setWeaknesses)} className={styles.select}>
                    {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>

                <button type="submit">Register</button>
            </form>
        ) : (
            <>
            <h1 className={styles.heading}>Matches</h1>
            <ListView users={matches} />
            <a href="/profile" className={styles.user}>
              <User
                className={styles.icon}
              />
            </a>
            </>
        )}
        </div>
        </>
    );
}

export default Dashboard;
