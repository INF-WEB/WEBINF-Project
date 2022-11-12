import { Router, Request, Response } from "express";
import auth from "./auth";
import user from "./user";

//here need you can add route  main part
//try to split up the routes good

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);

export default routes;
