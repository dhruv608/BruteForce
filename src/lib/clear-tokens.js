// Run this in browser console to clear all authentication tokens
// Copy and paste this into your browser's developer console

localStorage.removeItem('accessToken');
document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
console.log('All authentication tokens cleared!');
