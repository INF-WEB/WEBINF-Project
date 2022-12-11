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

router.get("/CompJobs",
    [checkJwt],
    JobSearchController.getAllCompJobs
);

//Maybe change name
router.get("/current",
    [checkJwt, checkType(["Person"])],
    JobSearchController.getAllUserjobs
);

router.get("/PersonJobs",
    [checkJwt],
    JobSearchController.getPersonJobs
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

router.delete("/removeJob",
    [checkJwt, checkType(["Company"])],
    JobSearchController.removeJob  
);

router.get("/matchJobs",
    [checkJwt, checkType(["Person"])],
    JobSearchController.getmatchJobs
);

router.get("/matchCanidates",
    [checkJwt, checkType(["Company"])],
    JobSearchController.getmatchCanidates  
);

router.put("/sendApplication",
    [checkJwt, checkType(["Company"])],
    JobSearchController.sendApplicationTo
);


export default router;
