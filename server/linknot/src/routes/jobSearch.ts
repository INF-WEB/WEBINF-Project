import { Router } from "express";
import JobSearchController from "../controllers/JobSearchController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkType } from "../middlewares/checkType";

const router = Router();

router.get("/",
    [checkJwt, checkType(["Person"])],
    JobSearchController.getJobPossible
    );


export default router;
