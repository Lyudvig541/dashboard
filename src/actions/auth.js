import axios from "axios";

export const login = async (username, password, setToken, setError) => {
    return await axios.post(process.env.REACT_APP_API_SERVER + "/auth/login", {
        username, password, headers: {
            'Access-Control-Allow-Origin': process.env.REACT_APP_API_SERVER,
        }
    }).then((response) => {
        localStorage.setItem('token', response.data.access_token);
        setError(null);
        window.location.href = '/';
    }).catch(error => {
        setError(error.message);
    })
}
export const profile = async () => {
    return await axios.get(process.env.REACT_APP_API_SERVER + "/auth/profile", {
        headers: {
            'Access-Control-Allow-Origin': process.env.REACT_APP_API_SERVER,
            'token': localStorage.getItem('token')
        }
    }).then((response) => {
        return response.data;
    }).catch(error => {
        if (error.response.status === 401) {
            localStorage.removeItem('token');
            window.location.href('/login');
        }
    })
}
export const changePassword = async (oldPassword, newPassword, confirmPassword) => {
    return await axios.post(process.env.REACT_APP_API_SERVER + "/auth/change-password", {
        oldPassword,
        newPassword,
        confirmPassword
    }, {
        headers: {
            'Access-Control-Allow-Origin': process.env.REACT_APP_API_SERVER,
            'token': localStorage.getItem('token')
        }
    })
}