import { $host } from "./index";

export const get_categories = async () => {
    const { data } = await $host.get(`api/categories`);
    return data;
};

export const get_category = async (categoryId) => {
    const { data } = await $host.get(`api/categories/${categoryId}`);
    return data;
};

export const get_posts_with_categories = async (categoryId, page = 1, limit = 5, sortBy = "rating", sortOrder = "DESC" ) => {
    const { data } = await $host.get(
        `api/categories/${categoryId}/posts?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`
    );
    return data;
};