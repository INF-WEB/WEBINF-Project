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
//Not tested 
router.post(
    "/change-password", 
    [checkJwt], 
    AuthController.changePassword
    );

//Removes session
router.get(
    "/logout",
    AuthController.logout
    );


router.get(
    "/check",
    [checkJwt],
    AuthController.checkSession
);

export default router;
