"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const user_model_1 = require("../models/user.model");
const getUsers = async (req, res) => {
    const users = await user_model_1.User.find();
    res.json(users);
};
exports.getUsers = getUsers;
// export const loginUser = async (req: Request, res: Response) => {
//     const { email, password } = req.body;
//     if(!email || !password){
//         return res.status()
//     }
// }
