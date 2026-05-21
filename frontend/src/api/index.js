const API_URL = 'http://localhost:5000/api';

    const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
        };
    }
    return { 'Content-Type': 'application/json' };
    };

    export const register = async (username, password) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    return response.json();
    };

    export const login = async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });
    return response.json();
    };

    // New: Get current user data
    export const getMe = async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return response.json();
    };

    // New: Update user password
    // export const updatePassword = async (currentPassword, newPassword) => {
    // const response = await fetch(`${API_URL}/auth/password`, {
    //     method: 'PUT',
    //     headers: getAuthHeaders(),
    //     body: JSON.stringify({ currentPassword, newPassword }),
    // });
    // return response.json();
    // };

    export const getHabits = async () => {
    const response = await fetch(`${API_URL}/habits`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    return response.json();
    };

    export const addHabit = async (name, timeOfDay) => {
    const response = await fetch(`${API_URL}/habits`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, timeOfDay }),
    });
    return response.json();
    };

    export const updateHabit = async (id, name, timeOfDay) => {
    const response = await fetch(`${API_URL}/habits/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name, timeOfDay }),
    });
    return response.json();
    };

    export const deleteHabit = async (id) => {
    const response = await fetch(`${API_URL}/habits/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    return response.json();
    };

    export const completeHabit = async (id) => {
    const response = await fetch(`${API_URL}/habits/${id}/complete`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });
    return response.json();
    };

    export const incompleteHabit = async (id) => {
    const response = await fetch(`${API_URL}/habits/${id}/incomplete`, {
        method: 'POST',
        headers: getAuthHeaders(),
        mode: "cors"
    });
    return response.json();
    };
