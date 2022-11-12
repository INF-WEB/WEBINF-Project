import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";

import { UserEntity } from "../database/entities/user.entities";


//Will check after user confurment log if also autheris
//This system works with roles
//need to make it diffrent and check for one user specific???

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Get the user ID from previous midleware
    const id = res.locals.jwtPayload.userId;

    //Get user role from the database
    const userRepository = getRepository(UserEntity);
    let user: UserEntity;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    //Check if array of authorized roles includes the user's role
    if (roles.indexOf(user.role) > -1) next();
    else res.status(401).send();
  };
};
