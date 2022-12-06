var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const workingDir = "..";
const { v4: uuidv4 } = require('uuid');
const geode = require('geode');
var geo = new geode('matieke6000', { language: 'en', countryCode: 'BE' });
//const DataFactory = require(workingDir+'/node_modules/rdf');
const Client = require('jena-tdb/ParsingClient');
import { jobStatus } from './jobStatus';
import { connectionType } from './connectionType';
import { connectionStatus } from './connectionStatus';
// const binDir : string = "/Users/matiesclaesen/Documents/WEBINF/apache-jena-4.6.1/bin";
// const databaseDir : string = "/Users/matiesclaesen/Documents/repos/WEBINF-Project/database-nodejs/database";
const binDir = "../apache-jena/bin";
const databaseDir = "../database";
var dateFormat = require("dateformat");
export class database {
    constructor(binDir, databaseDir) {
        this.binDir = binDir;
        this.databaseDir = databaseDir;
        this.client = new Client({
            bin: this.binDir,
            db: this.databaseDir
        });
        ;
        this.rdf = require('../node_modules/rdf');
        this.databaseDir = databaseDir;
        database.foaf = this.rdf.ns('http://xmlns.com/foaf/0.1/');
        database.vCard = this.rdf.ns('http://www.w3.org/2001/vcard-rdf/3.0#');
        database.dc = this.rdf.ns('http://purl.org/dc/elements/1.1/');
        database.dcat = this.rdf.ns('http://www.w3.org/ns/dcat#');
        database.gn = this.rdf.ns('https://www.geonames.org/ontology#');
    }
    initDatabse() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.databaseDir != "")
                yield this.client.endpoint.importFiles([require.resolve(this.databaseDir)]);
        });
    }
    /**
     * Gets the last index from the bag + 1
     * @param bag
     * @returns
     */
    getBagCount(bag) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.client.query.select(`
            SELECT * WHERE {
                <` + bag + `> ?pred ?obj .
            }
        `);
            let max = 0;
            result.forEach((element) => {
                const outputBagURI = element.pred.value.toString();
                const splittedOutputBagURI = outputBagURI.split(this.rdf.rdfns('_'));
                const lastIndex = 1;
                const currentNumBagURI = Number(splittedOutputBagURI[lastIndex]);
                if (max < currentNumBagURI)
                    max = currentNumBagURI;
            });
            return max + 1;
        });
    }
    /**
     * Creates a user
     * @param firstName
     * @param lastName
     * @param email
     * @param area
     * @param webpage
     * @param lookingForJob
     * @returns URI of newly created user
     */
    createUser(firstName, lastName, email, area, webpage, lookingForJob, userid) {
        return __awaiter(this, void 0, void 0, function* () {
            let userURI = database.WEB_DOMAIN + firstName + lastName + "-" + userid;
            let fullName = firstName + " " + lastName;
            const { NamedNode, BlankNode, Literal } = this.rdf;
            let namedNode = new NamedNode(userURI);
            let typeTriple = new this.rdf.Triple(namedNode, this.rdf.rdfsns('type'), new Literal(database.WEB_DOMAIN + "type/user"));
            let fullNameTriple = new this.rdf.Triple(namedNode, database.vCard('FN'), new Literal(fullName));
            const blankNodeName = new BlankNode();
            let nameTriple = new this.rdf.Triple(namedNode, database.vCard('N'), blankNodeName);
            let firstNameTriple = new this.rdf.Triple(blankNodeName, database.vCard('given-name'), new Literal(firstName));
            let lastNameTriple = new this.rdf.Triple(blankNodeName, database.vCard('family-name'), new Literal(lastName));
            let emailTriple = new this.rdf.Triple(namedNode, database.foaf('mbox'), new Literal(email));
            let webpageTriple = new this.rdf.Triple(namedNode, database.foaf('homepage'), new Literal(webpage));
            let areaTriple = new this.rdf.Triple(namedNode, database.gn('name'), new Literal(area));
            let lookingForJobTriple = new this.rdf.Triple(namedNode, userURI + "/looking-for-job", new Literal(String(lookingForJob), this.rdf.xsdns("boolean")));
            yield this.client.query.update(`
        INSERT {` + typeTriple.toNT() + `} WHERE {};
        INSERT {` + fullNameTriple.toNT() + `} WHERE {};
        INSERT { 
                    <` + userURI + `> <` + database.vCard("N") + `> 
                        [   
                            <` + database.vCard("given-name") + `> \"` + firstName + `\"; 
                            <` + database.vCard("family-name") + `> \"` + lastName + `\" 
                        ] 
                } WHERE {};
        INSERT {` + emailTriple.toNT() + `} WHERE {};
        INSERT {` + webpageTriple.toNT() + `} WHERE {};
        INSERT {` + areaTriple.toNT() + `} WHERE {};
        INSERT {` + lookingForJobTriple.toNT() + `} WHERE {};
        `);
            return userURI;
        });
    }
    ;
    formatToXSDdate(date) {
        let formattedString = String(date.getFullYear()) + "-" + String(date.getMonth() + 1) + "-" + String(date.getDay());
        return formattedString;
    }
    /**
     *
     * @param userURI
     * @param graduation
     * @param jobType
     * @param educationalInstitute
     * @returns diplomas bag uri
     */
    createDiplomaFor(userURI, graduation, jobType, educationalInstitute) {
        return __awaiter(this, void 0, void 0, function* () {
            const { NamedNode, BlankNode, Literal } = this.rdf;
            let diplomaBagURI = userURI + "/diplomas";
            let diplomaNode = new NamedNode(database.WEB_DOMAIN + "diplomas/diploma-" + uuidv4());
            let bagIndex = yield this.getBagCount(diplomaBagURI);
            let diplomaInBag = new this.rdf.Triple(diplomaBagURI, this.rdf.rdfns('_' + bagIndex), diplomaNode);
            let typeTriple = new this.rdf.Triple(diplomaNode, this.rdf.rdfsns('type'), new Literal(database.WEB_DOMAIN + "type/diploma"));
            let dateTriple = new this.rdf.Triple(diplomaNode, database.dc('date'), new Literal(this.formatToXSDdate(graduation), this.rdf.xsdns("date")));
            let adresTriple = new this.rdf.Triple(diplomaNode, database.gn('name'), new Literal(educationalInstitute));
            //TODO: jobTypeproperty
            const result = yield this.client.query.update(`
            INSERT {` + diplomaInBag.toNT() + `} WHERE {};
            INSERT {` + typeTriple.toNT() + `} WHERE {};
            INSERT {` + dateTriple.toNT() + `} WHERE {};
            INSERT {` + adresTriple.toNT() + `} WHERE {};
        `);
            return diplomaBagURI;
        });
    }
    /**
     *
     * @param userURI
     * @param startDate
     * @param endDate
     * @param description
     */
    createProfessionalExperienceFor(userURI, startDate, endDate, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const { NamedNode, BlankNode, Literal } = this.rdf;
            let professionalBagURI = userURI + "/professional-experiences";
            let professionalURI = professionalBagURI + "/professionalExperience-" + uuidv4();
            let professionalNode = new NamedNode(professionalURI);
            let bagIndex = yield this.getBagCount(professionalBagURI);
            let professionalInBag = new this.rdf.Triple(professionalBagURI, this.rdf.rdfns('_' + bagIndex), professionalNode);
            let startDateTriple = new this.rdf.Triple(professionalNode, database.dcat('startDate'), new Literal(this.formatToXSDdate(startDate), this.rdf.xsdns("date")));
            let endDateTriple = new this.rdf.Triple(professionalNode, database.dcat('endDate'), new Literal(this.formatToXSDdate(endDate), this.rdf.xsdns("date")));
            let descriptionTriple = new this.rdf.Triple(professionalNode, database.dc('description'), new Literal(description));
            let typeTriple = new this.rdf.Triple(professionalNode, this.rdf.rdfsns('type'), new Literal(database.WEB_DOMAIN + "type/professional-experience"));
            const result = yield this.client.query.update(`
        INSERT {` + professionalInBag.toNT() + `} WHERE {};
        INSERT {` + typeTriple.toNT() + `} WHERE {};
        INSERT {` + startDateTriple.toNT() + `} WHERE {};
        INSERT {` + endDateTriple.toNT() + `} WHERE {};
        INSERT {` + descriptionTriple.toNT() + `} WHERE {};
        `);
        });
    }
    /**
     * returns the "name" of the URI
     * (which is set after last '/' in the URI)
     * @param URI the URI containing the name
     * @returns the name of the URI
     */
    getLastSubstring(URI) {
        return URI.substring(URI.lastIndexOf("/") + 1);
    }
    ;
    /**
     *
     * @param userURI1
     * @param userURI2
     * @param status
     * @param type
     */
    createConnectionWith(userURI1, userURI2, status, type) {
        return __awaiter(this, void 0, void 0, function* () {
            let connection1BagURI = userURI1 + "/connections";
            let connection2BagURI = userURI2 + "/connections";
            let connectionURI = database.WEB_DOMAIN + "connection/" + this.getLastSubstring(userURI1) + ";" + this.getLastSubstring(userURI2);
            const { NamedNode, BlankNode, Literal } = this.rdf;
            let connectionURINode = new NamedNode(connectionURI);
            let bagIndex = yield this.getBagCount(connection1BagURI);
            let connectionInBagUser1 = new this.rdf.Triple(connection1BagURI, this.rdf.rdfns('_' + bagIndex), connectionURINode);
            bagIndex = yield this.getBagCount(connection2BagURI);
            let connectionInBagUser2 = new this.rdf.Triple(connection2BagURI, this.rdf.rdfns('_' + bagIndex), connectionURINode);
            let connectionTypeTriple = new this.rdf.Triple(connectionURINode, this.rdf.rdfsns('type'), new Literal(database.WEB_DOMAIN + "type/connection"));
            let connectionStatusTriple = new this.rdf.Triple(connectionURINode, connectionURI + "/status", new Literal(status.toString()));
            let connectionHasType = new this.rdf.Triple(connectionURINode, connectionURI + "/type", new Literal(type.toString()));
            const result = yield this.client.query.update(`
            INSERT {` + connectionInBagUser1.toNT() + `} WHERE {};
            INSERT {` + connectionInBagUser2.toNT() + `} WHERE {};
            INSERT {` + connectionTypeTriple.toNT() + `} WHERE {};
            INSERT {` + connectionStatusTriple.toNT() + `} WHERE {};
            INSERT {` + connectionHasType.toNT() + `} WHERE {};
        `);
        });
    }
    ;
    addPotentialJob(userURI, //Resource user
    jobURI, //Resource job
    isAccepted) {
        return __awaiter(this, void 0, void 0, function* () {
            let pojoBagURI = userURI + "/potential-jobs";
            let pojoURI = userURI + "/potential-job" + uuidv4();
            let bagIndex = yield this.getBagCount(pojoBagURI);
            //TODO: jobtypeProperty
            const result = yield this.client.query.update(`
            INSERT { 
                <` + pojoBagURI + `> <` + this.rdf.rdfns('_' + bagIndex) + `> 
                    [   
                        <` + pojoURI + `> <` + jobURI + `>; 
                        <` + pojoURI + `/isAccepted> \"` + String(isAccepted) + `\" 
                    ] 
            } WHERE {};
        `);
            console.log(result);
        });
    }
    ;
    addJobToEmployee(userURI, //Resourse user
    jobURI //Resourse job
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            let jobBagURI = userURI + "/jobs";
            let bagIndex = yield this.getBagCount(jobBagURI);
            const result = yield this.client.query.update(`
            INSERT { 
                <` + jobBagURI + `> <` + this.rdf.rdfns('_' + bagIndex) + `> <` + jobURI + `> 
            } WHERE {};
        `);
        });
    }
    /**
     *
     * @param companyEmail
     * @param companyName
     * @param companyWebsite
     * @param companyHeadQuaters
     * @returns
     */
    createCompany(companyEmail, companyName, companyWebsite, companyHeadQuaters, companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            let companyURI = database.WEB_DOMAIN + companyName + "-" + companyId;
            const { NamedNode, BlankNode, Literal } = this.rdf;
            let companyNode = new NamedNode(companyURI);
            let TypeCompany = new this.rdf.Triple(companyNode, this.rdf.rdfsns('type'), new Literal(database.WEB_DOMAIN + "type/company"));
            let companyTripleName = new this.rdf.Triple(companyNode, database.vCard('FN'), new Literal(companyName));
            let companyTripleEmail = new this.rdf.Triple(companyNode, database.foaf('mbox'), new Literal(companyEmail));
            let companyTripleHeadquaters = new this.rdf.Triple(companyNode, database.foaf('based_near'), new Literal(companyHeadQuaters));
            let companyTripleHomepage = new this.rdf.Triple(companyNode, database.gn('name'), new Literal(companyWebsite));
            const result = yield this.client.query.update(`
        INSERT {` + TypeCompany.toNT() + `} WHERE {};
        INSERT {` + companyTripleName.toNT() + `} WHERE {};
        INSERT {` + companyTripleHeadquaters.toNT() + `} WHERE {};
        INSERT {` + companyTripleHomepage.toNT() + `} WHERE {};
        INSERT {` + companyTripleEmail.toNT() + `} WHERE {};
      `);
            return companyURI;
        });
    }
    ;
    /**
     * Creates a job instance linked to a company
     * @param companyURI the job for this company
     * @param jobName the name of this job (MUST BE URL COMPLAINT : no white spaces f.e.)
     * @param area the area where the job is to be performed
     * @param workExperience the work experience required (textual)
     * @param diploma the required diploma for this job
     * @param jobDescription the job description (textual)
     * @param status the status of the job (see jobStatus)
     * @param type the type of job
     * @returns
     */
    createJob(companyURI, jobName, area, workExperience, diploma, jobDescription, status, type) {
        return __awaiter(this, void 0, void 0, function* () {
            let jobBagURI = companyURI + "/jobs";
            const { NamedNode, Literal } = this.rdf;
            let jobsNode = new NamedNode(jobBagURI);
            let jobNameNode = new NamedNode(jobBagURI + "/" + jobName); //TODO: add "/"
            let bagIndex = yield this.getBagCount(jobBagURI);
            let jobInBag = new this.rdf.Triple(jobsNode, this.rdf.rdfns('_' + bagIndex), jobNameNode);
            let jobType = new this.rdf.Triple(jobNameNode, this.rdf.rdfsns('type'), new Literal(database.WEB_DOMAIN + "type/job"));
            let jobStatusType = new this.rdf.Triple(jobNameNode, jobBagURI + "/status", new Literal(status.toString()));
            let diplomaType = new this.rdf.Triple(jobNameNode, jobBagURI + "/diploma-type", new Literal(diploma));
            let titleTriple = new this.rdf.Triple(jobNameNode, database.dc('title'), new Literal(jobName));
            let areaTriple = new this.rdf.Triple(jobNameNode, database.gn('name'), new Literal(area));
            let descriptionTriple = new this.rdf.Triple(jobNameNode, database.dc('description'), new Literal(workExperience));
            let jobDescriptionTriple = new this.rdf.Triple(jobNameNode, database.dc('description'), new Literal(jobDescription));
            //TODO: jobtypeProperty
            const result = yield this.client.query.update(`
        INSERT {` + jobInBag.toNT() + `} WHERE {};
        INSERT {` + jobType.toNT() + `} WHERE {};
        INSERT {` + jobStatusType.toNT() + `} WHERE {};
        INSERT {` + diplomaType.toNT() + `} WHERE {};
        INSERT {` + titleTriple.toNT() + `} WHERE {};
        INSERT {` + areaTriple.toNT() + `} WHERE {};
        INSERT {` + descriptionTriple.toNT() + `} WHERE {};
        INSERT {` + jobDescriptionTriple.toNT() + `} WHERE {};
      `);
            return jobBagURI;
        });
    }
    ;
    addEmployeeToCompany(companyURI, //Resource employee
    employeeURI //Resource company
    ) {
        return __awaiter(this, void 0, void 0, function* () {
            let companyEmployeesBagURI = companyURI + "/jobs";
            let bagIndex = yield this.getBagCount(companyEmployeesBagURI);
            const result = yield this.client.query.update(`
            INSERT { 
                <` + companyEmployeesBagURI + `> <` + this.rdf.rdfns('_' + bagIndex) + `> <` + employeeURI + `> 
            } WHERE {};
        `);
        });
    }
    ;
    addPotentialEmployee(jobURI, userURI) {
        return __awaiter(this, void 0, void 0, function* () {
            let jobPotentialEmployeesBagURI = jobURI + "/potential-employees";
            let bagIndex = yield this.getBagCount(jobPotentialEmployeesBagURI);
            const result = yield this.client.query.update(`
            INSERT { 
                <` + jobPotentialEmployeesBagURI + `> <` + this.rdf.rdfns('_' + bagIndex) + `> <` + userURI + `> 
            } WHERE {};
        `);
        });
    }
    ;
    /**
     * Adds a potential employee to a job && adds the potential job to the employee's potential jobs list
     * @param jobURI the job which is going to have a new potential employee
     * @param userURI the user which is going to get a new potential job
     * @param isAccepted    the status if the user has accepted a job offer
     *                      (the company still has the final say if the user receives the job, via addJob)
     */
    addPotential(jobURI, userURI, isAccepted) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.addPotentialEmployee(jobURI, userURI);
            yield this.addPotentialJob(userURI, jobURI, isAccepted);
        });
    }
    /**
     * Adds a new employee to a company && adds the job to the employee's jobs list
     * @param companyURI the company which is going to have a new employee
     * @param jobURI the job from the company which nhas a new employee
     * @param employeeURI the employee which is hired for a ``companyURI`` to do the ``jobURI``
     */
    addEmployee(companyURI, jobURI, employeeURI) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.addEmployeeToCompany(companyURI, employeeURI);
            yield this.addJobToEmployee(employeeURI, jobURI);
        });
    }
    /**
     * get all directly associated data from a user in a json object
     * !does not return baglists
     * @param userURI
     * TODO: limit: number
     * @returns json object with the results
     */
    selectUser(userURI) {
        return __awaiter(this, void 0, void 0, function* () {
            // get first result again
            const result = yield this.client.query.select(`
            SELECT * WHERE {
                {
                    <` + userURI + `> ?pred ?obj .
                } UNION {
                    <` + userURI + `> ?pred _:blankNode1 .
                    _:blankNode1 <` + database.vCard('given-name') + `> ?obj .
                } UNION {
                    <` + userURI + `> ?pred _:blankNode2 .
                    _:blankNode2 <` + database.vCard('family-name') + `> ?obj .
                }
            }
        `);
            return result;
        });
    }
    /**
     * get all directly associated data from a company in a json object
     * !does not return baglists
     * @param companyURI
     * TODO: limit: number
     * @returns json object with the results
     */
    selectCompany(companyURI) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.client.query.select(`
            SELECT * WHERE {
                <` + companyURI + `> ?pred ?obj .
            } LIMIT 20
        `);
            return result;
        });
    }
    /**
     * get all directly associated data from a job in a json object
     * !does not return baglists
     * @param jobURI
     * TODO: limit: number
     * @returns json object with the results
     */
    selectJob(jobURI) {
        return __awaiter(this, void 0, void 0, function* () {
            // get first result again
            const result = yield this.client.query.select(`
            SELECT * WHERE {
                <` + jobURI + `> ?pred ?obj .
            } LIMIT 20
        `);
            return result;
        });
    }
    /**
     * in a pinch, simple SPARQL Query
     * if any parameter is left empty, it'll transform into a variable ?subj, ?pred? obj respectively
     * f.e. leaving every parameter blank returns every entry
     * @param subj the subject (auto receives <>)
     * @param pred the predicate (auto receives <>)
     * @param obj the object (!does not auto receive <>!)
     * @returns json object with the results
     */
    sparqlQuery(subj = "?subj", pred = "?pred", obj = "?obj") {
        return __awaiter(this, void 0, void 0, function* () {
            if (subj !== "?subj")
                subj = "<" + subj + ">";
            if (pred !== "?pred")
                pred = "<" + pred + ">";
            if (obj !== "?obj")
                obj = "<" + obj + ">";
            const result = yield this.client.query.select(`
            SELECT * WHERE {
                ` + subj + ` ` + pred + ` ` + obj + ` .
            }
        `);
            return result;
        });
    }
    /**
     * in a pinch, low level SPARQL Query
     * @param queryString the SPARQL Query to be executed
     * @returns json object with the results
     */
    sparqlQueryLowLevel(queryString = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.client.query.select(queryString);
            return result;
        });
    }
    getBag(bag) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.client.query.select(`
            SELECT * WHERE {
                <` + bag + `> ?pred ?obj .
            }
        `);
            return result;
        });
    }
    getBagItems(bag) {
        return __awaiter(this, void 0, void 0, function* () {
            const bagItems = yield this.getBag(bag);
            // let queryString : string = "SELECT * WHERE {";
            // bagItems.forEach((element : any, index: number) => {
            //     console.log(index);
            //     if (index === 0)
            //         queryString += "{ <";
            //     else
            //         queryString += " UNION { <";
            //     queryString += element.obj.value;
            //     queryString += "> ?pred"+index+" ?obj"+index+" }";
            // });
            // queryString += "}";
            let results = new Array();
            let i;
            for (i = 0; i < bagItems.length; i++) {
                let queryString = "SELECT * WHERE { <" + bagItems[i].obj.value + "> ?pred ?obj }";
                console.log(queryString);
                console.log(bagItems[i]);
                const result = yield this.client.query.select(queryString);
                console.log(result);
                results.push(result);
            }
            ;
            return results;
        });
    }
    calcLongLatDist(results1, results2) {
        var distance = require('geo-dist-calc');
        var sourcePoints = { latitude: Number(results1.geonames[0].lat), longitude: Number(results1.geonames[0].lng) };
        var destinationPoints = { latitude: Number(results2.geonames[0].lat), longitude: Number(results2.geonames[0].lng) };
        var ResultantDistance = distance.discal(sourcePoints, destinationPoints);
        return ResultantDistance;
    }
    matchForUser(userURI, maxDistanceKm) {
        return __awaiter(this, void 0, void 0, function* () {
            let userInfo = yield this.selectUser(userURI);
            let userAddrName = userInfo[5].obj.value;
            let jobs = yield this.sparqlQueryLowLevel(`SELECT * WHERE {
                ?job <http://www.w3.org/2000/01/rdf-schema#type> "https://testDomain/type/job" .
                ?job <https://www.geonames.org/ontology#name> ?jobArea
            }`);
            console.log(jobs);
            console.log(userAddrName);
            jobs.forEach((job) => {
                let jobAddrName = job.jobArea.value;
                console.log(jobAddrName);
                geo.search({ name: userAddrName }, (err, results1) => __awaiter(this, void 0, void 0, function* () {
                    geo.search({ name: jobAddrName }, (err, results2) => __awaiter(this, void 0, void 0, function* () {
                        var ResultantDistance = this.calcLongLatDist(results1, results2);
                        console.log(ResultantDistance);
                        if (ResultantDistance.kilometers <= maxDistanceKm) {
                            let jobURI = job.job.value;
                            console.log("added " + jobURI + " to " + userURI);
                            yield this.addPotential(jobURI, userURI, false);
                        }
                    }));
                }));
            });
            return new Object;
        });
    }
    matchForCompany(companyURI) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Object;
        });
    }
}
database.WEB_DOMAIN = "https://testDomain/";
// -- TEST FUNCNTIONS -- 
// Insert User
function TESTinsertUser(client) {
    return __awaiter(this, void 0, void 0, function* () {
        var db = new database(binDir, databaseDir);
        let URI = yield db.createUser("Maties", "Claesen", "matiesclaesen@gmail.com", "Belgie", "maties.blog.com", false, 1);
        let result = yield db.selectUser(URI);
        console.log("user: after insert");
        console.log(result);
    });
}
// Insert Company
function TESTinsertCompany(client) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = new database(binDir, databaseDir);
        let URI = yield db.createCompany("apple@mail.com", "Apple", "Apple.com", "Cupertino", uuidv4());
        let result = yield db.selectCompany(URI);
        console.log("company: after insert");
        console.log(result);
    });
}
// Insert Jobs
function TESTinsertJobs(companyURI, client) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = new database(binDir, databaseDir);
        let URI = yield db.createJob(companyURI, "afwasser", "in de keuken", "Ge moet al eens een bord vastgehouden hebben enz snapje", "diploma-ofz", "borden afwassen 24/7", jobStatus.Pending, "TODO:-uit-de-OWL-ofz-krijgen");
        let job1URI = yield db.createJob(companyURI, "tester", "bij it departement debuggen", "weten wat een debugger is", "diploma-ofz", "langsgaan en de hele tijd op step over klikken", jobStatus.Pending, "TODO:-uit-de-OWL-ofz-krijgen");
        let job2URI = yield db.createJob(companyURI, "IT", "Bureau", "Ge moet al eens een programma hebben gemaakt enz snapje", "diploma's-ofz", "programeren 24/7", jobStatus.Pending, "TODO:-uit-de-OWL-ofz-krijgen");
        let result = yield db.selectJob(URI);
        console.log("company: after job insertion");
        console.log(result);
    });
}
// -- TEST MAIN --
function tests() {
    return __awaiter(this, void 0, void 0, function* () {
        let testing = false;
        if (!testing)
            return 1;
        var db = new database(binDir, databaseDir);
        //await client.endpoint.importFiles([require.resolve('/Users/matiesclaesen/Documents/WEBINF/nodejs/triples.nt')]);
        let maties = yield db.createUser("Maties", "Claesen", "matiesclaesen@gmail.com", "Genk", "maties.blog.com", false, uuidv4());
        let femke = yield db.createUser("Femke", "Grandjean", "femke.grandjean@ergens.com", "Hasselt", "femke.com", false, uuidv4());
        const diplomasBagURI = yield db.createDiplomaFor(maties, new Date(), "nothing", "UHasselt1");
        yield db.createDiplomaFor(maties, new Date(), "nothing2", "UHasselt2");
        yield db.createConnectionWith(maties, femke, connectionStatus.Accepted, connectionType.Friend);
        yield db.createProfessionalExperienceFor(femke, new Date(), new Date(), "IT'er");
        let company = yield db.createCompany("Bol@gmail.com", "Bol", "Bol.com", "Utrecht", uuidv4());
        yield db.createJob(company, "Pakjes-Verplaatser", "Brussel", "Kunnen adressen lezen", "geen", "Pakjes in de juiste regio zetten", jobStatus.Pending, "Pakjes-verdeler");
        let callcenterJob = yield db.createJob(company, "Callcenter", "Leuven", "telefoon kunnen gebruiken", "geen", "24/7 telefoons oppakken", jobStatus.Pending, "service-center-employee");
        yield db.matchForUser(femke, 200);
        console.log("FINAL RESULT");
        let everything = yield db.sparqlQuery();
        console.log(everything);
        // const result : Array<Object> = await db.getBagItems(diplomasBagURI);
        // console.log(result);
    });
}
main();
tests();
