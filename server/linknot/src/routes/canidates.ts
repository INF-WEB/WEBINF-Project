import { Router } from "express";
import CanidatesController from "../controllers/CanidatesController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkType } from "../middlewares/checkType";

const router = Router();

router.get("/",
    [checkJwt, checkType(["Person"])],
    CanidatesController.getCanidates
    );


export default router;
