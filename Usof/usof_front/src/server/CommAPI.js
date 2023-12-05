import {$authHost, $host} from "./index";
import {jwtDecode} from "jwt-decode";
/*
 app.get("/api/comments/:comm_id", comController.get_comm);
  app.get("/api/comments/:comm_id/like", comController.get_likes);
  app.post("/api/comments/:comm_id/like", verifyToken, comController.create_like);
  app.patch("/api/comments/:comm_id", verifyToken, comController.edit_comment);
  app.delete("/api/comments/:comm_id", verifyToken, comController.delete_comm);
  app.delete("/api/comments/:comm_id/like", verifyToken, comController.delete_like);
*/
export const getComm = async () => {
    const {data} = await $host.get("/api/comments/:comm_id")
    //localStorage.setItem('userToken', data.userToken)
    return data
}

export const editComm = async (comm_id, content) => {
    const {data} = await $host.patch('/api/comments/' + comm_id,{content})
    return data
}

export const delComm = async (comm_id) => {
    const {data} = await $host.delete('/api/comments/' + comm_id,)
    return data
}

export const createComLike = async (comm_id, type) => {
    const {data} = await $host.post('/api/comments/'+comm_id+'/like', {type})
    return data
}
export const delComLike = async (comm_id) => {
    const {data} = await $host.delete('/api/comments/'+comm_id+'/like')
    return data
}

export const getCommLike = async (comm_id) => {
    const {data} = await $host.get('/api/comments/'+comm_id+'/user')
    return data
}
export const getPostCateg = async (post_id) => {
    const {data} = await $host.get('/api/posts/'+post_id+'/categories')
    return data
}