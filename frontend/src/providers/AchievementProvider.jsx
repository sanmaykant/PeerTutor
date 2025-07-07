import { createContext } from "react";
import AchievementManager from "../utils/achievementController.js";

export const AchievementContext = createContext();

export default function AchievementProvider({ children }) {
    const achievementManager = new AchievementManager();

    achievementManager.registerAchievement(
        "Bronze", "For taking the initiative to improve your grades", 20,
        () => true
    ).registerAchievement(
        "Silver", "Start first chat with match", 50, () => true
    ).registerAchievement(
        "First Meet", "Attend your first meeting", 60, (meetHistory) => {
            if (Object.keys(meetHistory).length > 0)
                return true;
            return false;
        }
    ).registerReward(
        "Gold", "5 meetings with one match", 100, (meetHistory, username) => {
            if (meetHistory[username] === 5)
                return true;
            return false;
        }
    ).registerReward(
        "Consistent Connector", "Points per meeting", 10, (meetHistory, username) => {
            if (meetHistory[username] > 1) {
                return true;
            }
            return false;
        }
    ).registerReward(
        "New Match Maker", "Meetings with new matches", 5,
        (meetHistory, username) => {
            if (meetHistory[username] === 1)
                return true;
            return false;
        }
    );

    return (
        <AchievementContext.Provider value={{ achievementManager }}>
            {children}
        </AchievementContext.Provider>
    );
}
