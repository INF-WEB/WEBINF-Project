import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { isRFC3339, validate } from "class-validator";
import { UserEntity } from "../database/entities/user.entities";
import { rdfDatabase } from "..";
import { diplomaDegree, jobStatus } from "../Types/enum";



class JobSearchController {
    
    static newJob = async(req: Request, res: Response) => {
        const id = res.locals.jwtPayload.id;
        let {jobName, area, workExpr, diploma, jobDescr, status, type} = req.body;
        if(!(jobName && area && workExpr && diploma && jobDescr && status && type)){
            res.status(400).send("jobName and area and workExpr and diploma (degree) && jobDescr && status (jobStatus) && type are needed!!");
            return;
        }
        const diplDegree: diplomaDegree = diploma;
        const jobStat: jobStatus = status;

        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });
            const jobURI = await rdfDatabase.createJob(user.userURI, jobName, area, workExpr, diplDegree, jobDescr, jobStat, type);
            res.status(200).send("Created job " + jobURI);

        }catch (error){
            res.status(404).send("Couldn't create job");
        }
    };

    static getDetail =async (req:Request, res:Response) => {
        let {jobURI} = req.body;
        if(!jobURI){
            res.status(400).send("jobURI is needed!!");
            return;
        }

        try{
            const result = await rdfDatabase.selectJob(jobURI);
            res.status(200).send(result);
        
        }catch(error){
            res.status(404).send("job not found");
        }
    }

    static getAllJobs =async (req:Request, res:Response) => {
        const id = res.locals.jwtPayload.id;

        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });
            const results = await rdfDatabase.selectJobsCompany(user.userURI);
            res.status(200).send(results);

        }catch (error){
            res.status(404).send("user not found");
        }
    }


    static getAllUserjobs =async (req:Request, res:Response) => {
        const id = res.locals.jwtPayload.id;

        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });
            const results = await rdfDatabase.selectJobsUser(user.userURI);
            res.status(200).send(results);

        }catch (error){
            res.status(404).send("user not found");
        }
    }

    static getMyEmployees =async (req:Request, res:Response) => {
        const id = res.locals.jwtPayload.id;

        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });
            const results = await rdfDatabase.selectEmployees(user.userURI);
            res.status(200).send(results);

        }catch (error){
            res.status(404).send("Company not found");
        }
    }
    

    static getEmployees =async (req:Request, res:Response) => {
        let {companyId} = req.body;
        if(!companyId){
            res.status(400).send("companyId is needed!!");
            return;
        }
        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:companyId},
                select: ["userURI"]
            });
            const results = await rdfDatabase.selectEmployees(user.userURI);
            res.status(200).send(results);

        }catch (error){
            res.status(404).send("Company not found");
        }
    }

    static getPotenEmployees =async (req:Request, res:Response) => {
        const id = res.locals.jwtPayload.id;

        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });
            const results = await rdfDatabase.selectPotentialEmployees(user.userURI);
            res.status(200).send(results);

        }catch (error){
            res.status(404).send("Company not found");
        }
    }

    static getPotenJobs =async (req:Request, res:Response) => {
        const id = res.locals.jwtPayload.id;

        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });
            const results = await rdfDatabase.selectPotentialJobs(user.userURI);
            res.status(200).send(results);

        }catch (error){
            res.status(404).send("User not found!!");
        }
    }

    static editJob =async (req:Request, res:Response) =>{
        const id = res.locals.jwtPayload.id;
        let {jobURI, jobName, area, workExpr, diploma, jobDescr, status, type} = req.body;
        if(!jobURI){
            res.status(400).send("jobURI needed!!\n jobName, area, workExpr, diploma (degree), jobDescr, status (joStatus) or type optinel. one requiered");
            return;
        }
        if(!(jobName || area || workExpr || diploma || jobDescr || status || type)){
            res.status(400).send("jobURI needed!!\n jobName, area, workExpr, diploma (degree), jobDescr, status (joStatus) or type optinel. one requiered");
            return;
        }
        const diplDegree: diplomaDegree = diploma;
        const jobStat: jobStatus = status;

        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });
            //via userURI en diplomaNumber
            //rdfDatabase
            await rdfDatabase.updateJob(user.userURI, jobURI, {jobName:jobName, area:area, workexperience:workExpr, diploma: diplDegree, jobdescription: jobDescr, status: jobStat, type: type});
            res.status(200).send("job updated");

        }catch (error){
            res.status(404).send("job not found!! Or don't have permission!!");
        }
    }

    static answerPotJob =async (req:Request, res:Response) => {
        const id = res.locals.jwtPayload.id;
        let {jobURI, accepted} = req.body;
        if(!(jobURI && accepted)){
            res.status(400).send("jobURI and accepted (boolean) are needed !!");
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
            await rdfDatabase.updatePotentialJob(user.userURI, jobURI, Boolean(accepted));
            res.status(200).send("potenial job updated");

        }catch (error){
            res.status(404).send("Job or user not found!! Possible not right permissions!");
        }
    }

    static removeJob =async (req:Request, res:Response) => {
        const id = res.locals.jwtPayload.id;
        let {jobURI} = req.body;
        if(!(jobURI)){
            res.status(400).send("jobURI is needed !!");
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
            await rdfDatabase.deleteJob(user.userURI, jobURI);
            res.status(200).send("potenial job updated");

        }catch (error){
            res.status(404).send("Job or Company not found! Or don't have permission");
        }
    }

    static getmatchJobs =async (req:Request, res:Response) => {
        const id = res.locals.jwtPayload.id;
        let {jobType, companyURI, maxDistance, checkDegree} = req.body;
        let degree: boolean = false;
        if(maxDistance){
            if(isNaN(maxDistance)){
                res.status(400).send("maxDistance is a number (km)!\n other possible values jobType, companyURI and checkDegree (boolean)");
                return;
            }
        }
        if(checkDegree){
            if(checkDegree == "true"){
                degree = true;
            }
        }

        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });
            //via userURI en diplomaNumber
            //rdfDatabase
            const result = await rdfDatabase.matchForUser({userURI:user.userURI, jobType:jobType, companyURI:companyURI, maxDistanceKm: maxDistance, checkDegree: degree});
            res.status(200).send(result);

        }catch (error){
            res.status(404).send("Job or Company not found! Or don't have permission");
        }
    }

    static getmatchCanidates =async (req:Request, res:Response) => {
        const id = res.locals.jwtPayload.id;
        let {jobURI, maxDistance, checkDegree} = req.body;
        let degree: boolean = false;
        if(maxDistance){
            if(isNaN(maxDistance)){
                res.status(400).send("maxDistance is a number (km)!\n other possible values jobType, companyURI and checkDegree (boolean)");
                return;
            }
        }
        if(checkDegree){
            if(checkDegree == "true"){
                degree = true;
            }
        }

        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });
            //via userURI en diplomaNumber
            //rdfDatabase
            const result = await rdfDatabase.matchForJob(user.userURI, {jobURI:jobURI, maxDistanceKm: maxDistance, checkDegree: degree});
            res.status(200).send(result);

        }catch (error){
            res.status(404).send("Job or Company not found! Or don't have permission");
        }
    }


    static sendApplicationTo =async (req:Request, res:Response) => {
        const id = res.locals.jwtPayload.id;
        let {jobURI, receiverID} = req.body;
        if(!(jobURI && receiverID)){
            res.status(400).send("jobURI and receiverID are needed!");
            return;
        }

        const userRepository = getRepository(UserEntity);
        try{
            const user = await userRepository.findOneOrFail({
                where: {id:id},
                select: ["userURI"]
            });
            const receiver = await userRepository.findOneOrFail({
                where: {id:receiverID},
                select: ["userURI"]
            });
            

            await rdfDatabase.sendJobApplicationToUser(user.userURI, jobURI, receiver.userURI);
            res.status(200).send("Application is send");

        }catch (error){
            res.status(404).send("Job, Company or user not found! Or don't have permission");
        }
    }

}

export default JobSearchController;
