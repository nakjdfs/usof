import { DataTypes, Model, Optional, BelongsToMany } from 'sequelize'

import sequelize from '../upload.js'
import {Category} from "./category.entity.js"
import {User} from "./user.entity.js"
//import PostCategory from "./postCategory.entity.js"
import data from '../config.json'assert { type: "json" };
enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
interface IPost {
    id: number;
    title: string;
    //pubilsh_date: Date;
    createdAt:Date;
    //updatedAt:Date;
    status: string;
    content: string;
    rating: bigint;
}


export type PostCreationAttributes = Optional<IPost, 'id'>

export class Post extends Model<IPost, PostCreationAttributes> {
  declare IPost;
  //public categories?: Category[];
  //@BelongsToMany(() => Category, () => PostCategory, 'postId', 'categoryId')
  declare categories: Category[];
}

Post.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: new DataTypes.STRING(200),
        allowNull: false,
      },
      createdAt: {
        type: new DataTypes.DATE,
      },
      /*updatedAt: {
        type: new DataTypes.DATE,
      },*/
      status: {
        type: new DataTypes.ENUM(Status.ACTIVE, Status.INACTIVE),
        allowNull: false,
        defaultValue: Status.ACTIVE,
      },
      content: {
        type: new DataTypes.STRING(500),
        allowNull: false,
      },
      rating: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: 'posts',
      modelName: data.database.database,
      timestamps: true

    }
  )
Post.belongsTo(User, {
    foreignKey: 'author',
    onDelete: "CASCADE",
});
//Post.belongsToMany(Category, { through: PostCategory });
//Category.belongsToMany(Post, { through: 'PostCategory' });

//await sequelize.sync({ alter: true });


