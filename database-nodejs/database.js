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
var uuidv4 = require("./node_modules/uuid").v4;
var DataFactory = require("./node_modules/rdf");
var Client = require('./node_modules/jena-tdb/ParsingClient');
var database = /** @class */ (function () {
    function database() {
        this.client = new Client({
            bin: '/Users/matiesclaesen/Documents/WEBINF/apache-jena-4.6.1/bin',
            db: '/Users/matiesclaesen/Documents/WEBINF/nodejs/database'
        });
        this.rdf = require('./node_modules/rdf');
        database.foaf = this.rdf.ns('http://xmlns.com/foaf/0.1/');
        database.vCard = this.rdf.ns('http://www.w3.org/2001/vcard-rdf/3.0#');
    }
    database.prototype.createUser = function (firstName, lastName, email, area, webpage, lookingForJob) {
        return __awaiter(this, void 0, void 0, function () {
            var userURI, fullName, _a, NamedNode, BlankNode, Literal, namedNode, typeTriple, fullNameTriple, blankNodeName, blankNode2, nameTriple, firstNameTriple, lastNameTriple, emailTriple, webpageTriple, areaTriple, lookingForJobTriple;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userURI = database.WEB_DOMAIN + firstName + lastName + "-" + uuidv4();
                        fullName = firstName + " " + lastName;
                        _a = this.rdf, NamedNode = _a.NamedNode, BlankNode = _a.BlankNode, Literal = _a.Literal;
                        namedNode = new NamedNode(userURI);
                        typeTriple = new this.rdf.Triple(namedNode, this.rdf.rdfsns('type'), new Literal(database.WEB_DOMAIN + "type/user"));
                        fullNameTriple = new this.rdf.Triple(namedNode, database.vCard('FN'), new Literal(fullName));
                        blankNodeName = new BlankNode();
                        blankNode2 = new BlankNode();
                        nameTriple = new this.rdf.Triple(namedNode, database.vCard('N'), blankNodeName);
                        firstNameTriple = new this.rdf.Triple(blankNodeName, database.vCard('given-name'), new Literal(firstName));
                        lastNameTriple = new this.rdf.Triple(blankNodeName, database.vCard('family-name'), new Literal(lastName));
                        emailTriple = new this.rdf.Triple(namedNode, database.foaf('mbox'), new Literal(email));
                        webpageTriple = new this.rdf.Triple(namedNode, database.foaf('homepage'), new Literal(webpage));
                        areaTriple = new this.rdf.Triple(namedNode, database.foaf('based_near'), new Literal(area));
                        lookingForJobTriple = new this.rdf.Triple(namedNode, this.rdf.rdfsns(userURI + "/looking-for-job"), new Literal(String(lookingForJob), this.rdf.xsdns("boolean")));
                        //console.log(triple.toNT());
                        /*Property lookingForJobProperty = model.createProperty(userURI + "/looking-for-job");
                
                        Resource johnSmith
                                = model.createResource(userURI)
                                .addProperty(VCARD.FN, fullName)
                                .addProperty(VCARD.N,
                                        model.createResource()
                                                .addProperty(FOAF.firstName, firstName)
                                                .addProperty(FOAF.familyName, lastName))
                                .addProperty(FOAF.mbox, email)
                                .addProperty(FOAF.homepage, webpage) //TODO: Syntax for url could be incorrect
                                .addProperty(FOAF.based_near, area)
                                .addProperty(lookingForJobProperty, lookingForJob.toString())
                                .addProperty(RDF.type, WEB_DOMAIN + "type/user");*/
                        return [4 /*yield*/, this.client.query.update("\n        INSERT {" + typeTriple.toNT() + "} WHERE {};\n        INSERT {" + fullNameTriple.toNT() + "} WHERE {};\n        INSERT { \n                    <" + userURI + "> <" + database.vCard("N") + "> \n                        [   \n                            <" + database.vCard("given-name") + "> \"" + firstName + "\"; \n                            <" + database.vCard("family-name") + "> \"" + lastName + "\" \n                        ] \n                } WHERE {};\n        INSERT {" + emailTriple.toNT() + "} WHERE {};\n        INSERT {" + webpageTriple.toNT() + "} WHERE {};\n        INSERT {" + areaTriple.toNT() + "} WHERE {};\n        INSERT {" + lookingForJobTriple.toNT() + "} WHERE {};\n        ")];
                    case 1:
                        //console.log(triple.toNT());
                        /*Property lookingForJobProperty = model.createProperty(userURI + "/looking-for-job");
                
                        Resource johnSmith
                                = model.createResource(userURI)
                                .addProperty(VCARD.FN, fullName)
                                .addProperty(VCARD.N,
                                        model.createResource()
                                                .addProperty(FOAF.firstName, firstName)
                                                .addProperty(FOAF.familyName, lastName))
                                .addProperty(FOAF.mbox, email)
                                .addProperty(FOAF.homepage, webpage) //TODO: Syntax for url could be incorrect
                                .addProperty(FOAF.based_near, area)
                                .addProperty(lookingForJobProperty, lookingForJob.toString())
                                .addProperty(RDF.type, WEB_DOMAIN + "type/user");*/
                        _b.sent();
                        //`+ lookingForJobTriple.toNT() + `;
                        return [2 /*return*/, userURI];
                }
            });
        });
    };
    database.prototype.createCompany = function (companyEmail, companyName, companyWebsite, companyHeadQuaters) {
        return __awaiter(this, void 0, void 0, function () {
            var companyURI, _a, NamedNode, BlankNode, Literal, companyNode, TypeCompany, companyTripleName, companyTripleEmail, companyTripleHeadquaters, companyTripleHomepage, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        companyURI = database.WEB_DOMAIN + companyName + "-" + uuidv4();
                        _a = this.rdf, NamedNode = _a.NamedNode, BlankNode = _a.BlankNode, Literal = _a.Literal;
                        companyNode = new NamedNode(companyURI);
                        TypeCompany = new this.rdf.Triple(companyNode, this.rdf.rdfsns('type'), new Literal(database.WEB_DOMAIN + "type/company"));
                        companyTripleName = new this.rdf.Triple(companyNode, database.vCard('FN'), new Literal(companyName));
                        companyTripleEmail = new this.rdf.Triple(companyNode, database.foaf('mbox'), new Literal(companyEmail));
                        companyTripleHeadquaters = new this.rdf.Triple(companyNode, database.foaf('based_near'), new Literal(companyHeadQuaters));
                        companyTripleHomepage = new this.rdf.Triple(companyNode, database.foaf('homepage'), new Literal(companyWebsite));
                        return [4 /*yield*/, this.client.query.update("\n        INSERT {" + TypeCompany.toNT() + "} WHERE {};\n        INSERT {" + companyTripleName.toNT() + "} WHERE {};\n        INSERT {" + companyTripleHeadquaters.toNT() + "} WHERE {};\n        INSERT {" + companyTripleHomepage.toNT() + "} WHERE {};\n        INSERT {" + companyTripleEmail.toNT() + "} WHERE {};\n      ")];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, companyURI];
                }
            });
        });
    };
    database.WEB_DOMAIN = "https://testDomain/";
    return database;
}());
exports.database = database;
// === MAIN ===
// Insert User
function insertUser(client) {
    return __awaiter(this, void 0, void 0, function () {
        var db, URI, getResult2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    db = new database();
                    return [4 /*yield*/, db.createUser("Maties", "Claesen", "matiesclaesen@gmail.com", "Belgie", "maties.blog.com", false)];
                case 1:
                    URI = _a.sent();
                    console.log("user: after insert");
                    return [4 /*yield*/, client.query.select("\n        SELECT * WHERE {\n            {\n                <" + URI + "> ?pred ?obj .\n            } UNION {\n                <" + URI + "> ?pred _:blankNode1 .\n                _:blankNode1 <" + database.vCard('given-name') + "> ?obj .\n            } UNION {\n                <" + URI + "> ?pred _:blankNode2 .\n                _:blankNode2 <" + database.vCard('family-name') + "> ?obj .\n            }\n        } LIMIT 10\n  ")];
                case 2:
                    getResult2 = _a.sent();
                    console.log(getResult2);
                    return [2 /*return*/];
            }
        });
    });
}
// Insert Company
function insertCompany(client) {
    return __awaiter(this, void 0, void 0, function () {
        var db, URI, getResult2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    db = new database();
                    return [4 /*yield*/, db.createCompany("apple@mail.com", "Apple", "Apple.com", "Cupertino")];
                case 1:
                    URI = _a.sent();
                    console.log("company: after insert");
                    return [4 /*yield*/, client.query.select("\n        SELECT * WHERE {\n            <" + URI + "> ?pred ?obj .\n        } LIMIT 20\n    ")];
                case 2:
                    getResult2 = _a.sent();
                    console.log(getResult2);
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = new Client({
                        bin: '/Users/matiesclaesen/Documents/WEBINF/apache-jena-4.6.1/bin',
                        db: '/Users/matiesclaesen/Documents/WEBINF/nodejs/database'
                    });
                    return [4 /*yield*/, client.endpoint.importFiles([require.resolve('/Users/matiesclaesen/Documents/WEBINF/nodejs/triples.nt')])];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, insertUser(client)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, insertCompany(client)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main();
