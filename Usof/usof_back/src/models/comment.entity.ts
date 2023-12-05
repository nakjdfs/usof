import { DataTypes, Model, Optional } from 'sequelize';

import sequelize from '../upload.js';
import {User} from "./user.entity.js";
import {Post} from "./post.entity.js";
import data from '../config.json' assert { type: "json" };

interface IComment {
    id: number;
    author: number;
    postId: number;
    createdAt: Date;
    content: string;
    rating: bigint;
}


export type CommentCreationAttributes = Optional<IComment, 'id'>

export class Comment extends Model<IComment, CommentCreationAttributes> {
  declare IComment;
}

Comment.init(
    {
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
          key: 'user_id',
        },
        onDelete: "CASCADE",
        allowNull: false,
      },
      postId: {
        type: DataTypes.INTEGER,
        references: {
          model: Post,
          key: 'id',
        },
        onDelete: "CASCADE",
        allowNull: false,
      },
      createdAt: {
        type: new DataTypes.DATE,
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
      tableName: 'comments',
      modelName: data.database.database,
      timestamps: true
    }
  )

  
//await sequelize.sync({ alter: true });