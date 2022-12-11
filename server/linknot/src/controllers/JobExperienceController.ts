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
            const result = await rdfDatabase.selectProfessionalExperiences(user.userURI);
            res.status(200).send(result);

        }catch (error){
            res.status(404).send("User not found")
        }
    }

    static getExpr =async (req:Request, res:Response) => {
        //const id = res.locals.jwtPayload.id;
        let {ExprURI} = req.body;
        if(!ExprURI){
            res.status(400).send("ExprURI is needed!!");
            return;
        }
        //const userRepository = getRepository(UserEntity);
        try{
            // const user = await userRepository.findOneOrFail({
            //     where: {id:id},
            //     select: ["userURI"]
            // });
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
        if(!(startDate && endDate && description)){
            res.status(400).send("startDate (date form) and endDate (date form) and description are needed!!");
            return;
        }
        const sDate:Date = new Date(startDate);
        const eDate:Date = new Date(endDate);

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
        if(!exprURI){
            res.status(400).send("exprURI is needed!!");
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
            rdfDatabase.deleteProfessionalExperience(user.userURI, exprURI);
            res.status(200).send("Expr is removed");

        }catch (error){
            res.status(404).send("User or Experience not found! Possible not right permissions!");
        }
    }

    static editExpr =async (req:Request, res:Response) => {
        const id = res.locals.jwtPayload.id;

        let {exprURI, startDate, endDate, description} = req.body;
        let sDate: Date = new Date(startDate);
        let eDate: Date = new Date(endDate);
        if(!exprURI){
            res.status(400).send("exprURI needed!!\n startDate (date form) or endDate (date form) or description are optionel\ one is well needed");
            return;
        }
        if(! (startDate|| endDate || description)){
            res.status(400).send("exprURI needed!!\n startDate (date form) or endDate (date form) or description are optionel\n one is well needed");
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
            await rdfDatabase.updateProfessionalExperience(user.userURI, exprURI, {startDate: sDate, endDate: eDate, description: description});
            res.status(200).send("expr updated");

        }catch (error){
            res.status(404).send("User or Experience not found! Possible don't have permission!");
        }
    }
}

export default JobExperienceController;
