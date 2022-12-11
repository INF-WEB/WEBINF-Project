import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { UserEntity } from "../database/entities/user.entities";
import { rdfDatabase } from "..";
import { diplomaDegree } from "../Types/enum";

class DiplomaController {
    static getAllDiplomas = async (req:Request, res: Response) => {
        const id = res.locals.jwtPayload.id;
        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });
            //
            //rdfDatabase.
            const result = await rdfDatabase.selectDiplomas(user.userURI);
            res.status(200).send(result);

        }catch (error){
            res.status(404).send("User not found")
        }
    }

    static getDetails =async (req:Request, res:Response) => {
        const userRepository = getRepository(UserEntity);
        let {userID} = req.body;
        if (!(userID)) {
            res.status(400).send("userID are needed!!");
            return;
        }

        try{
            const user = await userRepository.findOneOrFail({
                where: {id:userID},
                select: ["userURI"]
            });
            //
            //rdfDatabase.
            const result = await rdfDatabase.selectDiplomas(user.userURI);
            res.status(200).send(result);

        }catch (error){
            res.status(404).send("User not found")
        }
    }

    static getDiploma = async (req:Request, res: Response) => {
        //const id = res.locals.jwtPayload.id;
        let {diplomaURI} = req.body;
        if (!(diplomaURI)) {
            res.status(400).send("diplomaURI are needed!!");
            return;
        }
        //const userRepository = getRepository(UserEntity);
        try{
            // const user = await userRepository.findOneOrFail({
            //     where: {id:id},
            //     select: ["userURI"]
            // });
            //via userURI en diplomaNumber
            //rdfDatabase.
            const result = await rdfDatabase.selectDiploma(diplomaURI);
            res.status(200).send(result);

        }catch (error){
            res.status(404).send("User not found");
        }
    }

    static createDiploma =async (req:Request, res:Response) => {
        const id = res.locals.jwtPayload.id;
        let {graduation, field, educationalInstitute, degree} = req.body;
        if (!(graduation && field && educationalInstitute && degree)) {
            res.status(400).send("graduation (date) and field and educationalInstitute and degree (right form) are needed!!");
            return;
        }
        let grad: Date = new Date(graduation);
        console.log(grad);
        
        let degreeEnum: diplomaDegree = degree;

        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });
            //via userURI en diplomaNumber
            const diplomaURI = await rdfDatabase.createDiplomaFor(user.userURI, grad, field, degreeEnum, educationalInstitute);
            res.status(200).send("Created Diploma " + diplomaURI);

        }catch (error){
            res.status(404).send("User not found"+error);
        }
    }

    static deleteDiplomaAll =async (req:Request, res:Response) => {
        const id = res.locals.jwtPayload.id;

        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });
            //via userURI en diplomaNumber
            await rdfDatabase.deleteAllDiplomas(user.userURI);
            res.status(200).send("Diplomas are removed");

        }catch (error){
            res.status(404).send("User not found");
        }
    }

    static deleteDiplomaSingle =async (req:Request, res:Response) => {
        const id = res.locals.jwtPayload.id;
        let {diplomaURI} = req.body;
        if (!(diplomaURI)) {
            res.status(400).send("diplomaURI are needed!!");
            return;
        }
        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });
            //via userURI en diplomaNumber
            //rdfDatabase
            rdfDatabase.deleteDiploma(user.userURI, diplomaURI);
            res.status(200).send("Diplomas is removed");

        }catch (error){
            res.status(404).send("User or diploma not found! Possible don't have permissions!");
        }
    }

    //All the data needed, is saved
    //Possible that fields are empty.
    static editDiploma = async (req:Request, res:Response) => {
        const id = res.locals.jwtPayload.id;

        let {diplomaURI, graduation, field, educationalInstitute, degree} = req.body;
        if(!diplomaURI){
            res.status(400).send("diplomaURI is needed, graduation or field or educationalInstitute or degree optional");
            return;
        }
        if (!(graduation || field || educationalInstitute || degree )) {
            res.status(400).send("diplomaURI is needed, graduation or field or educationalInstitute or degree optional");
            return;
        }
        let grad: Date = new Date(graduation);
        let degreeEnum: diplomaDegree = degree;

        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });
            //via userURI en diplomaNumber
            //rdfDatabase
            await rdfDatabase.updateDiploma(user.userURI, diplomaURI, {graduation: grad, field: field, degree: degreeEnum, educationalInstitute: educationalInstitute})
            res.status(200).send("Diploma updated");

        }catch (error){
            res.status(404).send("user or diploma not found! Possible don't have right permissions!");
        }

    }

    

};

export default DiplomaController;
