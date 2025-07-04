let allRewards = [
  {
    reward: "Bronze",
    points: 20,
    description: "For taking the initiative to improve your grades"
  },
  {
    reward: "Silver",
    points: 50,
    description: "Start first chat with match"
  },
  {
    reward: "Gold",
    points: 100,
    description: "5 meetings with one match"
  },
  {
    reward: "First Meet",
    points: 60,
    description: "Attend your first meeting"
  },
  {
    reward: "Consistent Connector",
    points: 10,
    description: "Points per meeting"
  },
  {
    reward: "New Match Maker",
    points: 5,
    description: "Meetings with new matches"
  }
];

export default class AchievementManager {
    constructor() {
        this.registeredAchievements = []
        this.pendingAchievementClaims = []
        this.claimedAchievements = []
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

    resolveAchievement(achievementName, ...args) {
        if (this.claimedAchievements.includes(achievementName) ||
            this.pendingAchievementClaims.includes(achievementName))
                return;

        let achievement = this.registeredAchievements.find(
            achievement => achievement.name === achievementName);
        if (achievement.resolver(...args)) {
            this.pendingAchievementClaims.push(achievement.name);
            this.points += achievement.points;
        }
        console.log(this.points);
        this.saveState();
    }

    saveState() {
        localStorage.setItem("state", JSON.stringify({
            claimedAchievements: this.claimedAchievements,
            pendingAchievementClaims: this.pendingAchievementClaims,
            points: this.points,
        }));
    }

    loadState() {
        let state = JSON.parse(localStorage.getItem("state") || `{
            "claimedAchievements": [],
            "pendingAchievementClaims": [],
            "points": 0
        }`);

        this.claimedAchievements = state.claimedAchievements;
        this.pendingAchievementClaims = state.pendingAchievementClaims;
        this.points = state.points;
    }
}
