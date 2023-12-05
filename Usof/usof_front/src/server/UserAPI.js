/*app.get("/api/users/", userController.get_users);
app.get("/api/users/:user_id", userController.get_user);
app.post("/api/users/", verifyToken, isAdmin, userController.post_user);
app.get("/api/users/:user_id/avatar", userController.get_avatar);
app.patch("/api/users/avatar", verifyToken, userController.patch_avatar);
app.patch("/api/users/:user_id", verifyToken, userController.patch_user);
app.delete("/api/users/:user_id", verifyToken, userController.delete_user);*/

import {$authHost, $host} from "./index";
import {jwtDecode} from "jwt-decode";

export const getUsers = async () => {
    const {data} = await $host.get("/api/users/")
    return data
}

export const getUser = async (user_id) => {
        const {data} = await $host.get("/api/users/"+ user_id,)
        return data
}
export const getUserPost = async (user_id) => {
    const {data} = await $host.get("/api/users/"+ user_id+ "/post",)
    return data
}

//export const post_user = async (user_id) => {
//    const {data} = await $host.post("/api/users/"+ user_id,)
//    return data
//}

export const patch_avatar = async (avatar) => {
    const {data} = await $host.patch('/api/users/avatar',
            { avatar },
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
    return data
}

export const patch_user = async (user_id, full_name, login) => {
    const {data} = await $host.patch('/api/users/'+ user_id, {login,full_name})
    return data
}

export const delete_user = async (user_id, token) => {
    const {data} = await $host.delete(`/api/users/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    return data
}