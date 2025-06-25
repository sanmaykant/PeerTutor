import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../providers/AuthProvider.jsx";
import { motion, AnimatePresence } from "framer-motion";

import {
    updateMetrics,
    fetchMatches,
    fetchChats
} from "../utils/apiControllers.js";

import ListView from "../components/ListView";
import ChatView from "../components/ChatView.jsx";

import styles from "./styles/Dashboard.module.scss";
import { User, MessageSquare, Phone } from "lucide-react";

const subjects = [
    "Operating System",
    "Computer Architecture",
    "Database Management",
    "Software Engineering",
    "Computer Networks"
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, type: "spring" } },
  exit: { opacity: 0, y: 40, transition: { duration: 0.3 } }
};
const inputVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.3 } })
};

function Dashboard() {
    const { metrics } = useContext(AuthContext);
    const [matches, setMatches] = useState([]);
    const [showMatches, setShowMatches] = useState(false);
    const [userChatHistoryMap, setUserChatHistoryMap] = useState({});
    const [peer, setPeer] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const formInput =
        metrics.strengths.length === 0 && metrics.weaknesses.length === 0;
    const [marks, setMarks] = useState({});

    useEffect(() => {
        if (!formInput) {
            (async () => {
                const initialMatches = await fetchMatches();
                setMatches(initialMatches);
                setShowMatches(true);
            })();
        }
    }, [formInput]);

    // Responsive: update root font size for mobile
    useEffect(() => {
        const setFont = () => {
            document.documentElement.style.fontSize = window.innerWidth < 600 ? '13px' : '16px';
        };
        setFont();
        window.addEventListener('resize', setFont);
        return () => window.removeEventListener('resize', setFont);
    }, []);

    const handleMarkChange = (subject, value) => {
        const numValue = parseInt(value);
        if (value === "" ||
            (!isNaN(numValue) && numValue >= 0 && numValue <= 100)) {
            setMarks((prev) => ({
                ...prev,
                [subject]: value
            }));
        }
    };

    const handleChat = (username) => {
        (async () => {
            if (!userChatHistoryMap[username]) {
                const chats = await fetchChats(username);
                setUserChatHistoryMap(
                    prev => ({ ...prev, [username]: chats }));
            }
            if (peer === username)
                setPeer(null);
            else
                setPeer(username);
        })();
    };

    const submit = async (e) => {
        e.preventDefault();
        console.log("Submitting marks:", marks);
        const token = localStorage.getItem("auth_token");
        if (token) {
            const payload = token.split('.')[1];
            const decoded = JSON.parse(atob(payload));
            console.log("Decoded payload:", decoded);
            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
                console.log("Token has expired.");
            } else {
                console.log("Token is valid.");
            }
        }
        try {
            const response = await updateMetrics(marks);
            if (response && response.status === 200) {
                const newMatches = await fetchMatches();
                setMatches(newMatches);
                setShowMatches(true);
            }
            window.location.reload();
        } catch (error) {
            console.error("Error submitting marks:", error);
            alert("Fail!");
        }
    };

    // Dark mode colors
    const bgColor = darkMode ? "#18181b" : "#f9f9f9";
    const cardBg = darkMode ? "rgba(36,37,46,0.95)" : "rgba(255,255,255,0.7)";
    const cardBorder = darkMode ? "1.5px solid #232334" : "1.5px solid rgba(255,255,255,0.25)";
    const textColor = darkMode ? "#f3f4f6" : "#222";
    const inputBg = darkMode ? "#232334" : "rgba(255,255,255,0.95)";
    const inputBorder = darkMode ? "1.5px solid #33334d" : "1.5px solid #e0e7ef";
    const inputText = darkMode ? "#f3f4f6" : "#222";
    const headingShadow = darkMode ? "0 1px 2px #0008" : "0 1px 2px #fff8";

    return (
        <div
            className={styles.mainContainer}
            style={{
                padding: "2vw",
                backgroundColor: bgColor,
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                position: "relative",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.3s"
            }}
            onClick={() => { if (peer !== null) setPeer(null); }}
        >
            {/* Top right: Profile icon (always visible) */}
            <a href="/profile" className={styles.user} style={{
                position: "absolute",
                top: 18,
                right: 24,
                textDecoration: "none",
                color: darkMode ? "#facc15" : "#007bff",
                display: "flex",
                alignItems: "center",
                background: "rgba(255,255,255,0.7)",
                borderRadius: "50%",
                boxShadow: "0 2px 8px #0001",
                width: 38,
                height: 38,
                justifyContent: "center",
                zIndex: 21
            }}>
                <User className={styles.icon} style={{ width: "24px", height: "24px" }} />
            </a>
            {/* Top right: Dark mode toggle (hidden when chat is open) */}
            {peer === null && (
                <motion.button
                    onClick={e => { e.stopPropagation(); setDarkMode(d => !d); }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                        position: "absolute",
                        top: 70,
                        right: 24,
                        zIndex: 20,
                        display: "flex",
                        alignItems: "center",
                        background: darkMode ? "#232334" : "#fff",
                        border: `1.5px solid ${darkMode ? '#6366f1' : '#e0e7ef'}`,
                        borderRadius: "999px",
                        padding: "0.25rem 0.7rem 0.25rem 0.4rem",
                        boxShadow: darkMode ? "0 2px 8px #0004" : "0 2px 8px #6366f122",
                        cursor: "pointer",
                        fontSize: 16,
                        transition: "background 0.3s, border 0.3s"
                    }}
                >
                    <span style={{ fontSize: 18, marginRight: 6, color: darkMode ? "#facc15" : "#6366f1", transition: "color 0.3s" }}>
                        {darkMode ? "\u2600" : "\u263E"}
                    </span>
                    <motion.span
                        layout
                        style={{
                            width: 32,
                            height: 18,
                            borderRadius: 999,
                            background: darkMode ? "#6366f1" : "#e0e7ef",
                            display: "inline-block",
                            position: "relative",
                            marginRight: 6,
                            transition: "background 0.3s"
                        }}
                    >
                        <motion.span
                            layout
                            initial={false}
                            animate={{
                                x: darkMode ? 14 : 0,
                                background: darkMode ? "#facc15" : "#6366f1"
                            }}
                            style={{
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                position: "absolute",
                                top: 1,
                                left: 1,
                                boxShadow: "0 1px 4px #0002",
                                transition: "background 0.3s"
                            }}
                        />
                    </motion.span>
                    <span style={{ fontSize: 13, color: darkMode ? "#f3f4f6" : "#232334", fontWeight: 600, letterSpacing: 0.2 }}>
                        {darkMode ? "Light" : "Dark"}
                    </span>
                </motion.button>
            )}
            <AnimatePresence mode="wait">
            {formInput ? (
                <motion.form
                    key="form"
                    onSubmit={submit}
                    className={styles.form}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.5rem",
                        background: cardBg,
                        padding: "min(6vw,2.5rem) min(6vw,2.5rem)",
                        borderRadius: "1.5rem",
                        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
                        minWidth: 240,
                        maxWidth: 520,
                        width: "100%",
                        margin: "0 auto",
                        backdropFilter: "blur(12px)",
                        border: cardBorder,
                        fontFamily: 'Poppins, Inter, sans-serif',
                        color: textColor,
                        transition: "background 0.3s, color 0.3s, border 0.3s"
                    }}
                >
                    <h2 style={{ marginBottom: "1.2rem", color: darkMode ? '#fff' : '#000', fontWeight: 700, fontSize: 14, textAlign: "center", letterSpacing: 0.5, textShadow: headingShadow }}>
                        Enter Your Marks
                    </h2>
                    {subjects.map((subject, i) => (
                        <motion.div
                            key={subject}
                            custom={i}
                            variants={inputVariants}
                            initial="hidden"
                            animate="visible"
                            style={{ marginBottom: "0.5rem", width: "100%" }}
                        >
                            <label style={{ display: "block", marginBottom: "0.3rem", fontWeight: 600, fontSize: 12, color: textColor, letterSpacing: 0.2 }}>
                                {subject}
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={marks[subject] || ""}
                                onChange={(e) => handleMarkChange(subject, e.target.value)}
                                className={styles.input}
                                placeholder="Enter your marks"
                                style={{
                                    width: "100%",
                                    color: inputText,
                                    background: inputBg,
                                    padding: "0.7rem 1rem",
                                    border: inputBorder,
                                    borderRadius: "8px",
                                    fontSize: 12,
                                    fontWeight: 500,
                                    outline: "none",
                                    boxShadow: "0 1px 4px 0 rgba(31,38,135,0.06)",
                                    transition: "border 0.2s, box-shadow 0.2s, background 0.3s, color 0.3s"
                                }}
                            />
                        </motion.div>
                    ))}
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.04, boxShadow: darkMode ? "0 0 24px 2px #facc15" : "0 0 16px 2px #6366f1" }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                            padding: "0.8rem 1.2rem",
                            background: darkMode ? "linear-gradient(90deg,#232334,#6366f1,#facc15)" : "linear-gradient(90deg,#6366f1,#818cf8,#a5b4fc)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontWeight: 700,
                            fontSize: 12,
                            marginTop: 10,
                            cursor: "pointer",
                            boxShadow: darkMode ? "0 2px 8px #23233488" : "0 2px 8px rgba(99,102,241,0.15)",
                            transition: "box-shadow 0.2s, background 0.2s"
                        }}
                    >
                        Submit Marks
                    </motion.button>
                </motion.form>
            ) : null}
            </AnimatePresence>
            {!formInput && (
                <>
                    <h1 className={styles.heading} style={{ marginBottom: "1.5rem", color: textColor, marginTop: 80 }}>
                        Matches
                    </h1>
                    {showMatches ? (
                        matches.length > 0 ? (
                            <ListView users={matches} chatCallback={handleChat} />
                        ) : (
                            <p>No matches found.</p>
                        )
                    ) : (
                        <p>Loading matches...</p>
                    )}
                    <div style={{
                        position: "absolute",
                        top: 0,
                        left: peer === null ? "-100%" : "0%",
                        width: "25%",
                        minWidth: "20em",
                        height: "100vh",
                        transition: "all 0.75s cubic-bezier(0.16, 1, 0.3, 1)",
                        boxShadow: "9px -1px 16px -6px rgba(0,0,0,0.42)",
                        zIndex: 1,
                    }}>
                        <ChatView
                            peer={peer}
                            chatHistory={userChatHistoryMap[peer]}
                            key={peer}
                            onMessage={(message) => {
                                setUserChatHistoryMap(prev => ({
                                    ...prev,
                                    [peer]: [...prev[peer], message],
                                }));
                            }}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

export default Dashboard;
