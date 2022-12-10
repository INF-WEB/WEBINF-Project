import { Router } from "express";
import JobSearchController from "../controllers/JobSearchController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkType } from "../middlewares/checkType";

const router = Router();

router.post("/Create",
    [checkJwt, checkType(["Company"])],
    JobSearchController.newJob
);


router.get("/detail",
    [checkJwt],
    JobSearchController.getDetail    
);

router.get("/all",
    [checkJwt, checkType(["Company"])],
    JobSearchController.getAllJobs
);

//Maybe change name
router.get("/current",
    [checkJwt, checkType(["Person"])],
    JobSearchController.getAllUserjobs
);

router.get("/myEmployees",
    [checkJwt, checkType(["Company"])],
    JobSearchController.getMyEmployees
);

router.get("/employees",
    [checkJwt],
    JobSearchController.getEmployees
);

router.get("/potenialEmployees",
    [checkJwt, checkType(["Company"])],
    JobSearchController.getPotenEmployees  
);

router.get("/potenialJobs",
    [checkJwt, checkType(["Person"])],
    JobSearchController.getPotenJobs
);

router.put("/editJob",
    [checkJwt, checkType(["Company"])],
    JobSearchController.editJob
);

router.put("/answer",
    [checkJwt, checkType(["Person"])],
    JobSearchController.answerPotJob
);

export default router;
