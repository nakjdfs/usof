import { DataTypes, Model, Optional } from 'sequelize';

import sequelize from '../upload.js';
import data from '../config.json'assert { type: "json" };


interface ICategory {
  id: number;
  title: string;
  description: string;
}

export type CategoryCreationAttributes = Optional<ICategory, 'id'>

export class Category extends Model<ICategory, CategoryCreationAttributes> {
  declare ICategory;
}

Category.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: new DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      description: {
        type: new DataTypes.STRING(300),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'categories',
      modelName: data.database.database,
      timestamps: false
    }
  )
  
//await sequelize.sync({ alter: true });