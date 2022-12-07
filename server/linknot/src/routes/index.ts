import { Router, Request, Response } from "express";
import auth from "./auth";
import candidates from "./candidates";
import connection from "./connection";
import jobSearch from "./jobSearch";
import user from "./user";
import diploma from "./diploma"

//here need you can add route  main part
//try to split up the routes good

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/connection", connection);
routes.use("/jobSearch", jobSearch);
routes.use("/candidates", candidates);
routes.use("/diploma", diploma);

export default routes;
