import data from './config.json' assert { type: "json" };
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import express from 'express';
import Connect from 'express-mysql-session';
import session from 'express-session';
import { hashPassword, verifyPassword } from './hashing.js';
import argon2 from 'argon2';
import { ComponentLoader } from 'adminjs';
import passwordFeature from "@adminjs/passwords";
import * as AdminJSSequelize from '@adminjs/sequelize';
import { User } from './models/user.entity.js';
import { Category } from './models/category.entity.js';
import { Post } from './models/post.entity.js';
import { Comment } from './models/comment.entity.js';
import { Like, dropTriggerD, dropTriggerI, triggerI, triggerD, triggerIPosts, triggerDPost, dropTriggerIPost, dropTriggerDPost } from './models/like.entity.js';
import { PostCategory } from './models/postCategory.entity.js';
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import sequelize from './upload.js';
import * as comController from "./controllers/comController.js";
import * as authController from "./controllers/authController.js";
import * as userController from "./controllers/userController.js";
import * as catController from "./controllers/catController.js";
import * as postController from "./controllers/postController.js";
import { verifyToken, isAdmin } from './verification.js';
import cors from "cors";
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
};
AdminJS.registerAdapter({
    Resource: AdminJSSequelize.Resource,
    Database: AdminJSSequelize.Database,
});
const PORT = data.database.port;
const IN_PROD = false;
const TWO_HOURS = 1000 * 60 * 60 * 2;
const options = {
    connectionLimit: data.database.connectionLimit,
    password: data.database.password,
    user: data.database.user,
    database: data.database.database,
    host: data.database.host,
    port: "3306",
    createDatabaseTable: true
};
const authenticate = async (email, password) => {
    const admin = await User.findOne({ where: { email: email, role: 'ADMIN' } });
    if (!admin) {
        return null;
    }
    if (verifyPassword(admin.password, password)) {
        return Promise.resolve(admin);
    }
    return null;
};
const componentLoader = new ComponentLoader();
const start = async () => {
    const app = express();
    const adminOptions = {
        componentLoader,
        resources: [{
                resource: User,
                options: {
                    properties: { password: { isVisible: false } },
                },
                features: [
                    passwordFeature({
                        componentLoader,
                        properties: {
                            encryptedPassword: "password",
                            password: "newPassword",
                        },
                        hash: argon2.hash,
                    }),
                ],
            }, Category, Post, Comment, Like, PostCategory],
    };
    const admin = new AdminJS(adminOptions);
    const ConnectSession = Connect(session);
    const sessionStore = new ConnectSession(options);
    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
        authenticate,
        cookieName: 'adminjs',
        cookiePassword: 'sessionsecret',
    }, null, {
        store: sessionStore,
        resave: true,
        saveUninitialized: true,
        secret: 'sessionsecret',
        cookie: {
            httpOnly: IN_PROD,
            secure: IN_PROD,
            maxAge: TWO_HOURS
        },
        name: 'adminjs',
    });
    app.use(admin.options.rootPath, adminRouter);
    app.use(cors(corsOptions));
    app.use(cookieParser());
    app.use(express.json());
    app.use(fileUpload());
    app.post("/api/auth/register", authController.register);
    app.post("/api/auth/login", authController.login);
    app.post("/api/auth/logout", authController.logout);
    app.post("/api/auth/password-reset", authController.passReset);
    app.get("/api/auth/password-reset/:confirm_token", authController.passConfirm);
    app.get("/api/auth/verify-email/:confirm_token", authController.emailVerif);
    app.get("/api/users/", userController.get_users);
    app.get("/api/users/:user_id", userController.get_user);
    app.get("/api/users/:user_id/post", userController.get_userPost);
    app.post("/api/users/", verifyToken, isAdmin, userController.post_user);
    app.get("/api/users/:user_id/avatar", userController.get_avatar);
    app.patch("/api/users/avatar", verifyToken, userController.patch_avatar);
    app.patch("/api/users/:user_id", verifyToken, userController.patch_user);
    app.delete("/api/users/:user_id", verifyToken, userController.delete_user);
    app.get("/api/categories/", catController.get_categ);
    app.get("/api/categories/:category_id", catController.get_category);
    app.get("/api/categories/:category_id/posts", catController.get_posts);
    app.post("/api/categories/", verifyToken, isAdmin, catController.create_categ);
    app.patch("/api/categories/:category_id", verifyToken, isAdmin, catController.edit_categ);
    app.delete("/api/categories/:category_id", verifyToken, isAdmin, catController.delete_category);
    app.get("/api/posts/", postController.get_posts);
    app.get("/api/posts/:post_id", postController.get_post);
    app.get("/api/posts/:user_id/user", postController.get_postsLike);
    app.get("/api/posts/:post_id/likeuser", verifyToken, postController.get_postlike);
    app.get("/api/posts/:post_id/comments", postController.get_comments);
    app.post("/api/posts/:post_id/comments", verifyToken, postController.post_comments);
    app.get("/api/posts/:post_id/categories", postController.get_categ);
    app.get("/api/posts/:post_id/like", postController.get_likes);
    app.post("/api/posts/", verifyToken, postController.create_post);
    app.post("/api/posts/:post_id/like", verifyToken, postController.create_like);
    app.patch("/api/posts/:post_id", verifyToken, postController.edit_post);
    app.delete("/api/posts/:post_id", verifyToken, postController.delete_post);
    app.delete("/api/posts/:post_id/like", verifyToken, postController.delete_like);
    app.get("/api/comments/:comm_id", comController.get_comm);
    app.get("/api/comments/:comm_id/like", comController.get_likes);
    app.get("/api/comments/:comm_id/user", verifyToken, comController.get_like);
    app.post("/api/comments/:comm_id/like", verifyToken, comController.create_like);
    app.patch("/api/comments/:comm_id", verifyToken, comController.edit_comment);
    app.delete("/api/comments/:comm_id", verifyToken, comController.delete_comm);
    app.delete("/api/comments/:comm_id/like", verifyToken, comController.delete_like);
    app.listen(PORT, () => {
        console.log(`AdminJS started on http://localhost:${PORT}${admin.options.rootPath}`);
    });
};
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (UserRole = {}));
const defaultAdminUser = {
    login: 'Head Admin',
    password: await hashPassword('password'),
    email: 'admin@example.com',
    role: UserRole.ADMIN,
};
let change = false;
(async () => {
    await User.sync({ alter: change });
    await User.findOrCreate({ where: {
            login: defaultAdminUser.login,
            email: defaultAdminUser.email,
            role: defaultAdminUser.role,
            verified: true,
        },
        defaults: {
            password: defaultAdminUser.password,
        }, });
    await Category.sync({ alter: change });
    await Post.sync({ alter: change });
    await PostCategory.sync({ alter: change });
    await Comment.sync({ alter: change });
    await Like.sync({ alter: change });
    await sequelize.query(dropTriggerI);
    await sequelize.query(dropTriggerD);
    await sequelize.query(dropTriggerIPost);
    await sequelize.query(dropTriggerDPost);
    await sequelize.query(triggerI);
    await sequelize.query(triggerD);
    await sequelize.query(triggerIPosts);
    await sequelize.query(triggerDPost);
    await Post.hasMany(Like, { foreignKey: 'postId', as: 'likes' });
    await Like.belongsTo(Post, { foreignKey: 'postId', as: 'post' });
    await start();
})();
