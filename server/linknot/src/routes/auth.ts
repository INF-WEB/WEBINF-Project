import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { checkJwt } from "../middlewares/checkJwt";

//For when user has account and logins
//

const router = Router();
//Login route
router.post(
    "/login",
    AuthController.login
    );

//Change my password
router.post(
    "/change-password", 
    [checkJwt], 
    AuthController.changePassword
    );

router.get(
    "/logout",
    AuthController.logout
    );

export default router;
