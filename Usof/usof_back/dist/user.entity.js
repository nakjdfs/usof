import { DataTypes, Model } from 'sequelize';
import sequelize from './upload.js';
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (UserRole = {}));
const defaultAdminUser = {
    login: 'Head Admin',
    password: 'password',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
};
export class User extends Model {
}
User.init({
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    login: {
        type: new DataTypes.STRING(128),
        allowNull: false,
        unique: true,
    },
    password: {
        type: new DataTypes.STRING(32),
        allowNull: false,
    },
    full_name: {
        type: new DataTypes.STRING(128),
        allowNull: true,
        defaultValue: 'anonymous',
    },
    email: {
        type: new DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    profile_pic: {
        type: new DataTypes.STRING(255),
        allowNull: true,
        defaultValue: `./static/profile_pic/default.jpg`,
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
}, {
    sequelize,
    tableName: 'users',
    modelName: 'usof_db',
    timestamps: false
});
await sequelize.sync({ alter: true });
await User.findOrCreate({ where: defaultAdminUser });
