import { Router, Request, Response } from "express";
import auth from "./auth";
import connection from "./connection";
import jobSearch from "./jobSearch";
import user from "./user";
import diploma from "./diploma";
import router from "./auth";
import jobExperience from "./jobExperience";
//here need you can add route  main part
//try to split up the routes good

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/connection", connection);
routes.use("/job", jobSearch);
routes.use("/diploma", diploma);
router.use("/jobExpr", jobExperience);

export default routes;
