import { USERS } from '../config.js';

const STORAGE_KEY = 'holo-card-user';

export function login(username) {
    const user = USERS.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (user) {
        localStorage.setItem(STORAGE_KEY, user.username);
        return true;
    }
    return false;
}

export function logout() {
    localStorage.removeItem(STORAGE_KEY);
}

export function getCurrentUser() {
    const username = localStorage.getItem(STORAGE_KEY);
    if (!username) return null;
    
    return USERS.find(u => u.username === username) || null;
}