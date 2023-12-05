import { Category } from "../models/category.entity.js";
import { Post } from "../models/post.entity.js";
import { PostCategory } from "../models/postCategory.entity.js";


export async function get_categ(req, res){
    const categories = await Category.findAll()
        .catch((error)=>{
            res.status(500).send({ message: error.message });
        });
    return res.status(200).json(categories);
};

export async function get_category(req, res) {
    const {category_id} = req.params;
    const category = await Category.findByPk(category_id)
        .catch((error)=>{
            res.status(500).send({ message: error.message });
        });
    if (!category) {
        return res.status(404).send({ message: `Category not found!` });
    }
    return res.status(200).json(category);
};

export async function get_posts(req, res) {
    const {category_id} = req.params;
    let { page = 1, limit = 5, sortBy = "rating", sortOrder = "DESC" } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    try {
        const postCateg = await PostCategory.findAll({where: {categoryId: category_id,},});

        if (postCateg.length == 0) {
            return res.status(404).send({message: `Posts not found!`,});
        }
        const postIds = postCateg.map((postCategory) => postCategory.postId);

        const posts = await Post.findAndCountAll({
            limit: limit,
            offset: (page - 1) * limit,
            order: [[sortBy, sortOrder]],
            where: {id: postIds,},
        });
        //.findAll({});

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export async function create_categ(req, res){
    const {title, description} = req.body;
    if (!title) {
        return res.status(400).send({ message: "Title is required!" });
    }
    await Category.create({title: title, description: description,})
        .catch((error)=>{
            res.status(500).send({ message: error.message });
        });

    return res.status(200).send({ message: "Category was created!" });
};

export async function edit_categ(req, res){
    try {
        const {category_id} = req.params;
        const category = await Category.findByPk(category_id);

        if (!category) {
            return res.status(404).send({ message: `Category not found!` });
        }
        const {title, description} = req.body;
        if(!title){
            return res.status(400).send({ message: "Title is required!" });
        }

        await сategory.update({title: title, description: description,},);//{ where: { id: category_id } }

        return res.status(200).send({ message: `Category was updated!` });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export async function delete_category(req, res){
    const {category_id} = req.params;
    const category = await Category.destroy({ where: { id: category_id } })
        .catch((error)=>{
            res.status(500).send({ message: error.message });
        });

    if (!category) {
        return res.status(404).send({ message: `Category not found!` });
    }
    
    return res.status(200).send({ message: `Category was deleted!` });
};
