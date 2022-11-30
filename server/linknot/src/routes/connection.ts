import { Router } from "express";
import ConnController from "../controllers/ConnController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkType } from "../middlewares/checkType";

const router = Router();

router.get("/",
    [checkJwt, checkType(["Person"])],
    ConnController.getUserConnections
    );


export default router;
