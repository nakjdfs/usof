import { DataTypes, Model,Optional } from 'sequelize';
import sequelize from '../upload.js';
import {Post} from './post.entity.js';
import {Category} from "./category.entity.js";

interface IPostCategory {
    id: number;
    postId: number;
    categoryId:number;
}

export type PostCategoryCreationAttributes = Optional<IPostCategory, 'id'>

export class PostCategory extends Model<IPostCategory, PostCategoryCreationAttributes> {
  declare IPostCategory;
}

PostCategory.init(
  {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true,
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
  },
  {
    sequelize,
    modelName: 'PostCategory',
    timestamps: false,
  }
);


Post.belongsToMany(Category, { through: PostCategory, foreignKey: 'postId' });
Category.belongsToMany(Post, { through: PostCategory, foreignKey: 'categoryId' });