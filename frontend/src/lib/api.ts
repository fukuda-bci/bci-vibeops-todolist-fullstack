import axios from 'axios';

let baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// If baseURL is just a hostname (no protocol), assume HTTPS and append /api
if (baseURL && !baseURL.startsWith('http')) {
    baseURL = `https://${baseURL}/api`;
}

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Removed interceptors as auth is no longer required

export default api;
