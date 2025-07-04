import React, { useState } from "react";
import { useNavigate } from "react-router";
import styles from "./styles/ListView.module.scss";
import { ChevronRight, MessageSquare, Phone } from "lucide-react";

const ListView = ({ users, chatCallback=() => {} }) => {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className={styles.listContainer}>
      {users.map((user, index) => {
        const isExpanded = expandedIndex === index;
        return (
          <div
            key={index}
            className={`${styles.card} ${styles.cardHover}`}
          >
            <div
              className={styles.summary}
              onClick={() => toggleExpand(index)}
            >
              <div>
                <h3 className={styles.username}>{user.username}</h3>
                <p className={styles.email}>{user.email}</p>
                <p className={styles.university}>{user.university}</p>
              </div>
              <div>
              <MessageSquare
                style={{ marginRight: "1em" }}
                onClick={(e) => {
                    e.stopPropagation();
                    chatCallback(user.username);
                }}
              />
              <Phone
                style={{ marginRight: "1em" }}
                onClick={(e) => {
                    e.stopPropagation();
                    // checkFirstMeet();

                    // let meetingMap = JSON.parse(localStorage.getItem("meetingMap") || "{}");

                    // if (!meetingMap[user.username]) {
                    //   checkNewMatchMaker();
                    //   meetingMap[user.username] = 0;
                    // }

                    //   meetingMap[user.username]++;

                    //   if (!(meetingMap[user.username]==1))
                    //   {
                    //     checkConsistentConnector();
                    //   }

                    //   console.log(meetingMap);

                    //   localStorage.setItem("meetingMap", JSON.stringify(meetingMap));

                    // if (meetingMap[user.username]>=5)
                    // {
                    //   checkGold();
                    // }
                      
                    navigate(`/meet/${user.username}`);
                }}
              />
              <ChevronRight
                className={`${styles.icon} ${isExpanded ? styles.rotate : ""}`}
              />
            </div>
            </div>
            <div className={
                `${styles.details} ${isExpanded ? styles.expanded : ""}`}>
              <div className={styles.section}>
                <strong>Strengths:</strong>
                <ul>
                  {user.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.section}>
                <strong>Weaknesses:</strong>
                <ul>
                  {user.weaknesses.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListView;
