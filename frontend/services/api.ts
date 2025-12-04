const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchApi<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
}

// Auth services
export const authService = {
    login: async (email: string, password: string) => {
        return fetchApi("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
    },
    logout: async () => {
        return fetchApi("/auth/logout", { method: "POST" });
    },
};
