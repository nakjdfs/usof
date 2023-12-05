import {$authHost, $host} from "./index";
import {jwtDecode} from "jwt-decode";

export const registration = async (login, email, password, rpassword) => {
    const {data} = await $host.post('api/auth/register', {login, email, password,rpassword})
    return data
}

export const login = async (email,login, password) => {
        const {data} = await $host.post('api/auth/login', {login, email, password})
        localStorage.setItem('userToken', data.userToken)
        return jwtDecode(data.userToken)
}
export const logout = async () => {
    const {data} = await $host.post('api/auth/logout')
    return data
}

export const ressetPass = async (password, email) => {
    const {data} = await $authHost.post("/api/auth/password-reset", {emailB: email, newPassword: password})
    return data;
}

export const ressetPassConf = async (confirm_token) => {
    const {data} = await $authHost.get("/api/auth/password-reset/" + confirm_token,)
    return data;
}

export const verifyEmail = async (confirm_token) => {
    const {data} = await $authHost.get("/api/auth/verify-email/" + confirm_token,)
    return data;
}