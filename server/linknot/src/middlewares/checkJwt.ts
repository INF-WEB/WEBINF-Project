import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { TokenPayload } from "../Types/types";

//called with every request when logged in user needed.
//does valitdation of JWT is coorect


//Need to be further searched to possible improve
export const checkJwt = (req: Request, res: Response, next: NextFunction) => {

    
    const token= req.session.jwt;
    
    //Try to validate the token and get data
    try {
        const jwtPayload:TokenPayload = <TokenPayload>jwt.verify(token, config.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
        console.log(jwtPayload);
        const payload = {email: jwtPayload.email, id: jwtPayload.id}
        const newToken = createJWT(payload, "1h");

        req.session = {jwt:newToken};
    } catch (error) {
        //If token is not valid, respond with 401 (unauthorized)
        res.status(401).send();
        return;
    }

   

    //Call the next middleware or controller
    next();
};

//Creates a new JWT token give 
//payload and expiresdata
export const createJWT = (dataPayload: TokenPayload, expiresIn: string): string =>{
    return jwt.sign(dataPayload, config.jwtSecret, {
        expiresIn: expiresIn
    });
};

