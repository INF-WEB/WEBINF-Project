
import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkType } from "../middlewares/checkType";

const router = Router();


// Get logged in user
router.get(
    "/Details",
    [checkJwt, checkType(["Person", "Company", "ADMIN"])],
    UserController.getAccountDetails
    );

router.get(
    "/accountDetail",
    [checkJwt],
    UserController.getDetails
);

//Create a new user
//Rest of data by json
router.post(
    "/Create", 
    [], 
    UserController.newUser
    );

//Edit logged in user
router.patch(
    "/edit",
    [checkJwt, checkType(["Person", "Company", "ADMIN"])],
    UserController.editUser
    );

//Delete logged in user
router.delete(
    "/remove",
    [checkJwt, checkType(["Person", "Company", "ADMIN"])],
    UserController.deleteUser
    );




export default router;
