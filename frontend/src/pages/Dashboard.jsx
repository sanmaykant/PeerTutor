import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../providers/AuthProvider.jsx";

import {
    updateMetrics,
    fetchMatches,
    fetchChats
} from "../utils/apiControllers.js";

import ListView from "../components/ListView";
import ChatView from "../components/ChatView.jsx";

import styles from "./styles/Dashboard.module.scss";
import { User } from "lucide-react";


const subjects = [
    "Operating System",
    "Computer Architecture",
    "Database Management",
    "Software Engineering",
    "Computer Networks"
];

function Dashboard() {
    const { metrics } = useContext(AuthContext);
    const [matches, setMatches] = useState([]);
    const [showMatches, setShowMatches] = useState(false);
    const [userChatHistoryMap, setUserChatHistoryMap] = useState({});
    const [peer, setPeer] = useState(null);
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
            console.log("Backend response:", response);

            if (response && response.status === 200) {
                const newMatches = await fetchMatches();
                console.log("await matches");
                setMatches(newMatches);
                console.log("new matches");
                setShowMatches(true);
            }
            window.location.reload();
        } catch (error) {
            console.error("Error submitting marks:", error);
            alert("Fail!");
        }
    };


  return (
    <div
        className={styles.mainContainer}
        style={{
          padding: "2rem",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          position: "relative", 
        }}
        onClick={() => { if (peer !== null) setPeer(null); }}
      >
      {formInput ? (
        <form onSubmit={submit} className={styles.form} style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          backgroundColor: "#fff",
          padding: "1.5rem",
          borderRadius: "6px",
        }}>
          <h2 className={styles.formTitle} style={{ marginBottom: "1rem", color: "#333" }}>
            Enter Your Marks
          </h2>
          {subjects.map((subject) => (
            <div key={subject} style={{ marginBottom: "1rem" }}>
              <label className={styles.label} style={{ display: "block", marginBottom: "0.5rem" }}>
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
                  color: "#000",
                  backgroundColor: "#fff",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>
          ))}
          <button type="submit" style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: "#000000",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}>
            Submit Marks
          </button>
        </form>
      ) : (
        <>
          <h1 className={styles.heading} style={{ marginBottom: "1.5rem", color: "#333" }}>
            Matches
          </h1>
          {showMatches ? (
            matches.length > 0 ? (
              <ListView users={matches} chatCallback={handleChat}/>
            ) : (
              <p>No matches found.</p>
            )
          ) : (
            <p>Loading matches...</p>
          )}
          <a href="/profile" className={styles.user} style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            textDecoration: "none",
            color: "#007bff",
          }}>
            <User className={styles.icon} style={{ width: "24px", height: "24px" }} />
          </a>
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
