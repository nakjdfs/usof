import { DataTypes, Model } from 'sequelize';
import sequelize from '../upload.js';
import { Post } from './post.entity.js';
import { Category } from "./category.entity.js";
export class PostCategory extends Model {
}
PostCategory.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    postId: {
        type: DataTypes.INTEGER,
        references: {
            model: Post,
            key: 'id',
        },
    },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: Category,
            key: 'id',
        },
        unique: true,
    },
}, {
    sequelize,
    modelName: 'PostCategory',
    timestamps: false,
});
Post.belongsToMany(Category, { through: PostCategory, foreignKey: 'postId' });
Category.belongsToMany(Post, { through: PostCategory, foreignKey: 'categoryId' });
