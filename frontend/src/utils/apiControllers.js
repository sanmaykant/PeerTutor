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
