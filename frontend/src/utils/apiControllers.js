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

export const updateUser = async (userData) => {
    try {
        const response = await fetch(`${API_ROOT}/api/user/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth_token": localStorage.getItem("auth_token"),
            },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            throw new Error('Failed to update user');
        }
        return await response.json();
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

export const uploadProfilePhoto = async (file) => {
    try {
        const formData = new FormData();
        formData.append('profileImage', file);

        const response = await fetch(`${API_ROOT}/api/user/upload-photo`, {
            method: 'POST',
            headers: {
                "auth_token": localStorage.getItem("auth_token"),
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload profile photo');
        }
        return await response.json();
    } catch (error) {
        console.error('Error uploading profile photo:', error);
        throw error;
    }
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

// Gamification API functions
export const getLeaderboard = async () => {
    try {
        const response = await fetch(`${API_ROOT}/api/gamification/leaderboard`, {
            method: "GET",
            headers: {
                "auth_token": localStorage.getItem("auth_token")
            },
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        throw error;
    }
};

export const getUserGamification = async () => {
    try {
        const response = await fetch(`${API_ROOT}/api/gamification/user`, {
            method: "GET",
            headers: {
                "auth_token": localStorage.getItem("auth_token")
            },
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching user gamification:", error);
        throw error;
    }
};

export const awardPoints = async (points, experience, reason) => {
    try {
        const response = await fetch(`${API_ROOT}/api/gamification/award`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth_token": localStorage.getItem("auth_token")
            },
            body: JSON.stringify({
                points,
                experience,
                reason
            }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error awarding points:", error);
        throw error;
    }
};

export const completeSession = async (duration, subjects, studentsHelped) => {
    try {
        const response = await fetch(`${API_ROOT}/api/gamification/session/complete`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth_token": localStorage.getItem("auth_token")
            },
            body: JSON.stringify({
                duration,
                subjects,
                studentsHelped
            }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error completing session:", error);
        throw error;
    }
};

export const claimReward = async (rewardId) => {
    try {
        const response = await fetch(`${API_ROOT}/api/gamification/reward/claim`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth_token": localStorage.getItem("auth_token")
            },
            body: JSON.stringify({
                rewardId
            }),
        });
        return await response.json();
    } catch (error) {
        console.error("Error claiming reward:", error);
        throw error;
    }
};

export const getAvailableRewards = async () => {
    try {
        const response = await fetch(`${API_ROOT}/api/gamification/rewards/available`, {
            method: "GET",
            headers: {
                "auth_token": localStorage.getItem("auth_token")
            },
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching available rewards:", error);
        throw error;
    }
};

export const trackChatActivity = async (messageCount = 1) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_ROOT}/gamification/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ messageCount })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error tracking chat activity:', error);
        throw error;
    }
};

export const trackCallActivity = async (duration, callType = 'video') => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_ROOT}/gamification/call`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ duration, callType })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error tracking call activity:', error);
        throw error;
    }
};
