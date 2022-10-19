import axios from "axios";

const headers = {
    'Access-Control-Allow-Origin': process.env.REACT_APP_API_SERVER,
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'token': localStorage.getItem('token'),
};
export const getRoles = async () => {
    return await axios.get(process.env.REACT_APP_API_SERVER + "/role", {
        headers: headers
    }).then((response) => {
        return response.data;
    }).catch(error => {
        console.log(error.message);
    })
}

export const getUsers = async () => {
    return await axios.get(process.env.REACT_APP_API_SERVER + "/users/", {
        headers: headers
    }).then((response) => {
        return response.data;
    }).catch(error => {
        console.log(error.message);
    })
}
export const getUser = async (id) => {
    return await axios.get(process.env.REACT_APP_API_SERVER + "/users/find/"+id, {
        headers: headers
    }).then((response) => {
        return response.data;
    }).catch(error => {
        console.log(error.message);
    })
}

export const createUser = async (data,setError,setAddUserForm) => {
    if(data.password !== data.confirmPassword ){
       return  setError("Confirm Password not valid")
    }
    return await axios.post(process.env.REACT_APP_API_SERVER + "/users/create", data,{
        headers: headers
    }).then((response) => {
        setAddUserForm(false)
        return response.data;
    }).catch(error => {
        setError(error.message);
    })
}
export const editUser = async (id,data,setError,setEditUserForm) => {
    return await axios.post(process.env.REACT_APP_API_SERVER + "/users/update/" + id, data,{
        headers: headers
    }).then((response) => {
        setEditUserForm(false)
        return response.data;
    }).catch(error => {
        setError(error.message);
    })
}
export const deleteUser = async (id,setDeleteMessage) => {

    return await axios.get(process.env.REACT_APP_API_SERVER + "/users/delete/" + id, {
        headers: headers
    }).then((response) => {
        setDeleteMessage(response.data);
        return response.data;
    }).catch(error => {
        setDeleteMessage(error.message);
    })
}