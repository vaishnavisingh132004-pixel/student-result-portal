
const API = {
    async request(url, options = {}) {
        const token = sessionStorage.getItem("token");

        const headers = {
            ...(options.body ? {
                "Content-Type": "application/json"
            } : {}),
            ...options.headers
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            ...options,
            headers
        });

        const data = await response.json().catch(() => ({}));

        if (response.status === 401) {
            sessionStorage.clear();
            location.href = "login.html";
            throw new Error("Session expired. Please login again.");
        }

        if (!response.ok) {
            throw new Error(data.message || "Request failed");
        }

        return data;
    },

    get(url) {
        return this.request(url);
    },

    post(url, body) {
        return this.request(url, {
            method: "POST",
            body: JSON.stringify(body)
        });
    },

    put(url, body) {
        return this.request(url, {
            method: "PUT",
            body: JSON.stringify(body)
        });
    },

    delete(url) {
        return this.request(url, {
            method: "DELETE"
        });
    }
};

function logout() {
    sessionStorage.clear();
    location.href = "login.html";
}

function requireRole(role) {
    if (sessionStorage.getItem("role") !== role ||
        !sessionStorage.getItem("token")) {
        location.href = "login.html";
        return false;
    }

    return true;
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}
