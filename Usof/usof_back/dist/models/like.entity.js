import { DataTypes, Model } from "sequelize";
import sequelize from "../upload.js";
import { User } from "./user.entity.js";
import { Post } from "./post.entity.js";
import { Comment } from "./comment.entity.js";
import data from "../config.json" assert { type: "json" };
var LikeType;
(function (LikeType) {
    LikeType["LIKE"] = "LIKE";
    LikeType["DISLIKE"] = "DISLIKE";
})(LikeType || (LikeType = {}));
export class Like extends Model {
}
Like.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    author: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: "user_id",
        },
        allowNull: false,
        onDelete: "CASCADE",
    },
    postId: {
        type: DataTypes.INTEGER,
        references: {
            model: Post,
            key: "id",
        },
        allowNull: true,
        onDelete: "CASCADE",
    },
    commentId: {
        type: DataTypes.INTEGER,
        references: {
            model: Comment,
            key: "id",
        },
        allowNull: true,
        onDelete: "CASCADE",
    },
    type: {
        type: new DataTypes.ENUM(LikeType.LIKE, LikeType.DISLIKE),
        allowNull: false,
        defaultValue: LikeType.LIKE,
    },
}, {
    sequelize,
    tableName: "likes",
    modelName: data.database.database,
    timestamps: false,
    indexes: [
        {
            name: "unique_comment",
            unique: true,
            fields: ["author", "commentId"],
        },
        {
            name: "unique_post",
            unique: true,
            fields: ["author", "postId"],
        },
    ],
});
export let dropTriggerI = "DROP TRIGGER IF EXISTS like_insert_trigger; ";
export let dropTriggerD = "DROP TRIGGER IF EXISTS like_delete_trigger; ";
export let dropTriggerIPost = "DROP TRIGGER IF EXISTS post_insert_trigger; ";
export let dropTriggerDPost = "DROP TRIGGER IF EXISTS post_delete_trigger; ";
export let triggerI = "CREATE TRIGGER like_insert_trigger " +
    "AFTER INSERT ON likes " +
    "FOR EACH ROW " +
    "BEGIN " +
    "DECLARE post_author_id INT; " +
    "DECLARE comment_author_id INT; " +
    "SET post_author_id = (SELECT author FROM posts WHERE posts.id = NEW.postId); " +
    "SET comment_author_id = CASE " +
    "WHEN NEW.postId IS NULL THEN (SELECT author FROM comments WHERE comments.id = NEW.commentId) " +
    "ELSE NULL " +
    "END; " +
    "IF NEW.type = 'LIKE' THEN " +
    "IF post_author_id IS NOT NULL THEN " +
    "UPDATE users SET rating = rating + 1 WHERE user_id = post_author_id; " +
    "END IF; " +
    "IF comment_author_id IS NOT NULL THEN " +
    "UPDATE users SET rating = rating + 1 WHERE user_id = comment_author_id; " +
    "END IF; " +
    "ELSE " +
    "IF post_author_id IS NOT NULL THEN " +
    "UPDATE users SET rating = rating - 1 WHERE user_id = post_author_id; " +
    "END IF; " +
    "IF comment_author_id IS NOT NULL THEN " +
    "UPDATE users SET rating = rating - 1 WHERE user_id = comment_author_id; " +
    "END IF; " +
    "END IF; " +
    "END;";
export let triggerIPosts = "CREATE TRIGGER post_insert_trigger " +
    "AFTER INSERT ON likes " +
    "FOR EACH ROW " +
    "BEGIN " +
    "DECLARE post_author_id INT; " +
    "DECLARE comment_author_id INT; " +
    "SET post_author_id = (SELECT author FROM posts WHERE posts.id = NEW.postId); " +
    "SET comment_author_id = CASE " +
    "WHEN NEW.postId IS NULL THEN (SELECT author FROM comments WHERE comments.id = NEW.commentId) " +
    "ELSE NULL " +
    "END; " +
    "IF NEW.type = 'LIKE' THEN " +
    "IF post_author_id IS NOT NULL THEN " +
    "UPDATE posts SET rating = rating + 1 WHERE id = NEW.postId; " +
    "END IF; " +
    "IF comment_author_id IS NOT NULL THEN " +
    "UPDATE comments SET rating = rating + 1 WHERE id = NEW.commentId; " +
    "END IF; " +
    "ELSE " +
    "IF post_author_id IS NOT NULL THEN " +
    "UPDATE posts SET rating = rating - 1 WHERE id = NEW.postId; " +
    "END IF; " +
    "IF comment_author_id IS NOT NULL THEN " +
    "UPDATE comments SET rating = rating - 1 WHERE id = NEW.commentId; " +
    "END IF; " +
    "END IF; " +
    "END;";
export let triggerD = "CREATE TRIGGER like_delete_trigger " +
    "AFTER DELETE ON likes " +
    "FOR EACH ROW " +
    "BEGIN " +
    "DECLARE post_author_id INT; " +
    "DECLARE comment_author_id INT; " +
    "SET post_author_id = (SELECT author FROM posts WHERE posts.id = OLD.postId); " +
    "SET comment_author_id = CASE " +
    "WHEN OLD.postId IS NULL THEN (SELECT author FROM comments WHERE comments.id = OLD.commentId) " +
    "ELSE NULL " +
    "END; " +
    "IF OLD.type = 'LIKE' THEN " +
    "IF post_author_id IS NOT NULL THEN " +
    "UPDATE users SET rating = rating - 1 WHERE user_id = post_author_id; " +
    "END IF; " +
    "IF comment_author_id IS NOT NULL THEN " +
    "UPDATE users SET rating = rating - 1 WHERE user_id = comment_author_id; " +
    "END IF; " +
    "ELSE " +
    "IF post_author_id IS NOT NULL THEN " +
    "UPDATE users SET rating = rating + 1 WHERE user_id = post_author_id; " +
    "END IF; " +
    "IF comment_author_id IS NOT NULL THEN " +
    "UPDATE users SET rating = rating + 1 WHERE user_id = comment_author_id; " +
    "END IF; " +
    "END IF; " +
    "END;";
export let triggerDPost = "CREATE TRIGGER post_delete_trigger " +
    "AFTER DELETE ON likes " +
    "FOR EACH ROW " +
    "BEGIN " +
    "DECLARE post_author_id INT; " +
    "DECLARE comment_author_id INT; " +
    "SET post_author_id = (SELECT author FROM posts WHERE posts.id = OLD.postId); " +
    "SET comment_author_id = CASE " +
    "WHEN OLD.postId IS NULL THEN (SELECT author FROM comments WHERE comments.id = OLD.commentId) " +
    "ELSE NULL " +
    "END; " +
    "IF OLD.type = 'LIKE' THEN " +
    "IF post_author_id IS NOT NULL THEN " +
    "UPDATE posts SET rating = rating - 1 WHERE id = OLD.postId; " +
    "END IF; " +
    "IF comment_author_id IS NOT NULL THEN " +
    "UPDATE comments SET rating = rating - 1 WHERE id = OLD.commentId; " +
    "END IF; " +
    "ELSE " +
    "IF post_author_id IS NOT NULL THEN " +
    "UPDATE posts SET rating = rating + 1 WHERE id = OLD.postId; " +
    "END IF; " +
    "IF comment_author_id IS NOT NULL THEN " +
    "UPDATE comments SET rating = rating + 1 WHERE id = OLD.commentId; " +
    "END IF; " +
    "END IF; " +
    "END;";
