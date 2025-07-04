import { createContext } from "react";
import AchievementManager from "../utils/achievementController.js";

export const AchievementContext = createContext();

export default function AchievementProvider({ children }) {
    const achievementManager = new AchievementManager();

    achievementManager.registerAchievement(
        "Bronze", "For taking the initiative to improve your grades", 20,
        () => true);

    return (
        <AchievementContext.Provider value={{ achievementManager }}>
            {children}
        </AchievementContext.Provider>
    );
}
