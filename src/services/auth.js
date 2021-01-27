export const isAuthenticated = () => localStorage.getItem('userId') !== null;

export const Expedition = () => localStorage.getItem('acess_level') == 3;

export const Cover = () => localStorage.getItem('acess_level') == 5;
