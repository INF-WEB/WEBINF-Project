import { Router } from "express";
import CandidatesController from "../controllers/CandidatesController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkType } from "../middlewares/checkType";

const router = Router();

router.get("/",
    [checkJwt, checkType(["Person"])],
    CandidatesController.getCandidates
    );


export default router;
