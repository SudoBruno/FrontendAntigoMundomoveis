export const isAuthenticated = () => localStorage.getItem('userId') !== null;

export const Expedition = () => localStorage.getItem('access_level') == 3;

export const Cover = () => localStorage.getItem('access_level') == 5;
