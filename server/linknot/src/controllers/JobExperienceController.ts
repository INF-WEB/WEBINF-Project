import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";
import { UserEntity } from "../database/entities/user.entities";
import { rdfDatabase } from "..";

class JobExperienceController {

    static getAllExpr = async (req: Request, res: Response) =>{
        const id = res.locals.jwtPayload.id;
        const userRepository = getRepository(UserEntity);

        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });
            //
            //rdfDatabase.
            const result = await rdfDatabase.selectProfessionalExperiences(user.userURI);
            res.status(200).send(result);

        }catch (error){
            res.status(404).send("User not found")
        }
    }

    static getExpr =async (req:Request, res:Response) => {
        const id = res.locals.jwtPayload.id;
        let {ExprURI} = req.body;

        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });
            //via userURI en ExprURI
            //rdfDatabase.
            const result = await rdfDatabase.selectProfessionalExperience(ExprURI);
            res.status(200).send(result);

        }catch (error){
            res.status(404).send("User not found");
        } 
    }

    static createExpr =async (req:Request, res:Response) => {
        const id = res.locals.jwtPayload.id;
        let {startDate, endDate, description} = req.body;
        const sDate:Date = startDate;
        const eDate:Date = endDate;

        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });
            const exprURI = await rdfDatabase.createProfessionalExperienceFor(user.userURI, sDate, eDate, description);
            res.status(200).send("Created Exprience " + exprURI);

        }catch (error){
            res.status(404).send("User not found");
        }
    }

    static deleteExprAll =async (req:Request, res:Response) => {
        const id = res.locals.jwtPayload.id;

        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });
            //via userURI en diplomaNumber
            await rdfDatabase.deleteAllProfessionalExperiences(user.userURI);
            res.status(200).send("Expriences are removed");

        }catch (error){
            res.status(404).send("User not found");
        }
    }


    static deleteExprSingle =async (req:Request, res:Response) => {
        const id = res.locals.jwtPayload.id;
        let {exprURI} = req.body;
        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });
            //via userURI en diplomaNumber
            //rdfDatabase
            rdfDatabase.deleteProfessionalExperience(exprURI);
            res.status(200).send("Expr is removed");

        }catch (error){
            res.status(404).send("User not found");
        }
    }

    static editExpr =async (req:Request, res:Response) => {
        const id = res.locals.jwtPayload.id;

        let {exprURI, startDate, endDate, description} = req.body;
        let sDate: Date = startDate;
        let eDate: Date = endDate;

        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });
            //via userURI en diplomaNumber
            //rdfDatabase
            await rdfDatabase.updateProfessionalExperience(exprURI, {startDate: sDate, endDate: eDate, description: description});
            res.status(200).send("expr updated");

        }catch (error){
            res.status(404).send("User not found");
        }
    }
}

export default JobExperienceController;
