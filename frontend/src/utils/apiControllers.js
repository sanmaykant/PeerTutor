const API_ROOT = "http://localhost:5000";

export const fetchMetrics = async () => {
    try {
        const response = await fetch(`${API_ROOT}/api/user/metrics`, {
            method: "GET",
            headers: {
                auth_token: localStorage.getItem("auth_token")
            },
        });
        const jsonResponse = await response.json();
        return jsonResponse.metrics;
    } catch (e) {
        console.error(e);
    }
}

export const updateMetrics = async (marks) => {
    try {
        const response = await fetch(`${API_ROOT}/api/user/metrics`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                auth_token: localStorage.getItem("auth_token"),
                marks: marks,  // Send the marks directly
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to update metrics.");
        }

        return await response.json();
    } catch (error) {
        console.error("Error in updateMetrics API:", error);
        throw error;  // Rethrow error for the calling code to handle
    }
};

export const postEvents = async (events) => {
    try {
        const response = await fetch(`${API_ROOT}/api/user/events`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                auth_token: localStorage.getItem("auth_token"),
                events: events,  // Send the marks directly
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to add events.");
        }

        return await response.json();
    } catch (error) {
        console.error("Error in updateMetrics API:", error);
        throw error;  // Rethrow error for the calling code to handle
    }
};

export const fetchEvents = async () => {
    try {
        const response = await fetch(`${API_ROOT}/api/user/events`, {
            method: "GET",
            headers: {
                "auth_token": localStorage.getItem("auth_token")
            },
        });
        const data = await response.json();

        if (!data.success) {
            console.log(data)
        }

        const events = data.events.map(
            ({ end, start, title }) => (
                { end: new Date(end), start: new Date(start), title }))
        return events;
    } catch (error) {}
};

export const postRewards = async (rewards) => {
    try {
        const response = await fetch(`${API_ROOT}/api/user/rewards`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                auth_token: localStorage.getItem("auth_token"),
                rewards: rewards,  // Send the marks directly
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to add rewards.");
        }

        return await response.json();
    } catch (error) {
        console.error("Error in postRewards API:", error);
        throw error;  // Rethrow error for the calling code to handle
    }
};

export const fetchRewards = async () => {
    try {
        const response = await fetch(`${API_ROOT}/api/user/rewards`, {
            method: "GET",
            headers: {
                "auth_token": localStorage.getItem("auth_token")
            },
        });

        const jsonResponse = await response.json();
        if (jsonResponse.success) {
            return jsonResponse.rewards;
        }
    } catch (error) {}
};

export const fetchMatches = async () => {
    try {
        const response = await fetch(`${API_ROOT}/api/user/matches`, {
            method: "GET",
            headers: {
                "auth_token": localStorage.getItem("auth_token")
            },
        });

        const jsonResponse = await response.json();
        if (jsonResponse.success) {
            return jsonResponse.matches;
        }
    } catch (error) {}
}

export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_ROOT}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        const data = await response.json();
        console.log(data);
        if (data.success) {
            localStorage.setItem("auth_token", data.auth_token);
            localStorage.setItem("email", email);

            return "";
        } else {
            return data.message;
        }

    } catch (e) {
        console.log(e);
    }

}

export const signup = async (username, email, password) => {
    const response = await fetch(`${API_ROOT}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
        }),
    });

    const data = await response.json();
    console.log(data);
    if (data.success) {
        localStorage.setItem("auth_token", data.auth_token);
        localStorage.setItem("email", email);

        return "";
    } else {
        return data.message;
    }
}

export const fetchChats = async (user) => {
    try {
        const response = await fetch("http://localhost:5000/api/user/chats", {
            method: "GET",
            headers: {
                "auth_token": localStorage.getItem("auth_token"),
                username: user,
            },
        });
        const chatHistory = await response.json();
        chatHistory.messages = chatHistory.messages.map(
            ({ sender, recipient, ...chat }) => (
                { user: sender, text: chat.message, ...chat }));
        return chatHistory.messages;
    } catch (e) { console.log(e); }
}

export const getLeaderboard = () => {
  return Promise.resolve({
    success: true,
    leaderboard: [
      { rank: 1, username: 'Alice', points: 1250, level: 15, achievements: 8, experience: 1500 },
      { rank: 2, username: 'Bob', points: 1100, level: 12, achievements: 6, experience: 1200 },
      { rank: 3, username: 'Charlie', points: 950, level: 10, achievements: 5, experience: 1000 },
    ],
  });
};

export const getUserGamification = () => {
  return Promise.resolve({
    success: true,
    data: {
      username: 'DemoUser',
      points: 1250,
      level: 15,
      experience: 1450,
      expForNextLevel: 50,
      progressToNextLevel: 75,
      achievements: [
        { name: 'First Session', description: 'Complete your first session', icon: '🎯', points: 50 },
        { name: 'Hour Master', description: 'Study for 1 hour', icon: '⏰', points: 75 },
      ],
    },
  });
};

//Eliminate rewards already claimed
//Show points associated
export const getAvailableRewards = () => {
  return Promise.resolve({
    success: true,
    availableRewards: [
      { name: 'Session Master', description: 'Complete 5 sessions', icon: '📚', points: 200, _id: '1' },
    ],
  });
};

//Add reward to rewards already claimed
//Add points
//Rearrange leaderboard based on new points
export const claimReward = ({ rewardId }) => {
  console.log(`Claimed reward with ID: ${rewardId}`);
  return Promise.resolve({ success: true });
};
