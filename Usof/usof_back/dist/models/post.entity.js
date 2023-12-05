import { DataTypes, Model } from 'sequelize';
import sequelize from '../upload.js';
import { User } from "./user.entity.js";
import data from '../config.json' assert { type: "json" };
var Status;
(function (Status) {
    Status["ACTIVE"] = "ACTIVE";
    Status["INACTIVE"] = "INACTIVE";
})(Status || (Status = {}));
export class Post extends Model {
}
Post.init({
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
}, {
    sequelize,
    tableName: 'posts',
    modelName: data.database.database,
    timestamps: true
});
Post.belongsTo(User, {
    foreignKey: 'author',
    onDelete: "CASCADE",
});
