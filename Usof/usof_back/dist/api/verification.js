import { User, UserRole } from "../models/user.entity.js";
import jwt from "jsonwebtoken";
import data from "../config.json" assert { type: "json" };
export const checkRole = (req, res, next) => {
    if (req.body.role) {
        if (req.body.role !== UserRole.ADMIN || req.body.role !== UserRole.USER) {
            return res.status(400).send({
                message: `Failed! Role '${req.body.role}' does not exist`,
            });
        }
    }
    next();
};
export function verifyToken(req, res, next) {
    const token = req.cookies.userToken;
    try {
        const user = jwt.verify(token, data.database.accesskey);
        req.user = user;
        next();
    }
    catch (err) {
        res.clearCookie("userToken");
        return res.sendStatus(401);
    }
}
export const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { email: req.user.email, role: UserRole.ADMIN } });
        if (!user) {
            return res.status(403).send("Access denied!");
        }
        return next();
    }
    catch (error) {
        return res.status(500).send("Unable to validate User role!");
    }
};
