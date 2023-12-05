import express from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import data from '../config.json' assert { type: "json" };
import { hashPassword } from "../hashing.js";
import { User, UserRole } from "../models/user.entity.js";
import { Post } from "../models/post.entity.js";
const mailSend = "ucodemailsend@gmail.com";
const pictureName = "default";
export async function get_users(req, res) {
    const users = await User.findAll()
        .catch((error) => {
        res.status(500).send({ message: error.message });
    });
    return res.status(200).json(users);
}
;
export async function get_user(req, res) {
    const { user_id } = req.params;
    const user = await User.findByPk(user_id)
        .catch((error) => {
        res.status(500).send({ message: error.message });
    });
    if (!user) {
        return res.status(404).send({ message: `User not found!` });
    }
    return res.status(200).json(user);
}
;
export async function get_userPost(req, res) {
    const { user_id } = req.params;
    let { page = 1, limit = 5, sortBy = "rating", sortOrder = "DESC" } = req.body;
    if (sortBy != "rating" && sortBy != "createdAt") {
        return res.status(400).send({ message: "Wrong sorting!" });
    }
    if (sortOrder != "DESC" && sortOrder != "ASC") {
        return res.status(400).send({ message: "Wrong sorting order!" });
    }
    const posts = await Post.findAll({
        limit: limit,
        offset: (page - 1) * limit,
        order: [[sortBy, sortOrder]],
        where: {
            author: user_id,
        },
    })
        .catch((error) => {
        res.status(500).send({ message: error.message });
    });
    return res.status(200).json(posts);
}
;
export async function post_user(req, res) {
    const { login, password, rpassword, email, role } = req.body;
    let newUser;
    try {
        newUser = await User.findOne({ where: { login: login } });
        if (newUser) {
            return res.status(403).send({ message: "Login already exists!" });
        }
        newUser = await User.findOne({ where: { email: email } });
        if (newUser) {
            return res.status(403).send({ message: "Email already exists!" });
        }
    }
    catch (error) {
        return res.status(500).send({ message: "Smth went wrong!", });
    }
    if (password !== rpassword) {
        return res.status(403).send({ message: "Passwords do not match!" });
    }
    const user = {
        login: login,
        password: await hashPassword(password),
        email: email,
        verified: true,
        role: role,
    };
    const createdUser = await User.create(user).catch((error) => {
        res.status(500).send({ message: error.message });
    });
    return res.status(200).send({ message: "User / Admin was created!" });
}
;
export async function patch_avatar(req, res) {
    const { login } = req.user;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send({ message: "No files were uploaded." });
    }
    let { avatar } = req.files;
    if (!avatar.name.endsWith(".jpg")) {
        return res.status(400).send({ message: "Wrong file type" });
    }
    let filePath = path.resolve() + data.database.pictures + login + avatar.name.substring(avatar.name.length - 4);
    avatar.mv(filePath, async (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        await User.update({ profile_pic: login + ".jpg", }, { where: { login: login } }).catch((error) => {
            res.status(500).send({ message: error.message });
        });
        return res.status(200).send({ message: "File uploaded!" });
    });
}
;
export async function get_avatar(req, res) {
    const { user_id } = req.params;
    const user = await User.findByPk(user_id);
    if (!user) {
        return res.status(404).send({ message: `User not found!` });
    }
    const fileName = user.login + ".jpg";
    const filePath = path.join(path.resolve(), data.database.pictures, fileName);
    fs.access(filePath, fs.constants.F_OK, async (err) => {
        if (err) {
            fs.copyFile(path.join(path.resolve(), data.database.defpicture), filePath, async (err) => {
                if (err) {
                    return res.status(500).send({ message: "Error while copying defavatar" });
                }
            });
        }
        await User.update({ profile_pic: user.login + ".jpg", }, { where: { user_id: user_id } }).catch((error) => {
            res.status(500).send({ message: error.message });
        });
        return res.status(200).sendFile(filePath);
    });
}
;
export async function patch_user(req, res) {
    const { login, full_name } = req.body;
    const { user_id } = req.params;
    if (req.user.user_id != user_id) {
        return res.send({ message: "Access denied!" });
    }
    try {
        const user = await User.update({
            login: login,
            full_name: full_name,
            profile_pic: login + ".jpg",
        }, { where: { user_id: user_id } });
        if (!user) {
            return res.status(404).send({ message: `User with id ${user_id} not found!` });
        }
        const token = req.cookies.userToken;
        let userFromToken = jwt.verify(token, data.database.accesskey);
        userFromToken.login = login;
        res.cookie("userToken", jwt.sign(userFromToken, data.database.accesskey), { httpOnly: true });
        const __dirname = path.resolve();
        const newImg = __dirname + data.database.pictures + login + ".jpg";
        fs.rename(__dirname + data.database.pictures + req.user.login + ".jpg", newImg, function (error) {
            if (error) {
                fs.copyFile(__dirname + data.database.defpicture, newImg, (err) => {
                    if (err) {
                        return res.status(500).send({ message: "Error while copying defpicure" });
                    }
                });
            }
        });
        return res.status(200).send({ message: "User updated successfully!" });
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}
;
export async function delete_user(req, res) {
    const { user_id } = req.params;
    if (req.user.user_id != user_id) {
        return res.status(403).send({ message: "Access denied!" });
    }
    try {
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).send({ message: `User not found!` });
        }
        fs.unlink(path.resolve() + data.database.pictures + user.profile_pic, (err) => { });
        await user.destroy();
        return res.status(200).send({ message: `User was deleted!` });
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}
;
