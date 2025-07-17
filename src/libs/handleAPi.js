import { baseUrl } from "./baseUrl"

const handleApi = async (path, method, body, navigate) => {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
    };

    // Only add body for non-GET requests
    if (method !== 'GET' && body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${baseUrl}${path}`, options);

    if (response.status === 401) {
        localStorage.removeItem('token')
        if (navigate) {
            navigate('/login')
        }
        return
    }

    const data = await response.json();
    return data;
}

export default handleApi