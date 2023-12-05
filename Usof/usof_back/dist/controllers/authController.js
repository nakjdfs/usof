import express from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import data from '../config.json' assert { type: "json" };
import { hashPassword, verifyPassword } from "../hashing.js";
import { User, UserRole } from "../models/user.entity.js";
const mailSend = "ucodemailsend@gmail.com";
let transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: mailSend,
        pass: "xnfg gvow sjti spwu",
    },
});
export async function register(req, res) {
    const { login, password, rpassword, email } = req.body;
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
    };
    const createdUser = await User.create(user).catch((error) => {
        res.status(500).send({ message: error.message });
    });
    console.log("its   " + createdUser.user_id);
    const verificationUrl = verLink(createdUser.user_id, "", "email");
    let mailOptions = {
        from: mailSend,
        to: email,
        subject: "Registration",
        text: "Click on the link to verify your account " + verificationUrl,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("Error sending email: " + error);
            return res.status(500).send("Email sending error");
        }
        else {
            console.log("Email sent: " + info.response);
        }
    });
    res.status(200).send({ message: "User created!" });
}
export async function login(req, res) {
    const { login, email, password } = req.body;
    let user;
    const isValid = await User.findOne({
        where: {
            login: login,
            email: email,
        },
    }).catch((error) => {
        return res.status(500).send({ message: error.message });
    });
    try {
        if (!isValid || !(await verifyPassword(isValid.password, password))) {
            return res.status(404).send({ message: "Login or password is wrong" });
        }
        if (!isValid.verified) {
            return res.status(401).send({ message: "U are not verified, check email!" });
        }
        console.log(isValid + "\n" + verifyPassword(isValid.password, password));
        user = {
            user_id: isValid.user_id,
            login: isValid.login,
            email: isValid.email,
            role: isValid.role,
        };
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
    const token = jwt.sign(user, data.database.accesskey, { expiresIn: "6h" });
    res.cookie("userToken", token, { httpOnly: true });
    return res.status(200).json({ userToken: token });
}
export async function logout(req, res) {
    try {
        res.clearCookie("userToken");
        res.status(200).send({ message: "You have been logged out" });
    }
    catch (error) {
        res.status(400).send({ message: error.message });
    }
}
export async function passReset(req, res) {
    const { emailB, newPassword } = req.body;
    const isValid = await User.findOne({ where: { email: emailB, }, })
        .catch((error) => {
        res.status(500).send({ message: error.message });
    });
    if (!isValid) {
        return res.status(404).send({ message: "No such mail!" });
    }
    if (!newPassword) {
        return res.status(400).send({ message: "Password is null!" });
    }
    const newPass = await hashPassword(newPassword);
    const verificationUrl = verLink(isValid.user_id, newPass, "pass");
    let mailOptions = {
        from: mailSend,
        to: emailB,
        subject: "Reset Password",
        text: "Click to confirm your new password: " + verificationUrl,
    };
    try {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Error sending email: " + error);
                return res.status(500).send("Email sending error");
            }
            else {
                console.log("Email sent: " + info.response);
            }
        });
        res.status(200).send({ message: "Password change request was sent!" });
    }
    catch (error) {
        res.status(500).send({ message: error.message });
    }
}
export async function passConfirm(req, res) {
    const token = req.params.confirm_token;
    if (!token) {
        return res.sendStatus(403);
    }
    let id;
    let newPass;
    try {
        jwt.verify(token, data.database.mailkey, async (err, decoded) => {
            if (err) {
                return res.status(403).send({ message: err.message });
            }
            id = decoded.id;
            newPass = decoded.new_pass;
            await User.update({ password: newPass }, { where: { user_id: id } })
                .catch((error) => {
                return res.status(500).send({ message: error.message });
            });
            res.clearCookie("userToken");
            return res.status(200).send({ message: "Password changed!" });
        });
    }
    catch (error) {
        return res.status(403).send({ message: error.message });
    }
}
export async function emailVerif(req, res) {
    let id;
    const token = req.params.confirm_token;
    if (!token) {
        return res.sendStatus(403);
    }
    try {
        jwt.verify(token, data.database.mailkey, async (err, decoded) => {
            if (err) {
                return res.status(403).send({ message: err.message });
            }
            id = decoded.id;
        });
    }
    catch (error) {
        return res.status(400).send({ message: error.message });
    }
    console.log("\n" + id + "\n");
    await User.update({ verified: true }, { where: { user_id: id } })
        .catch((error) => {
        res.status(500).send({ message: error.message });
    });
    return res.status(200).send({ message: "Email was successfully verified!" });
}
function verLink(user_id, new_password, endpoint) {
    let date = new Date();
    let mail = {
        id: user_id,
        new_pass: new_password,
        created: date.toString(),
    };
    const mail_token = jwt.sign(mail, data.database.mailkey, { expiresIn: "1d" });
    return "http://localhost:3000/response/" + endpoint + "/" + mail_token;
}
