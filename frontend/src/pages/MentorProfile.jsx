import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { motion } from "framer-motion";

const API_ROOT = "http://localhost:5000";

const chipColors = [
  "#6366f1", "#f59e42", "#10b981", "#f472b6", "#60a5fa", "#fbbf24", "#34d399", "#818cf8"
];

function MentorProfile() {
  const { username } = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_ROOT}/api/user/profile/${username}`, {
          headers: { "auth_token": localStorage.getItem("auth_token") }
        });
        const data = await res.json();
        setMentor(data.user);
      } catch (e) {
        setMentor(null);
      }
      setLoading(false);
    })();
  }, [username]);

  if (loading) return <div style={{ textAlign: "center", marginTop: 80 }}>Loading...</div>;
  if (!mentor) return <div style={{ textAlign: "center", marginTop: 80 }}>Mentor not found.</div>;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f3f4f6 0%, #e0e7ef 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: 'Poppins, Inter, sans-serif',
      padding: "2rem"
    }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: "1.5rem",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.13)",
          padding: "2.5rem 2.5rem",
          maxWidth: 420,
          width: "100%",
          margin: "0 auto",
          backdropFilter: "blur(12px)",
          border: "1.5px solid rgba(255,255,255,0.25)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem"
        }}
      >
        <img
          src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${mentor.username}`}
          alt="avatar"
          style={{ width: 90, height: 90, borderRadius: "50%", marginBottom: 12, boxShadow: "0 2px 8px #6366f122" }}
        />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 24, color: "#232334", marginBottom: 2 }}>{mentor.username}</div>
          <div style={{ fontSize: 16, color: "#888fa1", fontWeight: 500 }}>{mentor.email}</div>
          {mentor.university && <div style={{ fontSize: 15, color: "#6366f1", marginTop: 2 }}>{mentor.university}</div>}
        </div>
        <div style={{ width: "100%", marginTop: 18 }}>
          <div style={{ fontWeight: 600, fontSize: 16, color: "#232334", marginBottom: 6 }}>Strengths</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
            {(mentor.strengths && mentor.strengths.length > 0) ? mentor.strengths.map((s, i) => (
              <span key={i} style={{
                background: chipColors[i % chipColors.length],
                color: "#fff",
                borderRadius: 999,
                padding: "0.35em 1em",
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: 0.1,
                boxShadow: "0 1px 4px #6366f122"
              }}>{s}</span>
            )) : <span style={{ color: "#aaa" }}>No strengths listed.</span>}
          </div>
          <div style={{ fontWeight: 600, fontSize: 16, color: "#232334", marginBottom: 6 }}>Weaknesses</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(mentor.weaknesses && mentor.weaknesses.length > 0) ? mentor.weaknesses.map((w, i) => (
              <span key={i} style={{
                background: "#fca5a5",
                color: "#fff",
                borderRadius: 999,
                padding: "0.35em 1em",
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: 0.1,
                boxShadow: "0 1px 4px #fca5a522"
              }}>{w}</span>
            )) : <span style={{ color: "#aaa" }}>No weaknesses listed.</span>}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default MentorProfile; 