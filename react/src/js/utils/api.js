function jsonRequest(endpoint, data, method = 'POST') {
    return fetch(process.env.REACT_APP_FLASK_URL + endpoint, {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json())
        .then(response => {
            if (response.response_code === 200) {
                return Promise.resolve(response);
            } else {
                return Promise.reject(response);
            }
        });
}

export function getUserInfo(user_token) {
    const data = { user_token };
    return jsonRequest('/api/get_user_info/', data);
}
