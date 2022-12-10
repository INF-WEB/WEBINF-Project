import { Router } from "express";
import DiplomaController from "../controllers/DiplomaController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkType } from "../middlewares/checkType";

//For when user has account and logins
//

const router = Router();

router.get("/all",
    [checkJwt, checkType(["Person"])],
    DiplomaController.getAllDiplomas
);


router.get("/detail",
    [checkJwt],
    DiplomaController.getDetails
);

router.get("/single",
    [checkJwt],
    DiplomaController.getDiploma
    );
    
router.post("/create",
    [checkJwt, checkType(["Person"])],
    DiplomaController.createDiploma
    );

router.delete("/deleteAll",
    [checkJwt, checkType(["Person"])],
    DiplomaController.deleteDiplomaAll
    );


router.delete("/deleteSingle",
    [checkJwt, checkType(["Person"])],
    DiplomaController.deleteDiplomaSingle
    );

router.put("/edit",
    [checkJwt, checkType(["Person"])],
    DiplomaController.editDiploma
    );

export default router;
