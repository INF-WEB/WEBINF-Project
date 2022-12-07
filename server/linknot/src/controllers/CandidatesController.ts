import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";



class CandidatesController {
    
    static getCandidates = async(req: Request, res: Response) => {

    };
}

export default CandidatesController;
