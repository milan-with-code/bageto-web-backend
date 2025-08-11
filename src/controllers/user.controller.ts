import { Request, Response } from "express";
import { User } from "../models/user.model";

export const getUsers = async (req: Request, res: Response) => {
    const users = await User.find();
    res.json(users);
};


// export const loginUser = async (req: Request, res: Response) => {
//     const { email, password } = req.body;

//     if(!email || !password){
//         return res.status()
//     }
// }
