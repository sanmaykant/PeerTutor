import React, { useState, useEffect } from 'react';
import { Trophy, Star } from 'lucide-react';
import { AuthContext } from "../providers/AuthProvider.jsx";
import { useContext } from 'react';

import {
  getLeaderboard,
  getUserGamification,
  claimReward,
  getAvailableRewards,
} from '../utils/apiControllers';
import styles from './styles/Leaderboard.module.scss';

const Leaderboard = () => {
const { user } = useContext(AuthContext);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userData, setUserData] = useState(null);
  const [availableRewards, setAvailableRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leaderboardRes, userRes, rewardsRes] = await Promise.all([
          getLeaderboard(),
          getUserGamification(),
          getAvailableRewards(),
        ]);

        if (leaderboardRes.success) setLeaderboard(leaderboardRes.leaderboard);
        if (userRes.success) setUserData(userRes.data);
        if (rewardsRes.success) setAvailableRewards(rewardsRes.availableRewards);
      } catch (error) {
        console.error('Fallback to demo data due to fetch error:', error);
        fallbackData();
      } finally {
        setLoading(false);
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mediaQuery.matches);
    const handler = (e) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);

    fetchData();

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const fallbackData = () => {
    setLeaderboard([
      { rank: 1, username: 'Alice', points: 1250, level: 15, achievements: 8, experience: 1500 },
      { rank: 2, username: 'Bob', points: 1100, level: 12, achievements: 6, experience: 1200 },
      { rank: 3, username: 'Charlie', points: 950, level: 10, achievements: 5, experience: 1000 },
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
      { name: 'Session Master', description: 'Complete 5 sessions', icon: '📚', points: 200, _id: 'demo-id-1' },
    ]);
  };

  const handleClaimReward = async (reward) => {
    try {
      const res = await claimReward({ rewardId: reward._id });
      if (res.success) {
        const userRes = await getUserGamification();
        if (userRes.success) setUserData(userRes.data);
        setAvailableRewards(prev => prev.filter(r => r.name !== reward.name));
        alert(`Claimed ${reward.name} for ${reward.points} points!`);
      }
    } catch (error) {
      console.error('Reward claim failed, fallback:', error);
      setAvailableRewards(prev => prev.filter(r => r.name !== reward.name));
      alert(`Claimed ${reward.name} for ${reward.points} points!`);
    }
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
      <div className={`${styles.container} ${darkMode ? styles.darkMode : ''}`}>
        <header className={styles.header}>
          <h1 className={styles.title}>🏆 Leaderboard</h1>
          <p className={styles.subtitle}>Compete with your peers and earn rewards!</p>
        </header>

        {userData && (
          <section className={styles.userCard}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>{userData.username.charAt(0).toUpperCase()}</div>
              <div>
                <h3 className={styles.username}>{userData.username}</h3>
                <p className={styles.userStats}>Level {userData.level} • {userData.points} pts</p>
              </div>
            </div>
            <div className={styles.progressWrap}>
              <div className={styles.progressBarBg}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${userData.progressToNextLevel || 0}%` }}
                />
              </div>
              <p className={styles.xpInfo}>{userData.expForNextLevel} XP to next level</p>
            </div>
          </section>
        )}

        <div className={styles.tabButtons}>
          {['leaderboard', 'achievements', 'rewards'].map((tab) => (
            <button
              key={tab}
              className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'leaderboard' ? '🏆 Leaderboard' : tab === 'achievements' ? '🎖 Achievements' : '🎁 Rewards'}
            </button>
          ))}
        </div>

        <section className={styles.card}>
          {activeTab === 'leaderboard' && (
            <div className={styles.leaderboardList}>
              {leaderboard.map((user, index) => (
                <div
                  key={user.username}
                  className={`${styles.leaderboardRow} ${user.username === userData?.username ? styles.currentUser : ''}`}
                >
                  <div className={styles.rank}><span>{user.rank}</span></div>
                  <div className={styles.player}>
                    <div className={styles.avatar}>{user.username.charAt(0).toUpperCase()}</div>
                    <div className={styles.playerInfo}>
                      <span className={styles.username}>{user.username}</span>
                      <div className={styles.level}>
                        <span>Level {user.level}</span>
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progress}
                            style={{
                              width: `${(user.experience / ((user.level || 1) * 100)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.stats}>
                    <div className={styles.stat}><Trophy size={16} /> {user.points}</div>
                    <div className={styles.stat}><Star size={16} /> {user.achievements}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className={styles.achievementGrid}>
              {userData.achievements.map((ach, i) => (
                <div key={`${ach.name}-${i}`} className={styles.achievementCard}>
                  <div className={styles.achievementIcon}>{ach.icon}</div>
                  <h3>{ach.name}</h3>
                  <p>{ach.description}</p>
                  <span>+{ach.points} pts</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className={styles.rewardGrid}>
              {availableRewards.length > 0 ? (
                availableRewards.map((reward, i) => (
                  <div key={`${reward.name}-${i}`} className={styles.rewardCard}>
                    <div className={styles.rewardIcon}>{reward.icon}</div>
                    <h3>{reward.name}</h3>
                    <p>{reward.description}</p>
                    <button
                      className={styles.claimButton}
                      onClick={() => handleClaimReward(reward)}
                    >
                      Claim +{reward.points} pts
                    </button>
                  </div>
                ))
              ) : (
                <div className={styles.noRewards}>No rewards available. Keep progressing!</div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Leaderboard;
