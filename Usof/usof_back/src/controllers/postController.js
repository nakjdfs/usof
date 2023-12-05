import { User } from "../models/user.entity.js";
import { Post } from "../models/post.entity.js";
import { Category } from "../models/category.entity.js";
import { PostCategory } from "../models/postCategory.entity.js";
import { Like } from "../models/like.entity.js";
import { Comment } from "../models/comment.entity.js";
import sequelize from "../upload.js";
import { Sequelize } from "sequelize";

export async function get_posts (req, res){
    let { page = 1, limit = 5, sortBy = "rating", sortOrder = "DESC" } = req.query;
    if (sortBy != "rating" && sortBy != "createdAt") {
        return res.status(400).send({ message: "Wrong sorting!" });
    }
    if (sortOrder != "DESC" && sortOrder != "ASC") {
        return res.status(400).send({ message: "Wrong sorting order!" });
    }
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    const posts = await Post.findAndCountAll({
        limit: limit,
        offset: (page - 1) * limit,
        order: [[sortBy, sortOrder]],
    })
    .catch((error) => {
        res.status(500).send({ message: error.message });
    });
    res.status(200).json(posts);
};

export async function get_post(req, res){
    const {post_id} = req.params;
    const post = await Post.findByPk(post_id)
        .catch((error) => {
            res.status(500).send({ message: error.message });
        });
    if (!post) {
        return res.status(404).send({ message: `Post not found!` });
    }
    res.status(200).json(post);
};

export async function get_postsLike (req, res){
    const {user_id} = req.params;
    const likes = await Like.findAll({where: {author: user_id,},
        attributes: ['postId'],})
    .catch((error)=>{
        res.status(500).send({ message: error.message });
    });
    if (likes.length == 0) {
        return res.status(404).send({message: `Likes not found!`,});
    }
    const uniquePostIds = likes.map((like) => like.postId);
    const postsWithLikes = await Post.findAll({
        where: { id: uniquePostIds },
    })
    .catch((error)=>{
        res.status(500).send({ message: error.message });
    });
    
    if (postsWithLikes.length === 0) {
        return res.status(404).send({ message: `Posts not found for the author's likes!` });
    }


    res.status(200).json(postsWithLikes);
};
export async function get_postlike (req, res) {
    const {post_id} = req.params;
    const {user_id} = req.user;
    const like = await Like.findOne({where: {author: user_id, postId: post_id},})
        .catch((error)=>{
            res.status(500).send({ message: error.message });
        });
    res.status(200).json(like);
};

export async function get_comments(req, res) {
    const {post_id} = req.params;
    const comments = await Comment.findAll({where: {postId: post_id,},})
        .catch((error) => {
            res.status(500).send({ message: error.message });
        });
    if (!comments) {
        return res.status(404).send({message: `Comments not found!`,});
    }
    res.status(200).json(comments);
};

export async function post_comments (req, res){
    const {content} = req.body;
    if (!content) {
        return res.status(400).send("Content is required!");
    }
    const {post_id} = req.params;
    const {user_id} = req.user;
    await Comment.create({
        author: user_id,
        postId: post_id,
        content: content,
    }).catch((error) => {
        res.status(500).send({ message: error.message });
    });
    res.status(200).json({ message: "Comment created successfully!" });
};

export async function get_categ(req, res) {
    const {post_id} = req.params;
    const postCateg = await PostCategory.findAll({where: {postId: post_id,},})
    .catch((error) => {
        res.status(500).send({ message: error.message });
    });
    if (postCateg.length == 0) {
        return res.status(404).send({message: `Categories not found!`,});
    }

    try {
        let categoryIds = postCateg.map((postCategory) => postCategory.categoryId);
        const categories = await Category.findAll({where: {id: categoryIds,},});
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export async function get_likes (req, res) {
    const {post_id} = req.params;
    const likes = await Like.findAll({where: {postId: post_id,},})
    .catch((error)=>{
        res.status(500).send({ message: error.message });
    });
    if (likes.length == 0) {
        return res.status(404).send({message: `Likes not found!`,});
    }
    res.status(200).json(likes);
};

export async function create_post (req, res) {
    try {
        const {title, content, categories} = req.body;
        if (!title || !content || !categories) {
            return res.status(400).send("All input is required");
        }

        const categoriesF = await Category.findAll({where: {title: categories,},});

        if (categoriesF.length !== categories.length) {
            return res.status(400).send({ message: "Invalid set of categories!" });
        }

        const post = await Post.create({
            title: title,
            author: req.user.user_id,
            content: content,
        });

        for (let i = 0; i < categoriesF.length; i++) {
            await PostCategory.create({
                postId: post.id,
                categoryId: categoriesF[i].id,
            });
        }

        res.status(200).json({ message: "Post created successfully!" });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export async function create_like(req, res) {
    const {type} = req.body;
    if (!type) {
        return res.status(400).send("Like type is required!");
    }
    const {post_id} = req.params;
    try {
        const post = await Post.findByPk(post_id);

        if (!post) {
            return res.status(404).send({ message: `Post not found!` });
        }
        const {user_id} = req.user;
        await Like.destroy({
            where: {author: user_id, postId: post_id,},});

        await Like.create({
            author: user_id,
            postId: post_id,
            commentId: null,
            type: type,
        });

        res.status(200).json({ message: `${type} created successfully!` });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export async function edit_post(req, res) {
    try {
        const {title, content, categories, status} = req.body;
        if (!title || !content || !categories) {
            return res.status(400).send({message: "All input is required"});
        }
        const {post_id} = req.params;
        const {user_id} = req.user;
        const postUp = await Post.findByPk(post_id);

        if (postUp.author != user_id) {
            return res.status(403).send({ message: "Access denied!" });
        }

        const categoriesF = await Category.findAll({where: {title: categories,},});
        console.log(categoriesF+" "+categories);

        if (categoriesF.length !== categories.length) {
            return res.status(400).send({ message: "Invalid set of categories!" });
        }

         await postUp.update(
            {
                title: title,
                author: user_id,
                content: content,
                status: status,
            },);//{ where: { id: post_id } }
        //if (!post) {
        //    res.status(404);
        //    return res.send({ message: `Post with id ${post_id} not found!` });
        //}

        await PostCategory.destroy({where: {postId: post_id,},});

        for (let i = 0; i < categoriesF.length; i++) {
            await PostCategory.create({
                postId: post_id,
                categoryId: categoriesF[i].id,
            });
        }

        res.status(200).json({ message: `Post was updated!` });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export async function delete_post(req, res) {
    const {post_id} = req.params; 
    const postDel = await Post.findByPk(post_id)
    .catch((error)=>{
        res.status(500).send({ message: error.message });
    });
    
    const {user_id} = req.user;

    if (!postDel||postDel.author != user_id) {
        return res.status(403).send({ message: "Access denied!" });
    }

    const post = await postDel.destroy()
    .catch((error)=>{res.status(500).send({ message: error.message });});//{ where: { post_id: req.params.post_id } }
    if (!post) {
        return res.status(404).send({ message: `Post not found!` });
    }
    return res.status(200).send({ message: `Post was deleted!` });
};

export async function delete_like (req, res) {
    const {post_id} = req.params;
    const post = await Post.findByPk(post_id)
    .catch((error)=>{
        res.status(500).send({ message: error.message });
    });

    if (!post) {
        return res.status(404).send({ message: `Post not found!` });
    }
    const {user_id} = req.user;
    const like = await Like.destroy({where: {author: user_id, postId: post_id,},})
    .catch((error)=>{
        res.status(500).send({ message: error.message });
    });

    if (!like) {
        return  res.status(404).send({message: `Post has no likes from this user!`,});
    }

    res.status(200).json({ message: `Post Like deleted successfully!` });
};
