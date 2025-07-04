import { createContext } from "react";
import AchievementManager from "../utils/achievementController.js";

export const AchievementContext = createContext();

export default function AchievementProvider({ children }) {
    const achievementManager = new AchievementManager();

    achievementManager.registerAchievement(
        "Bronze", "For taking the initiative to improve your grades", 20,
        () => true);

    achievementManager.registerAchievement(
        "Silver", "Start first chat with match", 50, () => true);

    achievementManager.registerAchievement(
        "First Meet", "Attend your first meeting", 60, (meetHistory) => {
            if (Object.keys(meetHistory).length > 0)
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
