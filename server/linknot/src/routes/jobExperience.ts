import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import { checkType } from "../middlewares/checkType";
import JobExperienceController from "../controllers/JobExperienceController";


const router = Router();

router.get("/all",
    [checkJwt, checkType(["Person"])],
    JobExperienceController.getAllExpr
);

router.get("/detail",
    [checkJwt],
    JobExperienceController.getDetails)

router.get("/single",
    [checkJwt],
    JobExperienceController.getExpr
    );
    
router.post("/create",
    [checkJwt, checkType(["Person"])],
    JobExperienceController.createExpr
    );

router.delete("/deleteAll",
    [checkJwt, checkType(["Person"])],
    JobExperienceController.deleteExprAll
    );


router.delete("/deleteSingle",
    [checkJwt, checkType(["Person"])],
    JobExperienceController.deleteExprSingle
    );

router.put("/edit",
    [checkJwt, checkType(["Person"])],
    JobExperienceController.editExpr
    );

export default router;
