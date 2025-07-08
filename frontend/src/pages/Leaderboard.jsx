import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../providers/AuthProvider';
import { AchievementContext } from "../providers/AchievementProvider";
import {
  getLeaderboard,
  getUserGamification,
  claimReward,
  getAvailableRewards,
} from '../utils/apiControllers';
import styles from './styles/Leaderboard.module.scss';
import { Trophy, Star, Gift, Shield } from 'lucide-react';
import BackButton from '../components/BackButton';

const Leaderboard = () => {
  const { user } = useAuth();
  const { achievementManager } = useContext(AchievementContext);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userData, setUserData] = useState(null);
  const [availableRewards, setAvailableRewards] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('achievements');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchData();
    // Check for system dark mode preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mediaQuery.matches);
    
    const handleChange = (e) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const fetchData = async () => {
      setLoading(true);
      setAvailableRewards(achievementManager.getPendingRewardClaims());
      setAchievements(achievementManager.getAchievements());
      setUserData({
        username: user?.username || 'User',
        points: achievementManager.points,
      });
      setLoading(false);
  };

  const handleClaimReward = async (reward) => {
    achievementManager.claimReward(reward.name);
    setAvailableRewards(achievementManager.getPendingRewardClaims());
    setUserData(prev => ({ ...prev, points: achievementManager.points }));
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const getLevelColor = (level) => {
    if (level >= 20) return styles.purple;
    if (level >= 15) return styles.red;
    if (level >= 10) return styles.orange;
    if (level >= 5) return styles.yellow;
    return styles.green;
  };

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  return (
    <div className={styles.leaderboardPage}>
      <BackButton />
      <div className={`${styles.container} ${darkMode ? styles.darkMode : ''}`}>
        <div className={styles.header}>
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={styles.title}>
            🏆 Leaderboard
          </motion.h1>
          <p className={styles.subtitle}>Compete with your peers and earn exciting rewards!</p>
        </div>

        {userData && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={styles.userCard}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>{userData?.username?.charAt(0).toUpperCase()}</div>
              <div>
                <h3 className={styles.username}>{userData.username}</h3>
                <p className={styles.userStats}>Level {Math.ceil(Math.sqrt(achievementManager.points) / 5)} • {userData.points} points</p>
              </div>
            </div>
            <div className={styles.userPoints}>{userData.points} pts</div>
          </motion.div>
        )}

        <div className={styles.tabButtons}>
          {[ 'achievements', 'rewards'].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
            >
              { tab === 'achievements' ? '🎖️ Achievements' : '🎁 Rewards'}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'leaderboard' && (
            <motion.div key="leaderboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.card}>
              <div className={styles.leaderboardList}>
                {leaderboard.map((user, index) => (
                  <motion.div
                    key={user.username}
                    className={`${styles.leaderboardRow} ${
                      index === 0 ? styles.gold : ''
                    } ${
                      index === 1 ? styles.silver : ''
                    } ${
                      index === 2 ? styles.bronze : ''
                    } ${
                      user.username === userData?.username ? styles.currentUser : ''
                    }`}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    layout
                  >
                    <div className={styles.rank}>
                      <span>{user.rank}</span>
                    </div>
                    <div className={styles.player}>
                      <div className={styles.avatar}>
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className={styles.playerInfo}>
                        <span className={styles.username}>{user.username}</span>
                        <div className={styles.level}>
                          <span>Level {user.level}</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.stats}>
                      <div className={styles.stat}>
                        <Trophy size={18} />
                        <span>{user.totalScore || user.points}</span>
                      </div>
                      <div className={styles.stat}>
                        <Star size={18} />
                        <span>{user.achievements}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div key="achievements" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.card}>
              {achievements.map((ach, i) => (
                <div key={`${ach.name}-${i}`} className={styles.achievementCard}>
                  <h3>{ach.name}</h3>
                  <p>{ach.description}</p>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'rewards' && (
            <motion.div key="rewards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.card}>
              {availableRewards.length ? (
                availableRewards.map((reward, i) => (
                  <div key={`${reward.name}-${i}`} className={styles.rewardCard}>
                    <h3>{reward.name}</h3>
                    <p>{reward.description}</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleClaimReward(reward)}
                      className={styles.claimButton}
                    >
                      Claim +{reward.points} points
                    </motion.button>
                  </div>
                ))
              ) : (
                <div className={styles.noRewards}>No rewards available now. Keep engaging!</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Leaderboard;
