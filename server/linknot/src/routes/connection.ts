import { Router } from "express";
import ConnController from "../controllers/ConnController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkType } from "../middlewares/checkType";

const router = Router();

//gives back all the persons connections
router.get("/Connections",
    [checkJwt, checkType(["Person"])],
    ConnController.getAllConnections
    );


//Check connection with user
router.get("/Connection",
    [checkJwt, checkType(["Person"])],
    ConnController.getConnection
    );

//Create,update connection with other person
router.put("/Connection",
    [checkJwt, checkType(["Person"])],
    ConnController.answerConnection
);

export default router;
