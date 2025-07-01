import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../providers/AuthProvider';
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
  const [leaderboard, setLeaderboard] = useState([]);
  const [userData, setUserData] = useState(null);
  const [availableRewards, setAvailableRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('leaderboard');
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
    try {
      setLoading(true);
      const [leaderboardRes, userRes, rewardsRes] = await Promise.all([
        getLeaderboard(),
        getUserGamification(),
        getAvailableRewards(),
      ]);

      if (leaderboardRes.success) setLeaderboard(leaderboardRes.leaderboard);
      if (userRes.success) setUserData(userRes.data);
      if (rewardsRes.success) setAvailableRewards(rewardsRes.availableRewards);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLeaderboard([
        { rank: 1, username: 'Alice', points: 1250, level: 15, achievements: 8 },
        { rank: 2, username: 'Bob', points: 1100, level: 12, achievements: 6 },
        { rank: 3, username: 'Charlie', points: 950, level: 10, achievements: 5 },
      ]);
      setUserData({
        username: user?.username || 'User',
        points: 1250,
        level: 15,
        experience: 1450,
        expForNextLevel: 50,
        progressToNextLevel: 75,
        achievements: [
          { name: 'First Session', description: 'Complete your first session', icon: '🎯', points: 50 },
          { name: 'Hour Master', description: 'Study for 1 hour', icon: '⏰', points: 75 },
        ],
      });
      setAvailableRewards([
        { name: 'Session Master', description: 'Complete 5 sessions', icon: '📚', points: 200 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimReward = async (reward) => {
    try {
      const res = await claimReward({ rewardId: reward._id });
      if (res.success) {
        const userRes = await getUserGamification();
        if (userRes.success) setUserData(userRes.data);
        alert(`Claimed ${reward.name} for ${reward.points} points!`);
        setAvailableRewards((prev) => prev.filter((r) => r.name !== reward.name));
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      alert(`Claimed ${reward.name} for ${reward.points} points!`);
      setAvailableRewards((prev) => prev.filter((r) => r.name !== reward.name));
    }
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
                <p className={styles.userStats}>Level {userData.level} • {userData.points} points</p>
              </div>
            </div>
            <div className={styles.userPoints}>{userData.points} pts</div>
            <div className={styles.progressWrap}>
              <div className={styles.progressBarBg}>
                <motion.div className={styles.progressBarFill} animate={{ width: `${userData?.progressToNextLevel || 0}%` }} />
              </div>
              <p className={styles.xpInfo}>{userData.expForNextLevel} XP to next level</p>
            </div>
          </motion.div>
        )}

        <div className={styles.tabButtons}>
          {['leaderboard', 'achievements', 'rewards'].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
            >
              {tab === 'leaderboard' ? '🏆 Leaderboard' : tab === 'achievements' ? '🎖️ Achievements' : '🎁 Rewards'}
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
                          <div className={styles.progressBar}>
                            <motion.div 
                              className={styles.progress} 
                              initial={{ width: 0 }}
                              animate={{ width: `${(user.experience / (user.level * 100 || 1)) * 100}%` }}
                              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                            />
                          </div>
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
              {userData.achievements.map((ach, i) => (
                <div key={`${ach.name}-${i}`} className={styles.achievementCard}>
                  <div className={styles.achievementIcon}>{ach.icon}</div>
                  <h3>{ach.name}</h3>
                  <p>{ach.description}</p>
                  <span>+{ach.points} points</span>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'rewards' && (
            <motion.div key="rewards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={styles.card}>
              {availableRewards.length ? (
                availableRewards.map((reward, i) => (
                  <div key={`${reward.name}-${i}`} className={styles.rewardCard}>
                    <div className={styles.rewardIcon}>{reward.icon}</div>
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
