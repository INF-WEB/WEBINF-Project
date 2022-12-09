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

    static getDiploma = async (req:Request, res: Response) => {
        const id = res.locals.jwtPayload.id;
        let {diplomaURI} = req.body;

        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });
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
        let grad: Date = graduation;
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
            res.status(404).send("User not found");
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
        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });
            //via userURI en diplomaNumber
            //rdfDatabase
            rdfDatabase.deleteDiploma(diplomaURI);
            res.status(200).send("Diplomas are removed");

        }catch (error){
            res.status(404).send("User not found");
        }
    }

    //All the data needed, is saved
    //Possible that fields are empty.
    static editDiploma = async (req:Request, res:Response) => {
        const id = res.locals.jwtPayload.id;

        let {diplomaURI, graduation, field, educationalInstitute, degree} = req.body;
        let grad: Date = graduation;
        let degreeEnum: diplomaDegree = degree;

        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });
            //via userURI en diplomaNumber
            //rdfDatabase
            await rdfDatabase.updateDiploma(diplomaURI, {graduation: grad, field: field, degree: degreeEnum, educationalInstitute: educationalInstitute})
            res.status(200).send("Diplomas are removed");

        }catch (error){
            res.status(404).send("User not found");
        }

    }

    

};

export default DiplomaController;
