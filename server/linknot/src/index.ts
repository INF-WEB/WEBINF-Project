import "reflect-metadata";
import { createConnection, DataSource } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import helmet from "helmet";
import routes from "./routes";

import cookieSession = require("cookie-session");
import * as cors from "cors";
import { binDir, database, databaseDir } from "./RDFAcces/RDFDataAcess";
import * as http from "http";
import * as fs from "fs";
import * as https from "https";
export let rdfDatabase: database;
//Connects to the Database -> then starts the express

//const privateKey = fs.readFileSync("./credentials/key.pem", "utf8");


//possible need to be changed depricated
createConnection()
    .then(async connection => {
    // Create a new express application instance
    const app = express();
    const privateKey = fs.readFileSync("src/credentials/key.pem", "utf8");

    const certificate = fs.readFileSync("src/credentials/cert.pem");
    
    const credentials = {
      key: privateKey,
      cert: certificate
    };
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
    const httpsServer = https.createServer(credentials, app);
    const httpServer = http.createServer(app);
    httpsServer.listen(8080, () => {
      console.log("HTTPS server is running on 8080");
      
    });

    httpServer.listen(3000, () => {
      console.log("HTTP server running on 3000");
      
    });
    // app.listen(3000, () => {
    //   console.log("Server started on port 3000!");
    // });
  })
  .catch(error => console.log(error));
