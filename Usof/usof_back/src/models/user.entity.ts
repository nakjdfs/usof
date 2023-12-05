import { DataTypes, Model, Optional } from "sequelize";

import sequelize from "../upload.js";
import data from "../config.json" assert { type: "json" };

export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN",
}

interface IUser {
    user_id: number;
    login: string;
    password: string;
    full_name: string;
    email: string;
    verified: boolean;
    profile_pic: string;
    rating: bigint;
    role: UserRole;
}

export type UserCreationAttributes = Optional<IUser, "user_id">;

export class User extends Model<IUser, UserCreationAttributes> {
    declare IUser;
}

User.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        login: {
            type: new DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        password: {
            type: new DataTypes.STRING(255),
            allowNull: false,
        },
        full_name: {
            type: new DataTypes.STRING(150),
            allowNull: true,
            defaultValue: "anonymous",
        },
        email: {
            type: new DataTypes.STRING(255),
            allowNull: false,
            unique: 'email',
            validate: {
                isEmail: true,
            },
        },
        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        profile_pic: {
            type: new DataTypes.STRING(255),
            allowNull: true,
            defaultValue: "default.jpg",
        },
        rating: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: 0,
        },
        role: {
            type: new DataTypes.ENUM(UserRole.USER, UserRole.ADMIN),
            allowNull: false,
            defaultValue: UserRole.USER,
        },
    },
    {
        sequelize,
        tableName: "users",
        modelName: data.database.database,
        timestamps: false,
    },
);

//await sequelize.sync({ alter: true });

//await User.findOrCreate({where: defaultAdminUser});
