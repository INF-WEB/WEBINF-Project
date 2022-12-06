
import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkType } from "../middlewares/checkType";

const router = Router();


// Get one user
router.get(
    "/accountDetails",
    [checkJwt, checkType(["Person", "Company", "ADMIN"])],
    UserController.getAccountDetails
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


//TEST just debugging, gives back all the users
router.get(
    "/test",
    [checkJwt],
    UserController.listAll
    );

router.get(
    "/rdfTest",
    [],
    UserController.rdfCheck
    );

router.get(
    "/sheit",
    [],
    UserController.sheit
)

export default router;
