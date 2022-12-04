"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.database = void 0;
var workingDir = ".";
var uuidv4 = require('uuid').v4;
var geode = require('geode');
var geo = new geode('matieke6000', { language: 'en', countryCode: 'BE' });
//const DataFactory = require(workingDir+'/node_modules/rdf');
var Client = require('jena-tdb/ParsingClient');
var jobStatus_1 = require("./jobStatus");
var connectionType_1 = require("./connectionType");
var connectionStatus_1 = require("./connectionStatus");
var binDir = "/home/femke/Documenten/Jena/apache-jena-4.6.1/bin";
var databaseDir = "/home/femke/Documenten/GIT/WEBINF-Project/database-nodejs/database";
var database = /** @class */ (function () {
    function database(binDir, databaseDir) {
        this.binDir = binDir;
        this.databaseDir = databaseDir;
        this.client = new Client({
            bin: this.binDir,
            db: this.databaseDir
        });
        this.rdf = require(workingDir + '/node_modules/rdf');
        this.databaseDir = databaseDir;
        database.foaf = this.rdf.ns('http://xmlns.com/foaf/0.1/');
        database.vCard = this.rdf.ns('http://www.w3.org/2001/vcard-rdf/3.0#');
        database.dc = this.rdf.ns('http://purl.org/dc/elements/1.1/');
        database.dcat = this.rdf.ns('http://www.w3.org/ns/dcat#');
        database.gn = this.rdf.ns('https://www.geonames.org/ontology#');
    }
    database.prototype.initDatabse = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.databaseDir != "")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.client.endpoint.importFiles([require.resolve(this.databaseDir)])];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Gets the last index from the bag + 1
     * @param bag
     * @returns
     */
    database.prototype.getBagCount = function (bag) {
        return __awaiter(this, void 0, void 0, function () {
            var result, max;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.query.select("\n            SELECT * WHERE {\n                <" + bag + "> ?pred ?obj .\n            }\n        ")];
                    case 1:
                        result = _a.sent();
                        max = 0;
                        result.forEach(function (element) {
                            var outputBagURI = element.pred.value.toString();
                            var splittedOutputBagURI = outputBagURI.split(_this.rdf.rdfns('_'));
                            var lastIndex = 1;
                            var currentNumBagURI = Number(splittedOutputBagURI[lastIndex]);
                            if (max < currentNumBagURI)
                                max = currentNumBagURI;
                        });
                        return [2 /*return*/, max + 1];
                }
            });
        });
    };
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
    database.prototype.createUser = function (firstName, lastName, email, area, webpage, lookingForJob, userid) {
        return __awaiter(this, void 0, void 0, function () {
            var userURI, fullName, _a, NamedNode, BlankNode, Literal, namedNode, typeTriple, fullNameTriple, blankNodeName, nameTriple, firstNameTriple, lastNameTriple, emailTriple, webpageTriple, areaTriple, lookingForJobTriple;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userURI = database.WEB_DOMAIN + firstName + lastName + "-" + userid;
                        fullName = firstName + " " + lastName;
                        _a = this.rdf, NamedNode = _a.NamedNode, BlankNode = _a.BlankNode, Literal = _a.Literal;
                        namedNode = new NamedNode(userURI);
                        typeTriple = new this.rdf.Triple(namedNode, this.rdf.rdfsns('type'), new Literal(database.WEB_DOMAIN + "type/user"));
                        fullNameTriple = new this.rdf.Triple(namedNode, database.vCard('FN'), new Literal(fullName));
                        blankNodeName = new BlankNode();
                        nameTriple = new this.rdf.Triple(namedNode, database.vCard('N'), blankNodeName);
                        firstNameTriple = new this.rdf.Triple(blankNodeName, database.vCard('given-name'), new Literal(firstName));
                        lastNameTriple = new this.rdf.Triple(blankNodeName, database.vCard('family-name'), new Literal(lastName));
                        emailTriple = new this.rdf.Triple(namedNode, database.foaf('mbox'), new Literal(email));
                        webpageTriple = new this.rdf.Triple(namedNode, database.foaf('homepage'), new Literal(webpage));
                        areaTriple = new this.rdf.Triple(namedNode, database.gn('name'), new Literal(area));
                        lookingForJobTriple = new this.rdf.Triple(namedNode, database.WEB_DOMAIN + "looking-for-job", //userURI + "/looking-for-job",
                        new Literal(String(lookingForJob), this.rdf.xsdns("boolean")));
                        return [4 /*yield*/, this.client.query.update("\n        INSERT {" + typeTriple.toNT() + "} WHERE {};\n        INSERT {" + fullNameTriple.toNT() + "} WHERE {};\n        INSERT { \n                    <" + userURI + "> <" + database.vCard("N") + "> \n                        [   \n                            <" + database.vCard("given-name") + "> \"" + firstName + "\"; \n                            <" + database.vCard("family-name") + "> \"" + lastName + "\" \n                        ] \n                } WHERE {};\n        INSERT {" + emailTriple.toNT() + "} WHERE {};\n        INSERT {" + webpageTriple.toNT() + "} WHERE {};\n        INSERT {" + areaTriple.toNT() + "} WHERE {};\n        INSERT {" + lookingForJobTriple.toNT() + "} WHERE {};\n        ")];
                    case 1:
                        _b.sent();
                        return [2 /*return*/, userURI];
                }
            });
        });
    };
    ;
    database.prototype.formatToXSDdate = function (date) {
        var formattedString = String(date.getFullYear()) + "-" + String(date.getMonth() + 1) + "-" + String(date.getDay());
        return formattedString;
    };
    /**
     *
     * @param userURI
     * @param graduation
     * @param jobType
     * @param educationalInstitute
     * @returns diplomas bag uri
     */
    database.prototype.createDiplomaFor = function (userURI, graduation, jobType, educationalInstitute) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, NamedNode, BlankNode, Literal, diplomaBagURI, diplomaNode, bagIndex, diplomaInBag, typeTriple, dateTriple, adresTriple, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.rdf, NamedNode = _a.NamedNode, BlankNode = _a.BlankNode, Literal = _a.Literal;
                        diplomaBagURI = userURI + "/diplomas";
                        diplomaNode = new NamedNode(database.WEB_DOMAIN + "diplomas/diploma-" + uuidv4());
                        return [4 /*yield*/, this.getBagCount(diplomaBagURI)];
                    case 1:
                        bagIndex = _b.sent();
                        diplomaInBag = new this.rdf.Triple(diplomaBagURI, this.rdf.rdfns('_' + bagIndex), diplomaNode);
                        typeTriple = new this.rdf.Triple(diplomaNode, this.rdf.rdfsns('type'), new Literal(database.WEB_DOMAIN + "type/diploma"));
                        dateTriple = new this.rdf.Triple(diplomaNode, database.dc('date'), new Literal(this.formatToXSDdate(graduation), this.rdf.xsdns("date")));
                        adresTriple = new this.rdf.Triple(diplomaNode, database.gn('name'), new Literal(educationalInstitute));
                        return [4 /*yield*/, this.client.query.update("\n            INSERT {" + diplomaInBag.toNT() + "} WHERE {};\n            INSERT {" + typeTriple.toNT() + "} WHERE {};\n            INSERT {" + dateTriple.toNT() + "} WHERE {};\n            INSERT {" + adresTriple.toNT() + "} WHERE {};\n        ")];
                    case 2:
                        result = _b.sent();
                        return [2 /*return*/, diplomaBagURI];
                }
            });
        });
    };
    /**
     *
     * @param userURI
     * @param startDate
     * @param endDate
     * @param description
     */
    database.prototype.createProfessionalExperienceFor = function (userURI, startDate, endDate, description) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, NamedNode, BlankNode, Literal, professionalBagURI, professionalURI, professionalNode, bagIndex, professionalInBag, startDateTriple, endDateTriple, descriptionTriple, typeTriple, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.rdf, NamedNode = _a.NamedNode, BlankNode = _a.BlankNode, Literal = _a.Literal;
                        professionalBagURI = userURI + "/professional-experiences";
                        professionalURI = professionalBagURI + "/professionalExperience-" + uuidv4();
                        professionalNode = new NamedNode(professionalURI);
                        return [4 /*yield*/, this.getBagCount(professionalBagURI)];
                    case 1:
                        bagIndex = _b.sent();
                        professionalInBag = new this.rdf.Triple(professionalBagURI, this.rdf.rdfns('_' + bagIndex), professionalNode);
                        startDateTriple = new this.rdf.Triple(professionalNode, database.dcat('startDate'), new Literal(this.formatToXSDdate(startDate), this.rdf.xsdns("date")));
                        endDateTriple = new this.rdf.Triple(professionalNode, database.dcat('endDate'), new Literal(this.formatToXSDdate(endDate), this.rdf.xsdns("date")));
                        descriptionTriple = new this.rdf.Triple(professionalNode, database.dc('description'), new Literal(description));
                        typeTriple = new this.rdf.Triple(professionalNode, this.rdf.rdfsns('type'), new Literal(database.WEB_DOMAIN + "type/professional-experience"));
                        return [4 /*yield*/, this.client.query.update("\n        INSERT {" + professionalInBag.toNT() + "} WHERE {};\n        INSERT {" + typeTriple.toNT() + "} WHERE {};\n        INSERT {" + startDateTriple.toNT() + "} WHERE {};\n        INSERT {" + endDateTriple.toNT() + "} WHERE {};\n        INSERT {" + descriptionTriple.toNT() + "} WHERE {};\n        ")];
                    case 2:
                        result = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * returns the "name" of the URI
     * (which is set after last '/' in the URI)
     * @param URI the URI containing the name
     * @returns the name of the URI
     */
    database.prototype.getLastSubstring = function (URI) {
        return URI.substring(URI.lastIndexOf("/") + 1);
    };
    ;
    /**
     *
     * @param userURI1
     * @param userURI2
     * @param status
     * @param type
     */
    database.prototype.createConnectionWith = function (userURI1, userURI2, status, type) {
        return __awaiter(this, void 0, void 0, function () {
            var connection1BagURI, connection2BagURI, connectionURI, _a, NamedNode, BlankNode, Literal, connectionURINode, bagIndex, connectionInBagUser1, connectionInBagUser2, connectionTypeTriple, connectionStatusTriple, connectionHasType, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        connection1BagURI = userURI1 + "/connections";
                        connection2BagURI = userURI2 + "/connections";
                        connectionURI = database.WEB_DOMAIN + "connection/" + this.getLastSubstring(userURI1) + ";" + this.getLastSubstring(userURI2);
                        _a = this.rdf, NamedNode = _a.NamedNode, BlankNode = _a.BlankNode, Literal = _a.Literal;
                        connectionURINode = new NamedNode(connectionURI);
                        return [4 /*yield*/, this.getBagCount(connection1BagURI)];
                    case 1:
                        bagIndex = _b.sent();
                        connectionInBagUser1 = new this.rdf.Triple(connection1BagURI, this.rdf.rdfns('_' + bagIndex), connectionURINode);
                        return [4 /*yield*/, this.getBagCount(connection2BagURI)];
                    case 2:
                        bagIndex = _b.sent();
                        connectionInBagUser2 = new this.rdf.Triple(connection2BagURI, this.rdf.rdfns('_' + bagIndex), connectionURINode);
                        connectionTypeTriple = new this.rdf.Triple(connectionURINode, this.rdf.rdfsns('type'), new Literal(database.WEB_DOMAIN + "type/connection"));
                        connectionStatusTriple = new this.rdf.Triple(connectionURINode, connectionURI + "/status", new Literal(status.toString()));
                        connectionHasType = new this.rdf.Triple(connectionURINode, connectionURI + "/type", new Literal(type.toString()));
                        return [4 /*yield*/, this.client.query.update("\n            INSERT {" + connectionInBagUser1.toNT() + "} WHERE {};\n            INSERT {" + connectionInBagUser2.toNT() + "} WHERE {};\n            INSERT {" + connectionTypeTriple.toNT() + "} WHERE {};\n            INSERT {" + connectionStatusTriple.toNT() + "} WHERE {};\n            INSERT {" + connectionHasType.toNT() + "} WHERE {};\n        ")];
                    case 3:
                        result = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    database.prototype.addPotentialJob = function (userURI, //Resource user
    jobURI, //Resource job
    isAccepted) {
        return __awaiter(this, void 0, void 0, function () {
            var pojoBagURI, pojoURI, bagIndex, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pojoBagURI = userURI + "/potential-jobs";
                        pojoURI = userURI + "/potential-job" + uuidv4();
                        return [4 /*yield*/, this.getBagCount(pojoBagURI)];
                    case 1:
                        bagIndex = _a.sent();
                        return [4 /*yield*/, this.client.query.update("\n            INSERT { \n                <" + pojoBagURI + "> <" + this.rdf.rdfns('_' + bagIndex) + "> \n                    [   \n                        <" + pojoURI + "> <" + jobURI + ">; \n                        <" + pojoURI + "/isAccepted> \"" + String(isAccepted) + "\" \n                    ] \n            } WHERE {};\n        ")];
                    case 2:
                        result = _a.sent();
                        console.log(result);
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    database.prototype.addJobToEmployee = function (userURI, //Resourse user
    jobURI //Resourse job
    ) {
        return __awaiter(this, void 0, void 0, function () {
            var jobBagURI, bagIndex, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jobBagURI = userURI + "/jobs";
                        return [4 /*yield*/, this.getBagCount(jobBagURI)];
                    case 1:
                        bagIndex = _a.sent();
                        return [4 /*yield*/, this.client.query.update("\n            INSERT { \n                <" + jobBagURI + "> <" + this.rdf.rdfns('_' + bagIndex) + "> <" + jobURI + "> \n            } WHERE {};\n        ")];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * @param companyEmail
     * @param companyName
     * @param companyWebsite
     * @param companyHeadQuaters
     * @returns
     */
    database.prototype.createCompany = function (companyEmail, companyName, companyWebsite, companyHeadQuaters, companyId) {
        return __awaiter(this, void 0, void 0, function () {
            var companyURI, _a, NamedNode, BlankNode, Literal, companyNode, TypeCompany, companyTripleName, companyTripleEmail, companyTripleHeadquaters, companyTripleHomepage, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        companyURI = database.WEB_DOMAIN + companyName + "-" + companyId;
                        _a = this.rdf, NamedNode = _a.NamedNode, BlankNode = _a.BlankNode, Literal = _a.Literal;
                        companyNode = new NamedNode(companyURI);
                        TypeCompany = new this.rdf.Triple(companyNode, this.rdf.rdfsns('type'), new Literal(database.WEB_DOMAIN + "type/company"));
                        companyTripleName = new this.rdf.Triple(companyNode, database.vCard('FN'), new Literal(companyName));
                        companyTripleEmail = new this.rdf.Triple(companyNode, database.foaf('mbox'), new Literal(companyEmail));
                        companyTripleHeadquaters = new this.rdf.Triple(companyNode, database.foaf('based_near'), new Literal(companyHeadQuaters));
                        companyTripleHomepage = new this.rdf.Triple(companyNode, database.gn('name'), new Literal(companyWebsite));
                        return [4 /*yield*/, this.client.query.update("\n        INSERT {" + TypeCompany.toNT() + "} WHERE {};\n        INSERT {" + companyTripleName.toNT() + "} WHERE {};\n        INSERT {" + companyTripleHeadquaters.toNT() + "} WHERE {};\n        INSERT {" + companyTripleHomepage.toNT() + "} WHERE {};\n        INSERT {" + companyTripleEmail.toNT() + "} WHERE {};\n      ")];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, companyURI];
                }
            });
        });
    };
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
    database.prototype.createJob = function (companyURI, jobName, area, workExperience, diploma, jobDescription, status, type) {
        return __awaiter(this, void 0, void 0, function () {
            var jobBagURI, _a, NamedNode, Literal, jobsNode, jobNameNode, bagIndex, jobInBag, jobType, jobStatusType, diplomaType, titleTriple, areaTriple, descriptionTriple, jobDescriptionTriple, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        jobBagURI = companyURI + "/jobs";
                        _a = this.rdf, NamedNode = _a.NamedNode, Literal = _a.Literal;
                        jobsNode = new NamedNode(jobBagURI);
                        jobNameNode = new NamedNode(jobBagURI + "/" + jobName);
                        return [4 /*yield*/, this.getBagCount(jobBagURI)];
                    case 1:
                        bagIndex = _b.sent();
                        jobInBag = new this.rdf.Triple(jobsNode, this.rdf.rdfns('_' + bagIndex), jobNameNode);
                        jobType = new this.rdf.Triple(jobNameNode, this.rdf.rdfsns('type'), new Literal(database.WEB_DOMAIN + "type/job"));
                        jobStatusType = new this.rdf.Triple(jobNameNode, jobBagURI + "/status", new Literal(status.toString()));
                        diplomaType = new this.rdf.Triple(jobNameNode, jobBagURI + "/diploma-type", new Literal(diploma));
                        titleTriple = new this.rdf.Triple(jobNameNode, database.dc('title'), new Literal(jobName));
                        areaTriple = new this.rdf.Triple(jobNameNode, database.gn('name'), new Literal(area));
                        descriptionTriple = new this.rdf.Triple(jobNameNode, database.dc('description'), new Literal(workExperience));
                        jobDescriptionTriple = new this.rdf.Triple(jobNameNode, database.dc('description'), new Literal(jobDescription));
                        return [4 /*yield*/, this.client.query.update("\n        INSERT {" + jobInBag.toNT() + "} WHERE {};\n        INSERT {" + jobType.toNT() + "} WHERE {};\n        INSERT {" + jobStatusType.toNT() + "} WHERE {};\n        INSERT {" + diplomaType.toNT() + "} WHERE {};\n        INSERT {" + titleTriple.toNT() + "} WHERE {};\n        INSERT {" + areaTriple.toNT() + "} WHERE {};\n        INSERT {" + descriptionTriple.toNT() + "} WHERE {};\n        INSERT {" + jobDescriptionTriple.toNT() + "} WHERE {};\n      ")];
                    case 2:
                        result = _b.sent();
                        return [2 /*return*/, jobBagURI];
                }
            });
        });
    };
    ;
    database.prototype.addEmployeeToCompany = function (companyURI, //Resource employee
    employeeURI //Resource company
    ) {
        return __awaiter(this, void 0, void 0, function () {
            var companyEmployeesBagURI, bagIndex, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        companyEmployeesBagURI = companyURI + "/jobs";
                        return [4 /*yield*/, this.getBagCount(companyEmployeesBagURI)];
                    case 1:
                        bagIndex = _a.sent();
                        return [4 /*yield*/, this.client.query.update("\n            INSERT { \n                <" + companyEmployeesBagURI + "> <" + this.rdf.rdfns('_' + bagIndex) + "> <" + employeeURI + "> \n            } WHERE {};\n        ")];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    database.prototype.addPotentialEmployee = function (jobURI, userURI) {
        return __awaiter(this, void 0, void 0, function () {
            var jobPotentialEmployeesBagURI, bagIndex, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jobPotentialEmployeesBagURI = jobURI + "/potential-employees";
                        return [4 /*yield*/, this.getBagCount(jobPotentialEmployeesBagURI)];
                    case 1:
                        bagIndex = _a.sent();
                        return [4 /*yield*/, this.client.query.update("\n            INSERT { \n                <" + jobPotentialEmployeesBagURI + "> <" + this.rdf.rdfns('_' + bagIndex) + "> <" + userURI + "> \n            } WHERE {};\n        ")];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    /**
     * Adds a potential employee to a job && adds the potential job to the employee's potential jobs list
     * @param jobURI the job which is going to have a new potential employee
     * @param userURI the user which is going to get a new potential job
     * @param isAccepted    the status if the user has accepted a job offer
     *                      (the company still has the final say if the user receives the job, via addJob)
     */
    database.prototype.addPotential = function (jobURI, userURI, isAccepted) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.addPotentialEmployee(jobURI, userURI)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.addPotentialJob(userURI, jobURI, isAccepted)];
                    case 2:
                        _a.sent();
                        console.log("Done");
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Adds a new employee to a company && adds the job to the employee's jobs list
     * @param companyURI the company which is going to have a new employee
     * @param jobURI the job from the company which nhas a new employee
     * @param employeeURI the employee which is hired for a ``companyURI`` to do the ``jobURI``
     */
    database.prototype.addEmployee = function (companyURI, jobURI, employeeURI) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.addEmployeeToCompany(companyURI, employeeURI)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.addJobToEmployee(employeeURI, jobURI)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * get all directly associated data from a user in a json object
     * !does not return baglists
     * @param userURI
     * TODO: limit: number
     * @returns json object with the results
     */
    database.prototype.selectUser = function (userURI) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.query.select("\n            SELECT * WHERE {\n                {\n                    <" + userURI + "> ?pred ?obj .\n                } UNION {\n                    <" + userURI + "> ?pred _:blankNode1 .\n                    _:blankNode1 <" + database.vCard('given-name') + "> ?obj .\n                } UNION {\n                    <" + userURI + "> ?pred _:blankNode2 .\n                    _:blankNode2 <" + database.vCard('family-name') + "> ?obj .\n                }\n            }\n        ")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * get all directly associated data from a company in a json object
     * !does not return baglists
     * @param companyURI
     * TODO: limit: number
     * @returns json object with the results
     */
    database.prototype.selectCompany = function (companyURI) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.query.select("\n            SELECT * WHERE {\n                <" + companyURI + "> ?pred ?obj .\n            } LIMIT 20\n        ")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * get all directly associated data from a job in a json object
     * !does not return baglists
     * @param jobURI
     * TODO: limit: number
     * @returns json object with the results
     */
    database.prototype.selectJob = function (jobURI) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.query.select("\n            SELECT * WHERE {\n                <" + jobURI + "> ?pred ?obj .\n            } LIMIT 20\n        ")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * in a pinch, simple SPARQL Query
     * if any parameter is left empty, it'll transform into a variable ?subj, ?pred? obj respectively
     * f.e. leaving every parameter blank returns every entry
     * @param subj the subject (auto receives <>)
     * @param pred the predicate (auto receives <>)
     * @param obj the object (!does not auto receive <>!)
     * @returns json object with the results
     */
    database.prototype.sparqlQuery = function (subj, pred, obj) {
        if (subj === void 0) { subj = "?subj"; }
        if (pred === void 0) { pred = "?pred"; }
        if (obj === void 0) { obj = "?obj"; }
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (subj !== "?subj")
                            subj = "<" + subj + ">";
                        if (pred !== "?pred")
                            pred = "<" + pred + ">";
                        if (obj !== "?obj")
                            obj = "<" + obj + ">";
                        return [4 /*yield*/, this.client.query.select("\n            SELECT * WHERE {\n                " + subj + " " + pred + " " + obj + " .\n            }\n        ")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    /**
     * in a pinch, low level SPARQL Query
     * @param queryString the SPARQL Query to be executed
     * @returns json object with the results
     */
    database.prototype.sparqlQueryLowLevel = function (queryString) {
        if (queryString === void 0) { queryString = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.query.select(queryString)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    database.prototype.getBag = function (bag) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.query.select("\n            SELECT * WHERE {\n                <" + bag + "> ?pred ?obj .\n            }\n        ")];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    database.prototype.getBagItems = function (bag) {
        return __awaiter(this, void 0, void 0, function () {
            var bagItems, results, i, queryString, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getBag(bag)];
                    case 1:
                        bagItems = _a.sent();
                        results = new Array();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < bagItems.length)) return [3 /*break*/, 5];
                        queryString = "SELECT * WHERE { <" + bagItems[i].obj.value + "> ?pred ?obj }";
                        console.log(queryString);
                        console.log(bagItems[i]);
                        return [4 /*yield*/, this.client.query.select(queryString)];
                    case 3:
                        result = _a.sent();
                        console.log(result);
                        results.push(result);
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5:
                        ;
                        return [2 /*return*/, results];
                }
            });
        });
    };
    database.prototype.calcLongLatDist = function (results1, results2) {
        var distance = require('geo-dist-calc');
        var sourcePoints = { latitude: Number(results1.geonames[0].lat), longitude: Number(results1.geonames[0].lng) };
        var destinationPoints = { latitude: Number(results2.geonames[0].lat), longitude: Number(results2.geonames[0].lng) };
        var ResultantDistance = distance.discal(sourcePoints, destinationPoints);
        return ResultantDistance;
    };
    database.prototype.matchForUser = function (userURI, maxDistanceKm) {
        return __awaiter(this, void 0, void 0, function () {
            var userInfo, userAddrName, jobs;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.selectUser(userURI)];
                    case 1:
                        userInfo = _a.sent();
                        userAddrName = userInfo[5].obj.value;
                        return [4 /*yield*/, this.sparqlQueryLowLevel("SELECT * WHERE {\n                ?job <http://www.w3.org/2000/01/rdf-schema#type> \"https://testDomain/type/job\" .\n                ?job <https://www.geonames.org/ontology#name> ?jobArea\n            }")];
                    case 2:
                        jobs = _a.sent();
                        console.log(jobs);
                        console.log(userAddrName);
                        jobs.forEach(function (job) { return __awaiter(_this, void 0, void 0, function () {
                            var jobAddrName;
                            var _this = this;
                            return __generator(this, function (_a) {
                                jobAddrName = job.jobArea.value;
                                console.log(jobAddrName);
                                geo.search({ name: userAddrName }, function (err, results1) { return __awaiter(_this, void 0, void 0, function () {
                                    var _this = this;
                                    return __generator(this, function (_a) {
                                        geo.search({ name: jobAddrName }, function (err, results2) { return __awaiter(_this, void 0, void 0, function () {
                                            var ResultantDistance, jobURI;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        ResultantDistance = this.calcLongLatDist(results1, results2);
                                                        console.log(ResultantDistance);
                                                        if (!(ResultantDistance.kilometers <= maxDistanceKm)) return [3 /*break*/, 2];
                                                        jobURI = job.job.value;
                                                        console.log("added " + jobURI + " to " + userURI);
                                                        return [4 /*yield*/, this.addPotential(jobURI, userURI, false)];
                                                    case 1:
                                                        _a.sent();
                                                        _a.label = 2;
                                                    case 2: return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                        return [2 /*return*/];
                                    });
                                }); });
                                return [2 /*return*/];
                            });
                        }); });
                        return [2 /*return*/, new Object];
                }
            });
        });
    };
    database.prototype.matchForCompany = function (companyURI) {
        return __awaiter(this, void 0, void 0, function () {
            var users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sparqlQueryLowLevel("SELECT * WHERE {\n                ?user <http://www.w3.org/2000/01/rdf-schema#type> \"https://testDomain/type/user\".\n                ?user <https://testDomain/looking-for-job> true .\n                 ?user <https://www.geonames.org/ontology#name> ?adr.\t\n            }")];
                    case 1:
                        users = _a.sent();
                        console.log(users);
                        return [2 /*return*/, new Object];
                }
            });
        });
    };
    database.WEB_DOMAIN = "https://testDomain/";
    return database;
}());
exports.database = database;
// -- TEST FUNCNTIONS -- 
// Insert User
function TESTinsertUser(client) {
    return __awaiter(this, void 0, void 0, function () {
        var db, URI, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    db = new database(binDir, databaseDir);
                    return [4 /*yield*/, db.createUser("Maties", "Claesen", "matiesclaesen@gmail.com", "Belgie", "maties.blog.com", false, 1)];
                case 1:
                    URI = _a.sent();
                    return [4 /*yield*/, db.selectUser(URI)];
                case 2:
                    result = _a.sent();
                    console.log("user: after insert");
                    console.log(result);
                    return [2 /*return*/];
            }
        });
    });
}
// Insert Company
function TESTinsertCompany(client) {
    return __awaiter(this, void 0, void 0, function () {
        var db, URI, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    db = new database(binDir, databaseDir);
                    return [4 /*yield*/, db.createCompany("apple@mail.com", "Apple", "Apple.com", "Cupertino", uuidv4())];
                case 1:
                    URI = _a.sent();
                    return [4 /*yield*/, db.selectCompany(URI)];
                case 2:
                    result = _a.sent();
                    console.log("company: after insert");
                    console.log(result);
                    return [2 /*return*/];
            }
        });
    });
}
// Insert Jobs
function TESTinsertJobs(companyURI, client) {
    return __awaiter(this, void 0, void 0, function () {
        var db, URI, job1URI, job2URI, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    db = new database(binDir, databaseDir);
                    return [4 /*yield*/, db.createJob(companyURI, "afwasser", "in de keuken", "Ge moet al eens een bord vastgehouden hebben enz snapje", "diploma-ofz", "borden afwassen 24/7", jobStatus_1.jobStatus.Pending, "TODO:-uit-de-OWL-ofz-krijgen")];
                case 1:
                    URI = _a.sent();
                    return [4 /*yield*/, db.createJob(companyURI, "tester", "bij it departement debuggen", "weten wat een debugger is", "diploma-ofz", "langsgaan en de hele tijd op step over klikken", jobStatus_1.jobStatus.Pending, "TODO:-uit-de-OWL-ofz-krijgen")];
                case 2:
                    job1URI = _a.sent();
                    return [4 /*yield*/, db.createJob(companyURI, "IT", "Bureau", "Ge moet al eens een programma hebben gemaakt enz snapje", "diploma's-ofz", "programeren 24/7", jobStatus_1.jobStatus.Pending, "TODO:-uit-de-OWL-ofz-krijgen")];
                case 3:
                    job2URI = _a.sent();
                    return [4 /*yield*/, db.selectJob(URI)];
                case 4:
                    result = _a.sent();
                    console.log("company: after job insertion");
                    console.log(result);
                    return [2 /*return*/];
            }
        });
    });
}
// -- TEST MAIN --
function tests() {
    return __awaiter(this, void 0, void 0, function () {
        var testing, db, maties, femke, diplomasBagURI, company, callcenterJob, everything;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testing = true;
                    if (!testing)
                        return [2 /*return*/, 1];
                    db = new database(binDir, databaseDir);
                    return [4 /*yield*/, db.createUser("Maties", "Claesen", "matiesclaesen@gmail.com", "Genk", "maties.blog.com", true, uuidv4())];
                case 1:
                    maties = _a.sent();
                    return [4 /*yield*/, db.createUser("Femke", "Grandjean", "femke.grandjean@ergens.com", "Hasselt", "femke.com", false, uuidv4())];
                case 2:
                    femke = _a.sent();
                    return [4 /*yield*/, db.createDiplomaFor(maties, new Date(), "nothing", "UHasselt1")];
                case 3:
                    diplomasBagURI = _a.sent();
                    return [4 /*yield*/, db.createDiplomaFor(maties, new Date(), "nothing2", "UHasselt2")];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, db.createConnectionWith(maties, femke, connectionStatus_1.connectionStatus.Accepted, connectionType_1.connectionType.Friend)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, db.createProfessionalExperienceFor(femke, new Date(), new Date(), "IT'er")];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, db.createCompany("Bol@gmail.com", "Bol", "Bol.com", "Utrecht", uuidv4())];
                case 7:
                    company = _a.sent();
                    return [4 /*yield*/, db.createJob(company, "Pakjes-Verplaatser", "Brussel", "Kunnen adressen lezen", "geen", "Pakjes in de juiste regio zetten", jobStatus_1.jobStatus.Pending, "Pakjes-verdeler")];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, db.createJob(company, "Callcenter", "Leuven", "telefoon kunnen gebruiken", "geen", "24/7 telefoons oppakken", jobStatus_1.jobStatus.Pending, "service-center-employee")];
                case 9:
                    callcenterJob = _a.sent();
                    //await db.matchForUser(femke, 200);
                    return [4 /*yield*/, db.matchForCompany(company)];
                case 10:
                    //await db.matchForUser(femke, 200);
                    _a.sent();
                    console.log("FINAL RESULT");
                    return [4 /*yield*/, db.sparqlQuery()];
                case 11:
                    everything = _a.sent();
                    console.log(everything);
                    return [2 /*return*/];
            }
        });
    });
}
tests();
