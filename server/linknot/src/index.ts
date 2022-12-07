import "reflect-metadata";
import { createConnection, DataSource } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import helmet from "helmet";
import routes from "./routes";
//import cors from "./cors" ;
//import * as cookieSession from "cookie-session";
import cookieSession = require("cookie-session");
import * as cors from "cors";
import { binDir, database, databaseDir } from "./RDFAcces/RDFDataAcess";

export let rdfDatabase: database;
//Connects to the Database -> then starts the express

//possible need to be changed depricated
createConnection()
    .then(async connection => {
    // Create a new express application instance
    const app = express();

    rdfDatabase = new database(binDir,databaseDir);

    // Call midlewares
    app.use(cors());
   
    app.use(cookieSession({
        name: "session",
        keys: ["key1", "key2"]
    }));

    app.use(helmet());
    app.use(bodyParser.json());

    //Set all routes from routes folder
    app.use("/", routes);

    app.listen(3000, () => {
      console.log("Server started on port 3000!");
    });
  })
  .catch(error => console.log(error));
