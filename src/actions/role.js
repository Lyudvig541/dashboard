import axios from "axios";

const headers = {
    'Access-Control-Allow-Origin': process.env.REACT_APP_API_SERVER,
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'token': localStorage.getItem('token'),
};

export const getPermissions = async () => {
    return await axios.get(process.env.REACT_APP_API_SERVER + "/role/permissions", {
        headers: headers
    }).then((response) => {
        return response.data;
    }).catch(error => {
        console.log(error.message);
    })
}

export const getRoles = async () => {
    return await axios.get(process.env.REACT_APP_API_SERVER + "/role", {
        headers: headers
    }).then((response) => {
        return response.data;
    }).catch(error => {
        console.log(error.message);
    })
}
export const createRole = async (new_permission, setError, setAddUserForm) => {
    return await axios.post(process.env.REACT_APP_API_SERVER + "/role/create", {
        name: new_permission.name,
        slug: new_permission.slug,
        permissions: new_permission.permissions
    },{
        headers: headers
    }).then((response) => {
        setAddUserForm(false);
        setError('');
        return response.data;
    }).catch(error => {
        if(new_permission.slug){
            setError('Permission already exist');
        }else{
            setError('Slug field is required');
        }
        console.log(error.message);
    })
}
export const getRole = async (id) => {
    return await axios.get(process.env.REACT_APP_API_SERVER + "/role/find/"+id, {
        headers: headers
    }).then((response) => {
        return response.data;
    }).catch(error => {
        console.log(error.message);
    })
}

export const editRole = async (id,data,setError,setEditUserForm) => {
    return await axios.post(process.env.REACT_APP_API_SERVER + "/role/update/" + id, data,{
        headers: headers
    }).then((response) => {
        setEditUserForm(false)
        return response.data;
    }).catch(error => {
        setError(error.message);
    })
}
export const deleteRole = async (id,setDeleteMessage) => {

    return await axios.get(process.env.REACT_APP_API_SERVER + "/role/delete/" + id, {
        headers: headers
    }).then((response) => {
        setDeleteMessage('Role deleted');
        return response.data;
    }).catch(error => {
        setDeleteMessage(error.message);
    })
}