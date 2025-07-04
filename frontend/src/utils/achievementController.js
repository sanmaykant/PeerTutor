export default class AchievementManager {
    constructor() {
        this.registeredAchievements = []
        this.pendingAchievementClaims = []
        this.claimedAchievements = []
        this.registeredRewards = []
        this.pendingRewardClaims = []
        this.points = 0

        this.loadState();
        console.log(this);
    }

    registerAchievement(
        achievementName,
        achievementDescription,
        achievementPoints,
        achievementResolver,
    ) {
        if (this.registeredAchievements.find(
            achievement => achievement.name === achievementName)) {
            throw new Error("Achievement already registered");
        }

        this.registeredAchievements.push({
            name: achievementName,
            points: achievementPoints,
            description: achievementDescription,
            resolver: achievementResolver,
        });
        return this;
    }

    registerReward(
        rewardName,
        rewardDescription,
        rewardPoints,
        rewardResolver,
    ) {
        if (this.registeredRewards.find(reward => reward.name === rewardName))
            throw new Error("Rewards already registered");

        this.registeredRewards.push({
            name: rewardName,
            description: rewardDescription,
            points: rewardPoints,
            resolver: rewardResolver,
        });
        return this;
    }

    resolveAchievement(achievementName, ...args) {
        if (this.claimedAchievements.includes(achievementName) ||
            this.pendingAchievementClaims.includes(achievementName))
                return;

        let achievement = this.registeredAchievements.find(
            achievement => achievement.name === achievementName);
        if (!achievement)
            throw new Error(`Achievement "${achievementName}" not registered`);

        if (achievement.resolver(...args)) {
            this.pendingAchievementClaims.push(achievement.name);
            this.points += achievement.points;
        }
        console.log(this.points);
        this.saveState();
    }

    resolveReward(rewardName, ...args) {
        let reward = this.registeredRewards.find(reward => reward.name === rewardName)
        if (!reward)
            throw new Error(`Reward "${rewardName} not registered`);
        if (reward.resolver(...args)) {
            this.pendingRewardClaims.push(rewardName);
            this.points += reward.points;
        }
        this.saveState();
        console.log(this);
    }

    saveState() {
        localStorage.setItem("state", JSON.stringify({
            claimedAchievements: this.claimedAchievements,
            pendingAchievementClaims: this.pendingAchievementClaims,
            pendingRewardClaims: this.pendingRewardClaims,
            points: this.points,
        }));
    }

    loadState() {
        let state = JSON.parse(localStorage.getItem("state") || `{
            "claimedAchievements": [],
            "pendingAchievementClaims": [],
            "pendingRewardClaims": [],
            "points": 0
        }`);

        this.claimedAchievements = state.claimedAchievements;
        this.pendingAchievementClaims = state.pendingAchievementClaims;
        this.pendingRewardClaims = state.pendingRewardClaims;
        this.points = state.points;
    }
}
