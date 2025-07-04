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

let rewardsClaimed=[];

let totalPoints=0;

export const checkBronze = () => {
    if (!rewardsClaimed.includes("Bronze"))
    {
        const bronzeReward = allRewards.find(r => r.reward === "Bronze");
        if (bronzeReward) {
        totalPoints += bronzeReward.points;
        }
    }
    return totalPoints;
};

export const checkSilver = () => {
    if(!rewardsClaimed.includes("Silver"))
    {
        const silverReward = allRewards.find(r => r.reward === "Silver");
        if (silverReward) {
        totalPoints += silverReward.points;
        }
    }
};

export const checkGold = () => {
    if(!rewardsClaimed.includes("Gold"))
    {
        const GoldReward = allRewards.find(r => r.reward === "Gold");
        if (GoldReward) {
        totalPoints += GoldReward.points;
        }
    }
};

export const checkFirstMeet = () => {
    if(!rewardsClaimed.includes("First Meet"))
    {
        const checkFirstMeetReward = allRewards.find(r => r.reward === "First Meet");
        if (checkFirstMeetReward) {
        totalPoints += checkFirstMeetReward.points;
        }
    }
}

export const checkNewMatchMaker = () => {
        const checkNewMatchMaker = allRewards.find(r => r.reward === "New Match Maker");
        if (checkNewMatchMaker) {
        totalPoints += checkNewMatchMaker.points;
        }
}

export const checkConsistentConnector = () => {
        const checkConsistentConnector = allRewards.find(r => r.reward === "Consistent Connector");
        if (checkConsistentConnector) {
        totalPoints += checkConsistentConnector.points;
        }
}