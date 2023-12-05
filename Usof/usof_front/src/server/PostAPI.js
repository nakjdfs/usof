import {$authHost, $host} from "./index";
import {jwtDecode} from "jwt-decode";

export const getPosts = async (page = 1, limit = 5, sortBy = "rating", sortOrder = "DESC") => {
    const {data} = await $host.get(`/api/posts/?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
    //localStorage.setItem('userToken', data.userToken)
    return data
}

export const getPost = async (post_id) => {
    const {data} = await $host.get('/api/posts/' + post_id,)
    return data
}

export const getPostUserLike = async (user_id) => {
    const {data} = await $host.get('/api/posts/'+user_id+'/user')
    return data
}
export const get_PostUserLike = async (post_id) => {
    const {data} = await $host.get('/api/posts/'+post_id+'/likeuser')
    return data
}
export const create_PostLike = async (post_id,type) => {
    const {data} = await $host.post('/api/posts/'+post_id+'/like',{type})
    return data
}
export const del_PostLike = async (post_id) => {
    const {data} = await $host.delete('/api/posts/'+post_id+'/like')
    return data
}
//app.post("/api/posts/", verifyToken, postController.create_post);

export const createPost = async (title, content, categories) => {
    const {data} = await $host.post('/api/posts/', {title, content, categories});
    return data
}
export const editPost = async (post_id,title, content, categories) => {
    const {data} = await $host.patch('/api/posts/'+ post_id, {title, content, categories, status: true});
    return data
}

export const getPostComm = async (post_id) => {
    const {data} = await $host.get('/api/posts/'+post_id+'/comments')
    return data
}
export const getPostLike = async (post_id) => {
    const {data} = await $host.get('/api/posts/'+post_id+'/likes')
    return data
}
export const setPostComm = async (post_id, content) => {
    const {data} = await $host.post('/api/posts/'+post_id+'/comments', {content})
    return data
}
export const getPostCateg = async (post_id) => {
    const {data} = await $host.get('/api/posts/'+post_id+'/categories')
    return data
}
export const delPost = async (post_id) => {
    const {data} = await $host.delete('/api/posts/'+ post_id);
    return data
}