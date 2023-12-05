import axios from "axios";

const $host = axios.create({
    baseURL: "http://localhost:3002/",//process.env.REACT_APP_API_URL
    withCredentials: true
})

const $authHost = axios.create({
    baseURL: "http://localhost:3002/"//process.env.REACT_APP_API_URL
})

const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('userToken')}`
    return config
}

$authHost.interceptors.request.use(authInterceptor)

export {
    $host,
    $authHost
}