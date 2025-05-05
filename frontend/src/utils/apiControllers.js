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

export const updateMetrics = async (strengths, weaknesses) => {
    const response = await fetch(`${API_ROOT}/api/user/metrics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            auth_token: localStorage.getItem("auth_token"),
            strengths: strengths,
            weaknesses: weaknesses,
        })
    });

    const jsonResponse = await response.json();
    if (!jsonResponse.success) {
        console.log("success");
    } else {
        console.log("fail");
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
