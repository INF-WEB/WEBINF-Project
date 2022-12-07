import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { UserEntity } from "../database/entities/user.entities";
import { rdfDatabase } from "..";
import { connectionStatus, connectionType } from "../Types/enum";



class ConnController {
    
    //Gives back all connections of user
    static getAllConnections = async (req:Request, res: Response) => {
        const id = res.locals.jwtPayload.id;

        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });
            //
            //rdfDatabase.


        }catch (error){
            res.status(404).send("User not found")
        }

    };

    //Check connection with one user
    static getConnection = async(req:Request, res: Response) => {
        const id = res.locals.jwtPayload.id;
        let {UserConnectId} = req.body;
        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });
            
            const connUser = await userRepository.findOneOrFail({
                where: {id:UserConnectId},
                select: ["userURI"]
            });

            //rdf function to call

        }catch (error){
            res.status(404).send("User not found")
        }
    };

    //Create,update connection with other person
    static answerConnection = async(req:Request, res: Response) => {
        const id = res.locals.jwtPayload.id;
        let {UserConnectId, connectionStatus, connectionType} = req.body;

        let connStatus: connectionStatus = connectionStatus;
        let connType: connectionType = connectionType;
        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });

            const connUser = await userRepository.findOneOrFail({
                where: {id:UserConnectId},
                select: ["userURI"]
            });

            //
            //rdfDatabase.
            rdfDatabase.createConnectionWith(user.userURI, connUser.userURI, connStatus, connType);


        }catch (error){
            res.status(404).send("User not found")
        }
    };


    static getUserConnections = async(req: Request, res: Response) => {

    };
}

export default ConnController;
