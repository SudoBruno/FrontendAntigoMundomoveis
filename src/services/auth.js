export const isAuthenticated = () => localStorage.getItem('userId') !== null;

export const Expedition = () => localStorage.getItem('acess_level') == 3;
