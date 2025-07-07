import React, { useState, useContext, useCallback, memo } from "react";
import { AchievementContext } from "../providers/AchievementProvider";
import { useNavigate } from "react-router";
import styles from "./styles/ListView.module.scss";
import { MessageSquare, Phone, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const ListView = memo(({ users, chatCallback = () => {} }) => {
  const navigate = useNavigate();
  const { achievementManager } = useContext(AchievementContext);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null);

  const toggleExpand = useCallback((userId) => {
    setExpandedUserId(prev => prev === userId ? null : userId);
  }, []);

  const handleChat = useCallback((e, username) => {
    e.stopPropagation();
    chatCallback(username);
  }, [chatCallback]);

  const handleCall = useCallback((e, username) => {
    e.stopPropagation();

    let meetHistory = JSON.parse(localStorage.getItem("meetHistory") || "{}");
    if (!meetHistory[username]) {
      meetHistory[username] = 0;
    }

    meetHistory[username]++;
    console.log(meetHistory);
    localStorage.setItem("meetHistory", JSON.stringify(meetHistory));

    achievementManager.resolveAchievement(
        "First Meet", meetHistory);
    achievementManager.resolveReward(
        "Gold", meetHistory, username);
    achievementManager.resolveReward("Consistent Connector", meetHistory, username);
    achievementManager.resolveReward(
        "New Match Maker", meetHistory, username);

    navigate(`/meet/${username}`);
  }, [navigate]);

  return (
    <div className={`${styles.container} ${styles.animatedBackground}`}>
      <div className={styles.grid}>
        {users.map((user, index) => {
          const isExpanded = expandedUserId === user.username;

          return (
            <div key={user.username || index} className={styles.card}>
              <div 
                className={styles.cardHeader} 
                onClick={() => toggleExpand(user.username)} 
                style={{ cursor: "pointer" }}
              >
                <div className={styles.userInfo}>
                  <img
                    src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user.username}`}
                    alt="avatar"
                    className={styles.avatar}
                  />
                  <div>
                    <h3 className={styles.username}>{user.username}</h3>
                    <p className={styles.university}>{user.university}</p>
                  </div>
                </div>

                <div className={styles.actions}>
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className={styles.iconWrapper}
                  >
                    <MessageSquare
                      className={styles.icon}
                      onClick={(e) => handleChat(e, user.username)}
                    />
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={styles.iconWrapper}
                  >
                    <Phone
                      className={styles.icon}
                      onClick={(e) => handleCall(e, user.username)}
                    />
                  </motion.div>

                  <ChevronRight 
                    className={`${styles.chevron} ${isExpanded ? styles.rotate : ''}`}
                  />
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    className={styles.cardDetails}
                    key="details"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className={styles.section}>
                      <div className={styles.sectionHeader}>
                        <span className={styles.strengthLabel}>Strengths</span>
                      </div>
                      <ul className={styles.strengthList}>
                        {user.strengths?.length > 0 ? (
                          user.strengths.map((s, i) => (
                            <li key={i} className={styles.strengthItem}>{s}</li>
                          ))
                        ) : (
                          <li className={styles.noData}>No strengths listed</li>
                        )}
                      </ul>
                    </div>

                    <div className={styles.section}>
                      <div className={styles.sectionHeader}>
                        <span className={styles.weaknessLabel}>Weaknesses</span>
                      </div>
                      <ul className={styles.weaknessList}>
                        {user.weaknesses?.length > 0 ? (
                          user.weaknesses.map((w, i) => (
                            <li key={i} className={styles.weaknessItem}>{w}</li>
                          ))
                        ) : (
                          <li className={styles.noData}>No weaknesses listed</li>
                        )}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          );
        })}
      </div>
    </div>
  );
});

ListView.displayName = 'ListView';
export default ListView;
