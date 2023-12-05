import { User, UserRole } from "./models/user.entity.js";
import jwt from "jsonwebtoken";
import data from "./config.json" assert { type: "json" };
export function verifyToken(req, res, next) {
    const token = req.cookies.userToken;
    console.log(token);
    try {
        req.user = jwt.verify(token, data.database.accesskey);
        next();
    }
    catch (err) {
        console.log("U are not right lalalalallaallalalallal");
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
        return res.status(500).send(error);
    }
};
