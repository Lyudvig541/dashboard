import axios from "axios";
import fileDownload from 'js-file-download'

const headers = {
    'Access-Control-Allow-Origin': process.env.REACT_APP_API_SERVER,
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'token': localStorage.getItem('token'),
};

const handleError = (error) => {
    console.log(error)
}

export const timezoneToMSec = () => {
    return +(localStorage.getItem('timezone')) * 3600000;
}

export const getTransactions = async (field, value, offset, limit, startDate, endDate) => {
    return await axios.post(process.env.REACT_APP_API_SERVER + "/api/transactions", {
        field: field,
        value: value,
        offset: (offset-1)*limit,
        limit: limit,
        startDate: startDate,
        endDate: endDate
    }, {
        headers: headers
    }).then((response) => {
        return response.data;
    }).catch(error => {
        handleError(error);
        console.log(error.message);
    })
}
export const getPendingBets = async () => {
    return await axios.get(process.env.REACT_APP_API_SERVER + "/api/pending-bets", {
        headers: headers
    }).then((response) => {
        return response.data;
    }).catch(error => {
        handleError(error);
        console.log(error.message);
    })
}
export const getCompletedBet = async () => {
    return await axios.get(process.env.REACT_APP_API_SERVER + "/api/completed-bets", {
        headers: headers
    }).then((response) => {
        return response.data;
    }).catch(error => {
        handleError(error);
        console.log(error.message);
    })
}

/**
 * dashboard actions
 */

/**
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getDailyProfit = async (startDate, endDate) => {
    return await axios.post(process.env.REACT_APP_API_SERVER + "/api/daily-profit", {
        startDate, endDate
    }, {
        headers: headers
    }).then((response) => {
        return response.data;
    }).catch(error => {
        handleError(error);
        console.log(error.message);
    })
}
/**
 *
 * @param startDate
 * @param endDate
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getProductSales = async (startDate, endDate) => {
    return await axios.post(process.env.REACT_APP_API_SERVER + "/api/product-sales", {
        startDate,
        endDate
    }, {
        headers: headers
    }).then((response) => {
        return response.data;
    }).catch(error => {
        handleError(error);
        console.log(error.message);
    })
}
/**
 *
 * @param startDate
 * @param endDate
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getNumberOfBets = async (startDate, endDate) => {
    return await axios.post(process.env.REACT_APP_API_SERVER + "/api/number-of-bets", {
        startDate,
        endDate
    }, {
        headers: headers,
    }).then((response) => {
        return response.data;
    }).catch(error => {
        handleError(error);
        console.log(error.message);
    })
}
/**
 * @param startDate
 * @param endDate
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getNumberOfPlayers = async (startDate, endDate) => {
    return await axios.post(process.env.REACT_APP_API_SERVER + "/api/number-of-players", {
        startDate,
        endDate
    }, {
        headers: headers
    }).then((response) => {
        return response.data;
    }).catch(error => {
        handleError(error);
        console.log(error.message);
    })
}

/**
 * @param startDate
 * @param endDate
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getTotalValues = async (startDate, endDate) => {
    return await axios.post(process.env.REACT_APP_API_SERVER + "/api/product-sales-total", {
        startDate,
        endDate
    }, {
        headers: headers
    }).then((response) => {
        return response.data;
    }).catch(error => {
        handleError(error);
        console.log(error);
    })
}

export const download = async () => {
    return await axios.get(process.env.REACT_APP_API_SERVER + "/api/download", {
        headers: headers,
        responseType: 'blob',
    }).then((res) => {
        fileDownload(res.data, "Transaction.xlsx")
    }).catch(error => {
        handleError(error);
        console.log(error.message);
    })
}
