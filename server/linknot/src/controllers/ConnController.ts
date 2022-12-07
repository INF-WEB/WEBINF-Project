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

            res.status(200).send();
        }catch (error){
            res.status(404).send("User not found");
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
            res.status(200).send();
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
            await rdfDatabase.createConnectionWith(user.userURI, connUser.userURI, connStatus, connType);

            res.status(200).send("Connection is changed");
        }catch (error){
            res.status(404).send("User not found");
        }
    };


    static createConnection =async (req:Request, res:Response) => {
        const id = res.locals.jwtPayload.id;
        let {UserConnectId, connectionStat, connectionType} = req.body;

        let connStatus: connectionStatus = connectionStat;
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

            if(connStatus === connectionStatus.Pending){
                await rdfDatabase.createConnectionWith(user.userURI, connUser.userURI, connStatus, connType);
            }else{
                res.status(400).send("Need to be Pending");
            }
            res.status(200).send("Connection is Pending");

            //
            //rdfDatabase.
            

        }catch (error){
            res.status(404).send("User not found");
        }
    }


    static deleteConnection = async (req:Request, res:Response) => {
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

            //rdfdatabase remove user

            res.status(200).send("Connection is Pending");
        }catch(error){
            res.status(404).send("User not found");
        }

    }

    
    static deleteConnectionAll = async (req:Request, res:Response) => {
        const id = res.locals.jwtPayload.id;
        

        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });

            

            //rdfdatabase remove all user

            res.status(200).send("Connection is Pending");
        }catch(error){
            res.status(404).send("User not found");
        }

    }
}

export default ConnController;
