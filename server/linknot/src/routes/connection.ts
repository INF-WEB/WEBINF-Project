import { Router } from "express";
import ConnController from "../controllers/ConnController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkType } from "../middlewares/checkType";

const router = Router();

//gives back all the persons connections
router.get("/getAll",
    [checkJwt, checkType(["Person"])],
    ConnController.getAllConnections
    );


//Check connection with user
router.get("/Single",
    [checkJwt, checkType(["Person"])],
    ConnController.getConnection
    );

//Create,update connection with other person
router.put("/Answer",
    [checkJwt, checkType(["Person"])],
    ConnController.answerConnection
);

router.post("/Create",
    [checkJwt, checkType(["Person"])],
    ConnController.createConnection
);

router.delete("/Delete",
    [checkJwt, checkType(["Person"])],
    ConnController.deleteConnection
    );

router.delete("/DeleteAll",
    [checkJwt, checkType(["Person"])],
    ConnController.deleteConnectionAll
    );

export default router;
