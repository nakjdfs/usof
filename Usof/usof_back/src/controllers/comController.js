import { Comment } from "../models/comment.entity.js";
import { Like } from "../models/like.entity.js";

export async function get_comm (req, res) {
    const {comm_id} = req.params;
    const comment = await Comment.findByPk(comm_id)
        .catch((error)=>{
            res.status(500).send({ message: error.message });
        });
    if (!comment) {
        res.status(404);
        return res.send({ message: `Comment not found!` });
    }
    return res.status(200).json(comment);
};

export async function get_likes (req, res) {
    const {comm_id} = req.params;
    const likes = await Like.findAll({where: {commentId: comm_id,},})
        .catch((error)=>{
            res.status(500).send({ message: error.message });
        });
    if (likes.length == 0) {
        return res.status(404).send({message: `Likes not found!`,});
    }

    res.status(200).json(likes);
};
export async function get_like (req, res) {
    const {comm_id} = req.params;
    const {user_id} = req.user;
    const like = await Like.findOne({where: {author: user_id,commentId: comm_id},})
        .catch((error)=>{
            res.status(500).send({ message: error.message });
        });
    res.status(200).json(like);
};

export async function create_like (req, res) {
    const {comm_id} = req.params;
    const {type} = req.body;
    const {user_id} = req.user;
    console.log(type);
    if (!type) {
        return res.status(400).send("Like type is required!");
    }
    try {
        const comment = await Comment.findByPk(comm_id);

        if (!comment) {
            return res.status(404).send({ message: `Comment not found!` });
        }
        await Like.destroy({where: {author: user_id,commentId: comm_id,},});
        await Like.create({author: user_id,commentId: comm_id,type: type,});

        res.status(200).json({ message: `${type} created successfully!` });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export async function edit_comment (req, res) {
    const {comm_id} = req.params;
    const {content} = req.body;
    const {user_id} = req.user;
    if (!content) {
        return res.status(400).send({ message: "Content is required!" });
    }
    try {
        const comms = await Comment.findByPk(comm_id);

        if (!comms || comms.author != user_id) {
            return res.status(403).send({ message: "Access denied!" });
        }

        const comment = await comms.update({content: content,},);//{ where: { comment_id: req.params.comment_id } }

        if (!comment) {
            return res.status(404).send({ message: `Comment not found!` });
        }

        return res.status(200).send({ message: `Comment was updated!` });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export async function delete_comm (req, res) {
    const {comm_id} = req.params;
    const {user_id} = req.user;
    try {
        const comms = await Comment.findByPk(comm_id);
        console.log(comms + " " + user_id);

        if (!comms || comms.author != user_id) {
            return res.status(403).send({ message: "Access denied!" });
        }

        const comment = await comms.destroy();//{ where: { comment_id: req.params.comment_id } }
        if (!comment) {
            return res.status(404).send({ message: `Comment not found!` });
        }

        return res.status(200).send({ message: `Comment was deleted!` });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

export async function delete_like (req, res) {
    const {comm_id}  = req.params;
    const {user_id}  = req.user;
    try {
        const comment = await Comment.findByPk(comm_id);

        if (!comment) {
            return res.status(404).send({ message: `Comment not found!` });
        }

        const like = await Like.destroy({where: {author: user_id, commentId: comm_id,}});

        if (!like) {
            return res.status(404).send({message: `Comment has no likes from user!`,});
        }

        res.status(200).json({ message: `Like deleted!` });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};
