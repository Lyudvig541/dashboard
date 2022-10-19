import axios from "axios";

const headers = {
    'Access-Control-Allow-Origin': process.env.REACT_APP_API_SERVER,
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'token': localStorage.getItem('token'),
};
/**
 * get currencies
 * @returns {Promise<AxiosResponse<any>>}
 */
export const index = async () => {
    return await axios.get(process.env.REACT_APP_API_SERVER + "/currencies",{
        headers: headers
    }).then((response) => {
        return response.data;
    }).catch(error => {
        console.log(error.message);
    })
}
/**
 * create currency
 * @param data
 * @param setError
 * @returns {Promise<AxiosResponse<any>>}
 */
export const create = async (data, setError) => {
    return await axios.post(process.env.REACT_APP_API_SERVER + "/currencies/create", {
        name: data.name,
        code: data.code,
        limit: data.limit,
        chips: data.chips,
        is_default: 0,
    },{
        headers: headers
    }).then((response) => {
        setError('');
        return response.data;
    }).catch(() => {
        if(data.name && data.code){
            setError('Currency already exists');
        }else{
            setError('Name and code field is required');
        }
    })
}
/**
 * get currency by id
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const edit = async (id) => {
    return await axios.get(`${process.env.REACT_APP_API_SERVER}/currencies/find/${id}`,{
        headers: headers
    }).then((response) => {
        return response.data;
    }).catch(error => {
        console.log(error.message);
    })
}
/**
 * update currency
 * @param id
 * @param name
 * @param code
 * @param is_default
 * @returns {Promise<AxiosResponse<any>>}
 */
export const update = async (id,data) => {
    return await axios.post(`${process.env.REACT_APP_API_SERVER}/currencies/update/${id}`,{
        name: data.name,
        code: data.code,
        limit: data.limit,
        chips: data.chips,
    },{
        headers: headers
    }).then((response) => {
        return response.data;
    }).catch(error => {
        console.log(error.message);
    })
}
/**
 * delete currency
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const destroy = async (id,setMessage) => {
    return await axios.get(`${process.env.REACT_APP_API_SERVER}/currencies/delete/${id}`,{
        headers: headers
    }).then((response) => {
        setMessage(response.data)
        return response.data;
    }).catch(error => {
        console.log(error.message);
    })
}
/**
 * change default currency
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const changeDefaultCurrency = async (id) => {
    return await axios.post(process.env.REACT_APP_API_SERVER + "/currencies/change-default-currency", {
        id
    },{
        headers: headers
    }).then((response) => {
        return response.data;
    }).catch(error => {
        console.log(error.message);
    })
}