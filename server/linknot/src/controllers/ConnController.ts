import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { UserEntity } from "../database/entities/user.entities";
import { rdfDatabase } from "..";
import { connectionStatus, connectionType } from "../Types/enum";


//TODO: ask about possible other why to verify or call except with only uri
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
            const result=await rdfDatabase.selectConnections(user.userURI);

            res.status(200).send(result);
        }catch (error){
            res.status(404).send("User not found");
        }

    };

    //Check connection with one user
    //TODO: need to place in check for if user is in connection
    static getConnection = async(req:Request, res: Response) => {
        //const id = res.locals.jwtPayload.id;
        let {connectionURI} = req.body;
        if (!(connectionURI)) {
            res.status(400).send("connectionURI are needed!!");
            return;
        }

        //const userRepository = getRepository(UserEntity);
        try{
            // const user = await userRepository.findOneOrFail({
            //     where: {id:id},
            //     select: ["userURI"]
            // });
            
            // const connUser = await userRepository.findOneOrFail({
            //     where: {id:userConnectId},
            //     select: ["userURI"]
            // });

            //rdf function to call
            const result = await rdfDatabase.selectConnection(connectionURI);
            res.status(200).send(result);
        }catch (error){
            res.status(404).send("User not found")
        }
    };

    //Create,update connection with other person
    static answerConnection = async(req:Request, res: Response) => {
        const id = res.locals.jwtPayload.id;
        let { connectionStatus, connectionType, connectionURI} = req.body;
        if (!( connectionStatus && connectionType && connectionURI)) {
            res.status(400).send("connectionStatus (right form) and connctionType (righform) and connectionURI are needed!!");
            return;
        }
        let connStatus: connectionStatus = connectionStatus;
        let connType: connectionType = connectionType;
        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });

            // const connUser = await userRepository.findOneOrFail({
            //     where: {id:userConnectId},
            //     select: ["userURI"]
            // });

            //
            //rdfDatabase.
            await rdfDatabase.updateConnection(user.userURI, connectionURI, {status: connStatus, type: connType});

            res.status(200).send("Connection is changed");
        }catch (error){
            res.status(404).send("user or conenction not found! Or don't have right permissions");
        }
    };


    static createConnection =async (req:Request, res:Response) => {
        const id = res.locals.jwtPayload.id;
        let {userConnectId, connectionStat, connectionType} = req.body;
        if (!(userConnectId && connectionStat && connectionType )) {
            res.status(400).send("userConnectId and connectionStat (right form) and connctionType (righform) are needed!!");
            return;
        }
        let connStatus: connectionStatus = connectionStat;
        let connType: connectionType = connectionType;
        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });

            const connUser = await userRepository.findOneOrFail({
                where: {id:userConnectId},
                select: ["userURI"]
            });
            let connURI: string;
            if(connStatus === connectionStatus.Pending){
                connURI = await rdfDatabase.createConnectionWith(user.userURI, connUser.userURI, connStatus, connType);
            }else{
                res.status(400).send("Need to be Pending");
            }
            res.status(200).send("Connection is Pending" + connURI);

            //
            //rdfDatabase.
            

        }catch (error){
            res.status(404).send("User not found");
        }
    }


    static deleteConnection = async (req:Request, res:Response) => {
        const id = res.locals.jwtPayload.id;
        let { connectionURI} = req.body;
        if (!(connectionURI)) {
            res.status(400).send("connectionURI is needed!!");
            return;
        }
        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });

            // const connUser = await userRepository.findOneOrFail({
            //     where: {id:userConnectId},
            //     select: ["userURI"]
            // });

            //rdfdatabase remove user
            rdfDatabase.deleteConnection(user.userURI, connectionURI);

            res.status(200).send("Connection is removed");
        }catch(error){
            res.status(404).send("User or Connection not found! Possible not right permissions!");
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

            
            await rdfDatabase.deleteAllConnections(user.userURI);
            //rdfdatabase remove all user

            res.status(200).send("Connections are removed");
        }catch(error){
            res.status(404).send("User not found");
        }

    }
}

export default ConnController;
