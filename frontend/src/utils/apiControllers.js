export const fetchMetrics = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/user/metrics", {
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
    const response = await fetch("http://localhost:5000/api/user/metrics", {
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
        const response = await fetch("http://localhost:5000/api/user/matches", {
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
