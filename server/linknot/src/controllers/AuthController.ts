import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { UserEntity } from "../database/entities/user.entities";
import config from "../config/config";
import { createJWT } from "../middlewares/checkJwt";
import * as session from "express-session";
//const session = require("express-session")


class AuthController {

    static login = async (req: Request, res: Response) => {
        //Check if username and password are set
        let { email, password } = req.body;
        if (!(email && password)) {
            res.status(400).send("email and password needed!");
            return;
        }

        //Get user from database
        const userRepository = getRepository(UserEntity);
        let user: UserEntity;
        try {
            user = await userRepository.findOneOrFail({ where: { email: email } });

            //Need to change prob
            //Check if encrypted password match
            if (!user.checkIfUnencryptedPasswordIsValid(password)) {
                res.status(401).send();
                return;
            }
        } catch (error) {
            res.status(401).send();
            return;
        }

        //Sign JWT, valid for 1 hour
        const token = createJWT({email: user.email, id: user.id}, "1h");
        req.session = {jwt: token};

        res.status(200).send("Logged in");
        };


    //TODO: not tested/changed yet
    static changePassword = async (req: Request, res: Response) => {
        //Get ID from JWT
        const id = res.locals.jwtPayload.id;

        //Get parameters from the body
        const { oldPassword, newPassword } = req.body;
        if (!(oldPassword && newPassword)) {
            res.status(400).send("oldPassword and newPassword needed!");
            return;
        }

        //Get user from the database
        const userRepository = getRepository(UserEntity);
        let user: UserEntity;
        try {
            user = await userRepository.findOneOrFail({
                                        where:{id:id}
            });
        } catch (id) {
            res.status(401).send();
        }

        //Check if old password matchs
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            res.status(401).send();
            return;
        }

        //Validate de model (password lenght)
        user.password = newPassword;
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        //Hash the new password and save
        user.hashPassword();
        userRepository.save(user);

        res.status(200).send("Passwords are different now");
        };


    static logout = async (req:Request, res:Response) => {
        req.session = null;
        res.status(200).send({});
    };


    //is for debugging
    static checkSession =async (req:Request, res:Response) => {
        const id = res.locals.jwtPayload.id;
        res.status(200).send("still in session: "+id);
    };

}
export default AuthController;
