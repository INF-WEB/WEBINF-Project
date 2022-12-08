const workingDir: string = "..";

const { v4: uuidv4 } = require('uuid');
const Client = require('../Libs/jena-tdb/ParsingClient');

import { jobStatus, connectionStatus, connectionType, diplomaDegree, MatchForUser, MatchForJob, UpdateUser, UpdateCompany, UpdateJob, UpdateDiploma, UpdateProfessionalExperience, UpdateConnection } from "../Types/enum";
import { Geonames } from "./geonames";

//link to right bin file
export const binDir: string = "src/Libs/apache-jena/bin";
//const binDir : string = "C:\\Users\\thomi\\Documents\\Master\\web\\project\\git\\WEBINF-Project\\server\\linknot\\src\\Libs\\apache-jena\\bat"
//const binDir : string = "/mnt/c/Users/thomi/Documents/Master/web/project/git/WEBINF-Project/Server/linknot/src/Libs/apache-jena/bin"
//link to folder database in node.js
export const databaseDir: string = "src/database/rdf";
//const databaseDir : string = "C:\\Users\\thomi\\Documents\\Master\\web\\project\\git\\WEBINF-Project\\server\\linknot\\src\\database\\rdf";
//const databaseDir: string = "/mnt/c/Users/thomi/Documents/Master/web/project/git/WEBINF-Project/Server/linknot/src/database/rdf"

export class database {
    static readonly WEB_DOMAIN: string = "https://testDomain/";
    private rdf;
    private geonames;
    static vCard: any;
    static foaf: any;
    static dc: any;
    static dcat: any;
    static gn: any;
    static wd: any;
    /* TODO: Add the rest */

    private binDir: string;
    private databaseDir: string;
    client;
    constructor(binDir: string, databaseDir: string) {
        this.binDir = binDir;
        this.databaseDir = databaseDir;
        this.client = new Client({
            bin: this.binDir,
            db: this.databaseDir
        });

        this.rdf = require('rdf');
        this.databaseDir = databaseDir;

        this.geonames = Geonames({
            username: 'matieke6000',
            lan: 'en',
            encoding: 'JSON'
        });

        database.foaf = this.rdf.ns('http://xmlns.com/foaf/0.1/');
        database.vCard = this.rdf.ns('http://www.w3.org/2001/vcard-rdf/3.0#');
        database.dc = this.rdf.ns('http://purl.org/dc/elements/1.1/');
        database.dcat = this.rdf.ns('http://www.w3.org/ns/dcat#');
        database.gn = this.rdf.ns('https://www.geonames.org/ontology#');
        database.wd = this.rdf.ns('http://www.wikidata.org/entity/');
    }

    public async initDatabse() {
        if (this.databaseDir != "")
            await this.client.endpoint.importFiles([require.resolve(this.databaseDir)]);
    }

    /* === ASSIST === */

    /**
     * Gets the last index from the bag + 1
     * @param bag 
     * @returns 
     */
    private async getBagCount(bag: string): Promise<number> {
        const result = await this.client.query.select(`
            SELECT * WHERE {
                <`+ bag + `> ?pred ?obj .
            }
        `)

        let max: number = 0;
        result.forEach((element: any) => {
            const outputBagURI: string = element.pred.value.toString();

            const splittedOutputBagURI: string[] = outputBagURI.split(this.rdf.rdfns('_'));
            const lastIndex: number = 1;
            const currentNumBagURI: number = Number(splittedOutputBagURI[lastIndex]);

            if (max < currentNumBagURI)
                max = currentNumBagURI;
        });

        return max + 1;
    }

    private formatToXSDdate(date: Date): string {
        let formattedString: string = String(date.getFullYear()) + "-" + String(date.getMonth() + 1) + "-" + String(date.getDate());
        return formattedString;
    }

    /**
     * returns the "name" of the URI 
     * (which is set after last '/' in the URI)
     * @param URI the URI containing the name
     * @returns the name of the URI
     */
    private getLastSubstring(
        URI: string
    ): string {
        return URI.substring(URI.lastIndexOf("/") + 1)
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
    public async sparqlQuery(subj: string = "?subj", pred: string = "?pred", obj: string = "?obj"): Promise<any> {
        if (subj !== "?subj")
            subj = "<" + subj + ">";
        if (pred !== "?pred")
            pred = "<" + pred + ">";
        if (obj !== "?obj")
            obj = "<" + obj + ">";
        const result: Object = await this.client.query.select(`
            SELECT * WHERE {
                `+ subj + ` ` + pred + ` ` + obj + ` .
            }
        `);

        return result;
    }

    /**
     * in a pinch, low level SPARQL Query
     * @param queryString the SPARQL Query to be executed
     * @returns json object with the results
     */
    public async sparqlQueryLowLevel(queryString: string = ""): Promise<Object> {
        const result: Object = await this.client.query.select(queryString);
        return result;
    }

    public async getBag(bag: string): Promise<Object> {
        const result = await this.client.query.select(`
            SELECT * WHERE {
                <`+ bag + `> ?pred ?obj .
            }
        `);

        return result;
    }

    public async getBagItems(bag: string): Promise<Array<Object>> {
        const bagItems: any = await this.getBag(bag);

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

        let results: any = new Array<Object>();
        let i: number;
        for (i = 0; i < bagItems.length; i++) {
            let queryString: string = "SELECT * WHERE { <" + bagItems[i].obj.value + "> ?pred ?obj }";
            //console.log(queryString);
            //console.log(bagItems[i]);
            const result: Object = await this.client.query.select(queryString);
            //console.log(result);
            results.push(result);
        };

        return results;
    }

    private calcLongLatDist(results1: any, results2: any) {
        var distance = require('geo-dist-calc');
        var sourcePoints = { latitude: Number(results1[0].lat), longitude: Number(results1[0].lng) };
        var destinationPoints = { latitude: Number(results2[0].lat), longitude: Number(results2[0].lng) };
        var ResultantDistance = distance.discal(sourcePoints, destinationPoints);
        return ResultantDistance;
    }

    private async geo(location: string): Promise<any> {
        let result: any;
        try {
            result = await this.geonames.search({ q: location }) //get location
            if (result == undefined) 
                throw new Error;
        } catch (err) {
            console.error(err);
            console.error("timeout from server");
        }
        return result.geonames;
    }

    private getUpdateString(pred: string, newValue: string, uri: string, type: string = "") : string {
        if (type != "") {
            type = `^^<`+type+`>`;
        }
        return `
            DELETE { ?subj <`+pred+`> ?item }
            INSERT { ?subj <`+pred+`> \"`+newValue+`\"`+type+` }
            WHERE { 
                ?subj <`+pred+`> ?item
                FILTER( ?subj = <`+uri+`> ) 
              };`;
    }

    private getUpdateBlankString(pred1: string, pred2: string, newValue: string, uri: string, type: string = "") : string {
        return `
            DELETE { ?blank <`+pred2+`> ?item }
            INSERT { ?blank <`+pred2+`> \"`+newValue+`\"`+type+` }
            WHERE { 
                <`+uri+`> <`+pred1+`> ?blank .
                ?blank <`+pred2+`> ?item 
              };`;
    }

    private async getDiplomaType(field: string) : Promise<any> {
        let result: any = await this.sparqlQueryLowLevel(`
        PREFIX schema: <http://schema.org/>
        PREFIX wd: <http://www.wikidata.org/entity/>
        PREFIX wdt: <http://www.wikidata.org/prop/direct/>
        PREFIX wikibase: <http://wikiba.se/ontology#>
        PREFIX bd: <http://www.bigdata.com/rdf#>
        
        # Get all academic degrees with English title.
        SELECT * WHERE {
          SERVICE <https://query.wikidata.org/sparql> {
            SELECT * WHERE {
              {
                SELECT ?academicDegree ?academicDegreeLabel WHERE {
                  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
                  ?academicDegree wdt:P31 wd:Q189533. # academicDegree is an academic degree
                }
              }
              FILTER(regex(?academicDegreeLabel, \"`+ field + `\", "i") && LANG(?academicDegreeLabel))
            }
            order by strlen(str(?academicDegreeLabel))
          }
        }
        `);
        let firstFieldResult: string = "";
        if (result.length <= 0) {
            throw new Error('The type of diploma is not a correct wikidata diploma');
        } else
            firstFieldResult = result[0].academicDegreeLabel.value;
        return firstFieldResult
    }

    private async getJobType(type: string) : Promise<any> {
        let result: any = await this.sparqlQueryLowLevel(`
        PREFIX schema: <http://schema.org/>
        PREFIX wd: <http://www.wikidata.org/entity/>
        PREFIX wdt: <http://www.wikidata.org/prop/direct/>
        PREFIX wikibase: <http://wikiba.se/ontology#>
        PREFIX bd: <http://www.bigdata.com/rdf#>
        
        # Get all professions with Dutch title.
        SELECT * WHERE {
          SERVICE <https://query.wikidata.org/sparql> {
            SELECT * WHERE {
              {
                SELECT ?profession ?professionLabel WHERE {
                  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
                  ?profession wdt:P31 wd:Q28640. # profession is a profession
                }
              }
              FILTER(regex(?professionLabel, \"`+ type + `\", "i") && LANG(?professionLabel))
            }
            order by strlen(str(?professionLabel))
          }
        }
        `);
        let firstJobTypeResult: string = "";
        if (result.length <= 0) {
            throw new Error('The type of profession is not a correct wikidata profession');
        } else
            firstJobTypeResult = result[0].professionLabel.value;
        return firstJobTypeResult
    }

    /* === CREATE === */

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
    public async createUser(
        firstName: string,
        lastName: string,
        email: string,
        area: string,
        webpage: string,
        lookingForJob: boolean,
        userId: string
    ): Promise<string> {
        let userURI: string = database.WEB_DOMAIN + firstName + lastName + "-" + userId;
        let fullName: string = firstName + " " + lastName;

        const { NamedNode, BlankNode, Literal } = this.rdf;

        let namedNode = new NamedNode(userURI);

        let typeTriple = new this.rdf.Triple(
            namedNode,
            this.rdf.rdfsns('type'),
            new Literal(database.WEB_DOMAIN + "type/user")
        );

        let fullNameTriple = new this.rdf.Triple(
            namedNode,
            database.vCard('FN'),
            new Literal(fullName)
        );

        const blankNodeName = new BlankNode();

        let nameTriple = new this.rdf.Triple(
            namedNode,
            database.vCard('N'),
            blankNodeName
        );

        let firstNameTriple = new this.rdf.Triple(
            blankNodeName,
            database.vCard('given-name'),
            new Literal(firstName)
        );

        let lastNameTriple = new this.rdf.Triple(
            blankNodeName,
            database.vCard('family-name'),
            new Literal(lastName)
        );

        let emailTriple = new this.rdf.Triple(
            namedNode,
            database.foaf('mbox'),
            new Literal(email)
        );

        let webpageTriple = new this.rdf.Triple(
            namedNode,
            database.foaf('homepage'),
            new Literal(webpage)
        );

        let areaTriple = new this.rdf.Triple(
            namedNode,
            database.gn('name'),
            new Literal(area)
        );

        let lookingForJobTriple = new this.rdf.Triple(
            namedNode,
            database.WEB_DOMAIN + "looking-for-job",
            new Literal(String(lookingForJob), this.rdf.xsdns("boolean"))
        );
        
        console.log(lookingForJobTriple.toNT());


        await this.client.query.update(`
        INSERT {`+ typeTriple.toNT() + `} WHERE {};
        INSERT {`+ fullNameTriple.toNT() + `} WHERE {};
        INSERT { 
                    <`+ userURI + `> <` + database.vCard("N") + `> 
                        [   
                            <`+ database.vCard("given-name") + `> \"` + firstName + `\"; 
                            <`+ database.vCard("family-name") + `> \"` + lastName + `\" 
                        ] 
                } WHERE {};
        INSERT {`+ emailTriple.toNT() + `} WHERE {};
        INSERT {`+ webpageTriple.toNT() + `} WHERE {};
        INSERT {`+ areaTriple.toNT() + `} WHERE {};
        INSERT {`+ lookingForJobTriple.toNT() + `} WHERE {};
        `);

        return userURI;
    };

    /**
     * 
     * @param userURI 
     * @param graduation 
     * @param field 
     * @param educationalInstitute 
     * @returns diplomas bag uri
     */
    public async createDiplomaFor(
        userURI: string,
        graduation: Date,
        field: string,
        degree: diplomaDegree,
        educationalInstitute: string
    ): Promise<string> {
        const { NamedNode, BlankNode, Literal } = this.rdf;
        let diplomaBagURI: string = userURI + "/diplomas";
        let diplomaURI: string = database.WEB_DOMAIN + "diplomas/diploma-" + uuidv4();
        let diplomaNode = new NamedNode(diplomaURI);

        let bagIndex: number = await this.getBagCount(diplomaBagURI);
        let diplomaInBag = new this.rdf.Triple(
            diplomaBagURI,
            this.rdf.rdfns('_' + bagIndex),
            diplomaNode
        )

        let typeTriple = new this.rdf.Triple(
            diplomaNode,
            this.rdf.rdfsns('type'),
            new Literal(database.WEB_DOMAIN + "type/diploma")
        )

        let dateTriple = new this.rdf.Triple(
            diplomaNode,
            database.dc('date'),
            new Literal(this.formatToXSDdate(graduation), this.rdf.xsdns("date"))
        );

        let adresTriple = new this.rdf.Triple(
            diplomaNode,
            database.gn('name'),
            new Literal(educationalInstitute)
        );

        let typeOfDiploma: string = await this.getDiplomaType(field);
        const diplomaTypeTriple = new this.rdf.Triple(
            diplomaNode,
            database.wd('Q189533'),
            new Literal(typeOfDiploma)
        );

        


        let diplomaDegreeTriple = new this.rdf.Triple(
            diplomaNode,
            database.WEB_DOMAIN + "degree", //TODO: type for diploma @Mathias
            new Literal(degree.toString())
        );

        //TODO: jobTypeproperty

        const result = await this.client.query.update(`
            INSERT {`+ diplomaInBag.toNT() + `} WHERE {};
            INSERT {`+ typeTriple.toNT() + `} WHERE {};
            INSERT {`+ dateTriple.toNT() + `} WHERE {};
            INSERT {`+ adresTriple.toNT() + `} WHERE {};
            INSERT {`+ diplomaTypeTriple.toNT() + `} WHERE {};
            INSERT {`+ diplomaDegreeTriple.toNT() + `} WHERE {};
        `);

        return diplomaURI;
    }

    /**
     * 
     * @param userURI 
     * @param startDate 
     * @param endDate 
     * @param description 
     */
    public async createProfessionalExperienceFor(
        userURI: string,
        startDate: Date,
        endDate: Date,
        description: string
    ): Promise<string> {
        const { NamedNode, BlankNode, Literal } = this.rdf;
        if (startDate > endDate)
            throw new Error('The startdate is not earlier than the enddate');
        let professionalBagURI: string = userURI + "/professional-experiences";
        let professionalURI: string = professionalBagURI + "/professionalExperience-" + uuidv4();
        let professionalNode = new NamedNode(professionalURI);

        let bagIndex: number = await this.getBagCount(professionalBagURI);
        let professionalInBag = new this.rdf.Triple(
            professionalBagURI,
            this.rdf.rdfns('_' + bagIndex),
            professionalNode
        )

        let startDateTriple = new this.rdf.Triple(
            professionalNode,
            database.dcat('startDate'),
            new Literal(this.formatToXSDdate(startDate), this.rdf.xsdns("date"))
        );

        let endDateTriple = new this.rdf.Triple(
            professionalNode,
            database.dcat('endDate'),
            new Literal(this.formatToXSDdate(endDate), this.rdf.xsdns("date"))
        );

        let descriptionTriple = new this.rdf.Triple(
            professionalNode,
            database.dc('description'),
            new Literal(description)
        );

        let typeTriple = new this.rdf.Triple(
            professionalNode,
            this.rdf.rdfsns('type'),
            new Literal(database.WEB_DOMAIN + "type/professional-experience")
        )


        const result = await this.client.query.update(`
        INSERT {`+ professionalInBag.toNT() + `} WHERE {};
        INSERT {`+ typeTriple.toNT() + `} WHERE {};
        INSERT {`+ startDateTriple.toNT() + `} WHERE {};
        INSERT {`+ endDateTriple.toNT() + `} WHERE {};
        INSERT {`+ descriptionTriple.toNT() + `} WHERE {};
        `);
        
        return professionalURI;
    }


    /**
     * 
     * @param userURI1 
     * @param userURI2 
     * @param status 
     * @param type 
     */
    public async createConnectionWith(
        userURI1: string,
        userURI2: string,
        status: connectionStatus,
        type: connectionType
    ): Promise<string> {
        let connection1BagURI: string = userURI1 + "/connections";
        let connection2BagURI: string = userURI2 + "/connections";
        let connectionURI: string = database.WEB_DOMAIN + "connection/" + this.getLastSubstring(userURI1) + ";" + this.getLastSubstring(userURI2)
        const { NamedNode, BlankNode, Literal } = this.rdf;
        let connectionURINode = new NamedNode(connectionURI);

        let bagIndex: number = await this.getBagCount(connection1BagURI);
        let connectionInBagUser1 = new this.rdf.Triple(
            connection1BagURI,
            this.rdf.rdfns('_' + bagIndex),
            connectionURINode
        );

        bagIndex = await this.getBagCount(connection2BagURI);
        let connectionInBagUser2 = new this.rdf.Triple(
            connection2BagURI,
            this.rdf.rdfns('_' + bagIndex),
            connectionURINode
        )

        let connectionTypeTriple = new this.rdf.Triple(
            connectionURINode,
            this.rdf.rdfsns('type'),
            new Literal(database.WEB_DOMAIN + "type/connection")
        );

        let connectionStatusTriple = new this.rdf.Triple(
            connectionURINode,
            connectionURI + "/status",
            new Literal(status.toString())
        );

        let connectionHasType = new this.rdf.Triple(
            connectionURINode,
            database.WEB_DOMAIN + "connection-type",
            new Literal(type.toString())
        );

        const result = await this.client.query.update(`
            INSERT {`+ connectionInBagUser1.toNT() + `} WHERE {};
            INSERT {`+ connectionInBagUser2.toNT() + `} WHERE {};
            INSERT {`+ connectionTypeTriple.toNT() + `} WHERE {};
            INSERT {`+ connectionStatusTriple.toNT() + `} WHERE {};
            INSERT {`+ connectionHasType.toNT() + `} WHERE {};
        `);
        
        return connectionURI;
    };


    /**
     * 
     * @param email 
     * @param name 
     * @param webpage 
     * @param headquaters 
     * @returns 
     */
    public async createCompany(
        email: string,
        name: string,
        webpage: string,
        headquaters: string,
        companyId: string
    ): Promise<string> {
        let companyURI: string = database.WEB_DOMAIN + name + "-" + companyId;

        const { NamedNode, BlankNode, Literal } = this.rdf;
        let companyNode = new NamedNode(companyURI);

        let TypeCompany = new this.rdf.Triple(
            companyNode,
            this.rdf.rdfsns('type'),
            new Literal(database.WEB_DOMAIN + "type/company")
        );

        let companyTripleName = new this.rdf.Triple(
            companyNode,
            database.vCard('FN'),
            new Literal(name)
        );

        let companyTripleEmail = new this.rdf.Triple(
            companyNode,
            database.foaf('mbox'),
            new Literal(email)
        );

        let companyTripleHeadquaters = new this.rdf.Triple(
            companyNode,
            database.gn('name'),
            new Literal(headquaters)
        );

        let companyTripleHomepage = new this.rdf.Triple(
            companyNode,
            database.foaf('homepage'),
            new Literal(webpage)
        );

        const result = await this.client.query.update(`
        INSERT {`+ TypeCompany.toNT() + `} WHERE {};
        INSERT {`+ companyTripleName.toNT() + `} WHERE {};
        INSERT {`+ companyTripleHeadquaters.toNT() + `} WHERE {};
        INSERT {`+ companyTripleHomepage.toNT() + `} WHERE {};
        INSERT {`+ companyTripleEmail.toNT() + `} WHERE {};
      `);
        return companyURI;
    };

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
     * @exception Error : the type of job is not a correct wikidata profession
     * @returns 
     */
    public async createJob(
        companyURI: string,
        jobName: string,
        area: string,
        workExperience: string,
        diploma: diplomaDegree,
        jobDescription: string,
        status: jobStatus,
        type: string,
    ): Promise<string> {
        let jobBagURI: string = companyURI + "/jobs";
        const { NamedNode, Literal } = this.rdf;
        let jobsNode = new NamedNode(jobBagURI);
        let jobURI: string = jobBagURI + "/" + jobName;
        let jobNameNode = new NamedNode(jobURI); //TODO: add "/"

        let bagIndex: number = await this.getBagCount(jobBagURI);
        let jobInBag = new this.rdf.Triple(
            jobsNode,
            this.rdf.rdfns('_' + bagIndex),
            jobNameNode
        )

        let typeOfNode = new this.rdf.Triple(
            jobNameNode,
            this.rdf.rdfsns('type'),
            new Literal(database.WEB_DOMAIN + "type/job")
        );

        let jobStatusType = new this.rdf.Triple(
            jobNameNode,
            jobURI + "/status",
            new Literal(status.toString())
        );

        let diplomaType = new this.rdf.Triple(
            jobNameNode,
            database.WEB_DOMAIN + "diploma",
            new Literal(diploma.toString())
        );

        let titleTriple = new this.rdf.Triple(
            jobNameNode,
            database.dc('title'),
            new Literal(jobName)
        );

        let areaTriple = new this.rdf.Triple(
            jobNameNode,
            database.gn('name'),
            new Literal(area)
        );

        let descriptionTriple = new this.rdf.Triple(
            jobNameNode,
            database.dc('description'),
            new Literal(workExperience)
        );

        let jobDescriptionTriple = new this.rdf.Triple(
            jobNameNode,
            database.dc('description'),
            new Literal(jobDescription)
        );

        const typeOfJob: string = await this.getJobType(type);

        let jobTypeTriple = new this.rdf.Triple(
            jobNameNode,
            database.wd('Q28640'),
            new Literal(typeOfJob)
        );

        const result = await this.client.query.update(`
        INSERT {`+ jobInBag.toNT() + `} WHERE {};
        INSERT {`+ typeOfNode.toNT() + `} WHERE {};
        INSERT {`+ jobStatusType.toNT() + `} WHERE {};
        INSERT {`+ diplomaType.toNT() + `} WHERE {};
        INSERT {`+ titleTriple.toNT() + `} WHERE {};
        INSERT {`+ areaTriple.toNT() + `} WHERE {};
        INSERT {`+ descriptionTriple.toNT() + `} WHERE {};
        INSERT {`+ jobDescriptionTriple.toNT() + `} WHERE {};
        INSERT {`+ jobTypeTriple.toNT() + `} WHERE {};
      `);
        return jobURI;
    };

    /* === SELECT === */

    /**
     * get all directly associated data from a user in a json object 
     * !does not return baglists
     * @param userURI 
     * TODO: limit: number
     * @returns json object with the results
     */
    public async selectUser(userURI: string): Promise<Object> {
        // get first result again
        const result: Object = await this.client.query.select(`
            SELECT * WHERE {
                {
                    <`+ userURI + `> ?pred ?obj .
                } UNION {
                    <`+ userURI + `> ?pred _:blankNode1 .
                    _:blankNode1 <`+ database.vCard('given-name') + `> ?obj .
                } UNION {
                    <`+ userURI + `> ?pred _:blankNode2 .
                    _:blankNode2 <`+ database.vCard('family-name') + `> ?obj .
                }
            }
        `);
        return result;
    }

    /**
     * get all directly associated data from a company in a json object
     * !does not return baglists 
     * @param companyURI 
     * TODO: limit: number
     * @returns json object with the results
     */
    public async selectCompany(companyURI: string): Promise<Object> {
        const result = await this.client.query.select(`
            SELECT * WHERE {
                <`+ companyURI + `> ?pred ?obj .
            } 
        `);
        return result;
    }

    public async selectDiplomas(userURI: string): Promise<any> {
        let result = await this.client.query.select(`
            SELECT * WHERE {
                <`+ userURI + `/diplomas> ?item ?uri
            }
        `);
        return result;
    }

    public async selectProfessionalExperiences(userURI: string): Promise<any> {
        let result = await this.client.query.select(`
            SELECT * WHERE {
                <`+ userURI + `/professional-experiences> ?item ?uri
            }
        `);
        return result;
    }

    public async selectConnections(userURI: string): Promise<any> {
        let result = await this.client.query.select(`
            SELECT * WHERE {
                <`+ userURI + `/connections> ?item ?uri .
            }
        `);
        //console.log(result);
        return result;
    }

    public async selectJobsUser(userURI: string): Promise<any> {
        let result = await this.client.query.select(`
            SELECT * WHERE {
                <`+ userURI + `/jobs> ?item ?uri .
            }
        `);
        return result;
    }

    public async selectJobsCompany(companyURI: string) : Promise<any> {
        let result = await this.client.query.select(`
            SELECT * WHERE {
                <` + companyURI + `/jobs> ?item ?uri .
            }
        `);
        //console.log(result);
        return result;
    }

    public async selectDiploma(diplomaURI: string): Promise<Object> {
        let result = await this.client.query.select(`
            SELECT * WHERE {
                <`+ diplomaURI + `> ?pred ?obj .
            }
        `);
        return result;
    }

    public async selectProfessionalExperience(professionalExperienceURI: string): Promise<Object> {
        let result = await this.client.query.select(`
            SELECT * WHERE {
                <`+ professionalExperienceURI + `> ?pred ?obj .
            }
        `);
        return result;
    }

    public async selectConnection(connectionURI: string): Promise<Object> {
        let result = await this.client.query.select(`
            SELECT * WHERE {
                <`+ connectionURI + `> ?pred ?obj .
            }
        `);
        return result;
    }

    /**
     * get all directly associated data from a job in a json object
     * !does not return baglists 
     * @param jobURI 
     * TODO: limit: number
     * @returns json object with the results
     */
    public async selectJob(jobURI: string): Promise<Object> {
        // get first result again
        const result: Object = await this.client.query.select(`
            SELECT * WHERE {
                <`+ jobURI + `> ?pred ?obj .
            } 
        `);
        return result;
    }

    public async selectAllDiplomas(): Promise<any> {
        let result = await this.client.query.select(`
            SELECT DISTINCT ?diplomas WHERE {
                ?diplomas ?pred ?obj .
                FILTER (
                CONTAINS(STR(?diplomas), "https://testDomain/diplomas/")
                )
            }
        `);
        return result;
    }

    public async selectAllConnections(): Promise<any> {
        let result = await this.client.query.select(`
            SELECT DISTINCT ?connections WHERE {
                ?connections ?pred ?obj .
                FILTER (
                    CONTAINS(STR(?connections), "https://testDomain/connection/")
                )
            }
        `);
        return result;
    }

    public async selectEmployees(companyURI: string): Promise<any> {
        let result = await this.client.query.select(`
        SELECT * WHERE {
            ?employees ?item ?uri .
            FILTER (
                CONTAINS(STR(?employees), `+ companyURI + `\"/employees\")
            )
        }
        `);
        return result;
    }

    public async selectPotentialEmployees(companyURI: string): Promise<any> {
        let result = await this.client.query.select(`
        SELECT * WHERE {
            ?employees ?item ?uri .
            FILTER (
                CONTAINS(STR(?employees), \"`+ companyURI + `/potential-employees\")
            )
        }
        `);
        return result;
    }

    public async selectPotentialJobs(userURI: string): Promise<any> {
        let result = await this.client.query.select(`
        SELECT * WHERE {
            ?jobs ?item ?blank .
            ?blank ?potentialJob ?job
            FILTER (
                CONTAINS(STR(?jobs), \"`+ userURI + `/potential-jobs\") #&&
    			#!CONTAINS(STR(?potentialJob), "/isAccepted")
            )
        }
        `);
        //console.log(result);
        return result;
    }

    /* === UPDATE === */

    public async updateUser(
        userURI: string, 
        {
            firstname,
            lastname,
            webpage,
            lookingForJob
        }: UpdateUser){
        let updateFirstName: string = "";
        let updateLastName: string = "";
        let updateWebpage: string = "";
        let updateLookingForJob: string = "";
        let updateFullName: string = "";
        let fullName = "";
        if (firstname != undefined) 
            updateFirstName = this.getUpdateBlankString(database.vCard('N'), database.vCard('given-name'), firstname, userURI);
        if (lastname != undefined) 
            updateLastName = this.getUpdateBlankString(database.vCard('N'), database.vCard('family-name'), lastname, userURI);
        if (firstname != undefined || lastname != undefined) {
            let names = await this.client.query.select(`
            PREFIX foaf: <http://www.w3.org/2001/vcard-rdf/3.0#>

            SELECT ?firstName ?lastName WHERE {
                <`+userURI+`> <http://www.w3.org/2001/vcard-rdf/3.0#N>  
                    [   <http://www.w3.org/2001/vcard-rdf/3.0#given-name> ?firstName ; 
                        <http://www.w3.org/2001/vcard-rdf/3.0#family-name> ?lastName    ] 
            }`);

            if (firstname != undefined && lastname == undefined) {
                console.log("1");
                fullName += firstname;
                fullName += " " + names[0].lastName.value;
            } else if (firstname == undefined && lastname != undefined) {
                console.log("2");
                fullName += names[0].firstName.value;
                fullName += " " + lastname;
            } else {
                console.log("3");
                console.log(names);
                fullName += firstname + " " + lastname;
            }
            updateFullName = this.getUpdateString(database.vCard('FN'), fullName, userURI);
        }
        /*PREFIX foaf: <http://www.w3.org/2001/vcard-rdf/3.0#>

DELETE { ?user foaf:FN ?item }
INSERT { ?user foaf:FN 'firstname lastname' }
WHERE { 
    ?user foaf:FN ?item .
  	FILTER( ?user = <https://testDomain/MatiesClaesen-1> ) 
}; */

        if (webpage != null) 
            updateWebpage = this.getUpdateString(database.foaf('homepage'), webpage, userURI);
        if (lookingForJob != null) 
            updateLookingForJob = this.getUpdateString(database.WEB_DOMAIN + "looking-for-job", lookingForJob.toString(), userURI, this.rdf.xsdns("boolean"))
        let update =  await this.client.query.update(`
            `+updateFirstName+`
            `+updateLastName+`
            `+updateFullName+`
            `+updateWebpage+`
            `+updateLookingForJob+`
        `);
    }
    
    public async updateCompany(
        companyURI: string,
        {
            name,
            webpage,
            headquaters
        }: UpdateCompany) {
        let updateName: string = "";
        let updateWebpage: string = "";
        let updateHeadquaters: string = "";
        if(name != null)
            updateName = this.getUpdateString(database.vCard('FN'), name, companyURI);
        if(webpage != null)
            updateWebpage = this.getUpdateString(database.foaf('homepage'), webpage, companyURI);
        if(headquaters != null)
            updateHeadquaters = this.getUpdateString(database.gn('name'), headquaters, companyURI);
        let update =  await this.client.query.update(`
            `+updateName+`
            `+updateWebpage+`
            `+updateHeadquaters+`
        `)
    }

    public async updateJob(
        jobURI: string,
        {
            jobName,
            area,
            workexperience,
            diploma,
            jobdescription,
            status,
            type
        }: UpdateJob
    ) {
        let updateJobName: string = "";
        let updateArea: string = "";
        let updateWorkecperience: string = "";
        let updateDiploma: string = "";
        let updateJobDescription: string = "";
        let updateStatus: string = "";
        let updateJobType: string = "";
        if(jobName != null)
            updateJobName  = this.getUpdateString(database.dc('title'), jobName, jobURI);
        if(area != null)
            updateArea = this.getUpdateString(database.gn('name'), area, jobURI);
        if(workexperience != null)
            updateWorkecperience = this.getUpdateString(database.dc('description'), workexperience, jobURI);
        if(diploma != null)
            updateDiploma = this.getUpdateString(database.WEB_DOMAIN + "diploma", diploma.toString(), jobURI);
        if(jobdescription != null)
            updateJobDescription = this.getUpdateString(database.dc('description'), jobdescription, jobURI);
        if(status != null)
            updateStatus = this.getUpdateString(jobURI + "/status", status.toString(), jobURI);
        if(type != null) {
            let jobType: string = await this.getJobType(type)
            updateJobType = this.getUpdateString(database.wd('Q28640'), jobType, jobURI);
        }
        let update =  await this.client.query.update(`
            `+updateJobName+`    
            `+updateArea+`
            `+updateWorkecperience+`
            `+updateDiploma+`
            `+updateJobDescription+`
            `+updateStatus+`
            `+updateJobType+`
        `)
    }

    public async updateDiploma(
        diplomaURI: string,
        {
            graduation,
            field,
            degree,
            educationalInstitute
        }: UpdateDiploma
    ){
        let updateGraduation: string = "";
        let updateField: string = "";
        let updateDegree: string = "";
        let updateEducationInstitute: string = "";
        if(graduation != null)
            updateGraduation = this.getUpdateString(database.dc('date'), this.formatToXSDdate(graduation), diplomaURI);
        if(field != null){
            let diplomaType: string = await this.getDiplomaType(field)
            updateField = this.getUpdateString(database.wd('Q189533'), diplomaType, diplomaURI);
        }
        if(degree != null)
            updateDegree = this.getUpdateString(database.WEB_DOMAIN + "degree", degree.toString(), diplomaURI);
        if(educationalInstitute != null) {
            updateEducationInstitute = this.getUpdateString(database.gn('name'), educationalInstitute, diplomaURI);
        }
        let update =  await this.client.query.update(`
            `+updateGraduation+`
            `+updateField+`
            `+updateDegree+`
            `+updateEducationInstitute+`
        `)
    }

    public async updateProfessionalExperience(
        professionalExperienceURI: string,
        {
            startDate,
            endDate,
            description
        }: UpdateProfessionalExperience
    ){
        let updateStartDate: string = "";
        let updateEndDate: string = "";
        let updateDescription: string = "";

        if (startDate != null && endDate != null && startDate > endDate) {
            throw new Error('The startdate is not earlier than the enddate');
        } else {
            let result = await this.client.query.select(`
            SELECT ?startDate ?endDate WHERE {
                <`+professionalExperienceURI+`>     <http://www.w3.org/ns/dcat#startDate> ?startDate ; 
                                                    <http://www.w3.org/ns/dcat#endDate> ?endDate    
            }`);
            let currentStartDate = result[0].startDate.value;
            let currentEndDate = result[0].endDate.value;

            if (startDate != null && startDate > currentEndDate)
                throw new Error('The startdate is not earlier than the enddate');
            if (endDate != null && currentStartDate > endDate)
                throw new Error('The startdate is not earlier than the enddate');
        }

        

        if(startDate != null)
            updateStartDate = this.getUpdateString(database.dcat('startDate'), this.formatToXSDdate(startDate), professionalExperienceURI);
        if(endDate != null)
            updateEndDate = this.getUpdateString(database.dcat('endDate'), this.formatToXSDdate(endDate), professionalExperienceURI);
        if(description != null)
            updateDescription = this.getUpdateString(database.dc('description'), description, professionalExperienceURI);
        let update =  await this.client.query.update(`
            `+updateStartDate+`
            `+updateEndDate+`
            `+updateDescription+`
        `)
    }

    public async updateConnection(
        connectionURI: string,
        {
            status,
            type
        }: UpdateConnection
    ){
        let updateStatus: string = "";
        let updateConnectionType = "";
        if(status != null)
            updateStatus = this.getUpdateString(connectionURI + "/status", status.toString(), connectionURI);
        if(type != null)
            updateConnectionType = this.getUpdateString(database.WEB_DOMAIN + "connection-type", type.toString(), connectionURI);
        let update =  await this.client.query.update(`
            `+updateStatus+`
            `+updateConnectionType+`
        `)
    }

    public async updatePotentialJob(userURI: string, jobURI: string, isAccepted: boolean){
        let pred = database.WEB_DOMAIN + "isAccepted";
        let update =  await this.client.query.update(`
            DELETE { ?blank <`+pred+`> ?isAccepted }
            INSERT { ?blank <`+pred+`> \"`+isAccepted.toString()+`\"^^<`+this.rdf.xsdns("boolean")+`> }
            WHERE { 
                <`+userURI+`/potential-jobs> ?item ?blank .
                ?blank ?potentialJob <`+jobURI+`> .
                ?blank <`+pred+`> ?isAccepted
            };
        `);
    }

    /* === DELETE === */

    private async deletePotentialEmployee(userURI: string) {
        const deletion = await this.client.query.update(`
            DELETE {
                ?potentialEmployees ?item ?user
            } WHERE {
                ?potentialEmployees ?item ?user .
                FILTER (
                    REGEX(STR(?potentialEmployees), "/potential-employees") &&
                    ?user = <`+ userURI + `> )
            }
        `)
    }

    private async deletePotentialJob(userURI: string) {
        let pojoBagURI: string = userURI + "/potential-jobs";
        const deletion = await this.client.query.update(`
            DELETE WHERE {
                <`+ pojoBagURI + `> ?item ?blank .
                ?blank ?pred ?obj .
            }
        `);
    }

    public async deleteAllPotentials(userURI: string) {
        await this.deletePotentialEmployee(userURI);
        await this.deletePotentialJob(userURI);
    }

    //TODO: delete from bag does not change the index!
    //EXTRA: do not delete employee from employeebag when 2 jobs for same company
    public async deleteJob(jobURI: string) {
        let deleteJob = await this.client.query.update(`
        DELETE {
            ?jobsBagUser ?item ?job .
  			?jobsBagCompany ?item3 ?job .
            ?job ?pred ?obj .
            ?employeesBag ?item2 ?employee
        } WHERE {
            ?jobsBagUser ?item ?job .
  			?jobsBagCompany ?item3 ?job .
            ?job ?pred ?obj .
            ?employeesBag ?item2 ?employee
            FILTER(
                ?job = <`+ jobURI + `> &&
  			  CONTAINS(STR(?jobsBagUser), "/jobs") && 
              CONTAINS(STR(?jobsBagCompany), "/jobs") && 
              CONTAINS(STR(?employeesBag), "/employees") &&
              CONTAINS(STR(?jobsBagCompany), REPLACE(STR(?employeesBag), "/employees", ""))
            )
          }
    `);
    }

    public async deleteAllJobsForUser(userURI: string) {
        let delEmployees = await this.client.query.update(`
            DELETE {
                ?employees ?item ?user
            } WHERE {
                ?employees ?item ?user 
                FILTER(
                    ?user = <`+ userURI + `> &&
                    CONTAINS(STR(?employees), "/employees")
                )
            }
        `);

        let delJobs = await this.client.query.update(`
            DELETE {
                ?jobsBag ?item ?job 
            } WHERE {
                ?jobsBag ?item ?job 
                FILTER(
                  ?jobsBag = <`+ userURI + `/jobs> &&
                  CONTAINS(STR(?jobsBag), "/jobs")
                )
              }
        `)
    }


    public async deleteAllProfessionalExperiences(userURI: string) {
        let del = await this.client.query.update(`
            DELETE {
                ?pes ?item ?pe .
                ?pe ?pred ?obj .
            } WHERE {
                ?pes ?item ?pe .
                ?pe ?pred ?obj .
                FILTER ( 
                    ?pes = <`+ userURI + `/professional-experiences>
                )
            }
        `);
    }

    public async deleteAllDiplomas(userURI: string) {
        let del = await this.client.query.update(`
            DELETE {
                ?diplomas ?item ?diploma .
                ?diploma ?pred ?obj .
            } WHERE {
                ?diplomas ?item ?diploma .
                ?diploma ?pred ?obj .
                FILTER (
                  ?diplomas = <`+ userURI + `/diplomas> 
                )
            }
        `);
    }

    public async deleteAllConnections(userURI: string) {
        let del = await this.client.query.update(`
            DELETE {
                ?connectionBag1 ?item ?conn .
                ?conn ?pred ?obj .
                ?connectionBag2 ?item2 ?conn.
            } WHERE { 
                ?connectionBag1 ?item ?conn .
                ?conn ?pred ?obj .
                ?connectionBag2 ?item2 ?conn.
                FILTER (
                    STR(?connectionBag1) = \"`+ userURI + `\"+"/connections"
                )
            }
        `);
    }

    public async deleteUser(userURI: string) {
        await this.deleteAllJobsForUser(userURI);
        await this.deleteAllPotentials(userURI);
        await this.deleteAllDiplomas(userURI);
        await this.deleteAllProfessionalExperiences(userURI);
        await this.deleteAllConnections(userURI);
        let del = await this.client.query.update(`
            DELETE {
                ?user ?pred ?obj .
                ?obj ?vcard ?name . 
            } WHERE {
                ?user ?pred ?obj .
                OPTIONAL { ?obj ?vcard ?name }
                FILTER(
                    ?user = <`+ userURI + `>
                )
            }
        `);
    }

    public async deleteCompany(companyURI: string) {
        let del = await this.client.query.update(`
        DELETE { 
            ?company ?pred ?obj .
            ?jobsBagCompany ?item3 ?job .
            ?jobsBagUser ?item ?job .
            ?job ?pred2 ?obj2 .
            ?employeesBag ?item2 ?employee
        } WHERE {
            ?company ?pred ?obj .
            ?jobsBagCompany ?item3 ?job .
            FILTER ( 
              STR(?company) = \"`+ companyURI + `\" &&
              CONTAINS(STR(?jobsBagCompany), STR(?company)+"/jobs") 
            )
            
            ?jobsBagUser ?item ?job .
            FILTER (
              CONTAINS(STR(?jobsBagUser), "/jobs") 
            )
            
            ?job ?pred2 ?obj2 .
            ?employeesBag ?item2 ?employee
            FILTER(
              CONTAINS(STR(?employeesBag), "/employees") 
            )
        }
        `);
    }

    public async deleteDiploma(diplomaURI: string) {
        let del = await this.client.query.update(`
            DELETE {
                ?diplomas ?item ?diploma .
                ?diploma ?pred ?obj .
            } WHERE {
                ?diplomas ?item ?diploma .
                ?diploma ?pred ?obj .
                FILTER (
                ?diploma = <`+ diplomaURI + `> 
                )
            }
        `);
    }

    public async deleteProfessionalExperience(professionalExperienceURI: string) {
        let del = await this.client.query.update(`
        DELETE {
            ?pes ?item ?pe .
            ?pe ?pred ?obj
        } WHERE {
            ?pes ?item ?pe .
            ?pe ?pred ?obj
            FILTER(
                ?pe = <`+ professionalExperienceURI + `>
            )
        }
      `);
    }

    public async deleteConnection(connectionURI: string) {
        let del = await this.client.query.update(`
        DELETE {
            ?connectionBag1 ?item ?conn .
            ?conn ?pred ?obj .
            ?connectionBag2 ?item2 ?conn.
        } WHERE { 
            ?connectionBag1 ?item ?conn .
            ?conn ?pred ?obj .
            ?connectionBag2 ?item2 ?conn.
            FILTER (
                ?conn = <`+ connectionURI + `>
            )
        }
        `);
    }

    /* === OPERATION === */

    public async matchForUser({
        userURI,
        jobType,
        companyURI,
        maxDistanceKm = -1,
        checkDegree = false,
    }: MatchForUser): Promise<Object> {
        let userResult: any = await this.client.query.select(`
            PREFIX gn: <https://www.geonames.org/ontology#>
            SELECT * WHERE {
                            <`+userURI+`> gn:name ?area
            }
        `);
        let userAddrName: string = userResult[0].area.value;

        let queryJobType: string;
        let queryCompanyName: string;
        let queryDegree: string;

        await this.deleteAllPotentials(userURI);

        //set job type query string
        if (jobType != null) {
            queryJobType = `?job <` + database.wd('Q28640') + `> \"` + jobType + `\" .`
        } else {
            queryJobType = `OPTIONAL{ 
                                <`+ userURI + `/jobs> ?jobs ?currentJob .
                                ?currentJob <http://www.wikidata.org/entity/Q28640> ?currentJobType .
                                FILTER (?jobType = ?currentJobType)
                            }`;
        }


        //set company name query string
        if (companyURI != null) {
            queryCompanyName = `<` + companyURI + `/jobs> ?item ?job .`;
        } else {
            queryCompanyName = "";
        }

        if (checkDegree) {
            queryDegree = `OPTIONAL{ 
                                <`+ userURI + `/diplomas> ?item ?currentDiploma . 
                                ?currentDiploma ?diploma ?currentDegree . 
                                FILTER(REGEX(STR(?diploma), "/degree"))
                            }
                            ?job ?jobDiploma ?jobDegree .
                            FILTER (?jobDegree = ?currentDegree || ?jobDegree = "none")`;
        } else {
            queryDegree = "";
        }

        const completeQueryString: string = `SELECT DISTINCT ?job ?jobArea ?jobType WHERE {
            `+ queryCompanyName + `
            `+ queryJobType + `
            `+ queryDegree + `
            ?job ?status "pending" .
            ?job <http://www.w3.org/2000/01/rdf-schema#type> "https://testDomain/type/job" .
            ?job <https://www.geonames.org/ontology#name> ?jobArea .
            ?job <http://www.wikidata.org/entity/Q28640> ?jobType .
            FILTER(REGEX(STR(?status), "/status"))
        }`

        //console.log(completeQueryString);

        let matchedJobs: any = await this.sparqlQueryLowLevel(completeQueryString);

        //console.log(matchedJobs);
        //console.log(userAddrName);

        const userAddrResult = await this.geo(userAddrName);
        //console.log(userAddrResult[0]);

        for (const job of matchedJobs) {
            //console.log(job);
            let jobAddrName: string = job.jobArea.value;
            const jobAddrResult: any = await this.geo(jobAddrName);
            //console.log(jobAddrResult);

            let distance: any = this.calcLongLatDist(userAddrResult, jobAddrResult);
            //console.log("Distance km: " + distance.kilometers);
            if (maxDistanceKm == -1 || distance.kilometers <= maxDistanceKm) {
                let jobURI: string = job.job.value;
                //console.log("added " + jobURI + " to " + userURI);
                await this.addPotential(jobURI, userURI, false);
                
            }
        };

        return matchedJobs;
    }

    public async matchForCompany(companyURI: string): Promise<Object> {
        //Optional EXTRA:
        return new Object;
    }

    public async matchForJob({
        jobURI,
        checkDegree = false,
        maxDistanceKm = -1,
    }: MatchForJob): Promise<any> {
        let queryDegree: string;
        if (checkDegree) {
            queryDegree =
                `OPTIONAL{ 
                ?userDiplomasBag ?diplomas ?currentDiploma . 
                ?currentDiploma ?hasDegree ?currentDegree . 
                FILTER(
                    CONTAINS(STR(?hasDegree), "/degree") &&
                    CONTAINS(STR(?userJobsBag), STR(?user)) 
                )
            }
            FILTER (?jobDegree = ?currentDegree || ?jobDegree = "none")`;
        } else {
            queryDegree = "";
        }

        let users: any = await this.sparqlQueryLowLevel(
            `SELECT DISTINCT ?user ?userArea ?jobArea WHERE { 
                ?user 	<http://www.w3.org/2000/01/rdf-schema#type> "https://testDomain/type/user" ;
                        <https://testDomain/looking-for-job> true ;
                        <https://www.geonames.org/ontology#name> ?userArea .
                ?userJobsBag ?jobs ?currentJob .
                ?currentJob <http://www.wikidata.org/entity/Q28640> ?currentJobType . 
                FILTER ( 
                    ?jobType = ?currentJobType && 
                    CONTAINS( REPLACE(STR(?userJobsBag), ">", ""), REPLACE(STR(?user), ">", "")) 
                )
                                      
                `+ queryDegree + `
            
                <`+ jobURI + `>    <http://www.wikidata.org/entity/Q28640> ?jobType ;
                                ?jobDiploma ?jobDegree ;
                                <https://www.geonames.org/ontology#name> ?jobArea .
                FILTER(CONTAINS(STR(?jobDiploma), "/diploma"))
            }`
        );
        //console.log(users);

        if (users.length == 0) { //no users found
            return new Array();
        }
        const jobAddrResult = await this.geo(users[0].jobArea.value);

        let matchedUsers: Array<string> = new Array();
        for (const user of users) {
            let userAddrName: string = user.userArea.value;
            //console.log(userAddrName);
            const userAddrResult: any = await this.geo(userAddrName);
            //console.log(userAddrResult[0]);

            let distance: any = this.calcLongLatDist(jobAddrResult, userAddrResult);
            //console.log("Distance km: " + distance.kilometers);
            if (maxDistanceKm == -1 || distance.kilometers <= maxDistanceKm) {
                let userURI: string = user.user.value;
                //console.log("added " + userURI);
                matchedUsers.push(userURI);
            }
        };

        return matchedUsers;
    }

    private async addJobToEmployee(
        userURI: string, //Resourse user
        jobURI: string //Resourse job
    ): Promise<void> {
        let jobBagURI: string = userURI + "/jobs";

        let bagIndex: number = await this.getBagCount(jobBagURI);

        const result = await this.client.query.update(`
            INSERT { 
                <`+ jobBagURI + `> <` + this.rdf.rdfns('_' + bagIndex) + `> <` + jobURI + `> 
            } WHERE {};
        `);
    }

    private async addEmployeeToCompany(
        companyURI: string, //Resource employee
        employeeURI: string //Resource company
    ): Promise<void> {
        let companyEmployeesBagURI: string = companyURI + "/employees";

        let bagIndex: number = await this.getBagCount(companyEmployeesBagURI);

        const result = await this.client.query.update(`
            INSERT { 
                <`+ companyEmployeesBagURI + `> <` + this.rdf.rdfns('_' + bagIndex) + `> <` + employeeURI + `> 
            } WHERE {
                SELECT * WHERE { 
                    FILTER NOT EXISTS {
                        <`+ companyEmployeesBagURI + `>
                        ?item 
                        <` + employeeURI + `>
                    } 
                }
            };
        `);
    };

    private async addPotentialJob(
        userURI: string, //Resource user
        jobURI: string, //Resource job
        isAccepted: boolean
    ): Promise<void> {
        let pojoBagURI: string = userURI + "/potential-jobs";
        let pojoURI: string = userURI + "/potential-job" + uuidv4();

        let bagIndex: number = await this.getBagCount(pojoBagURI);

        //TODO: jobtypeProperty

        const result = await this.client.query.update(`
            INSERT { 
                <`+ pojoBagURI + `> <` + this.rdf.rdfns('_' + bagIndex) + `> 
                    [   
                        <`+ pojoURI + `> <` + jobURI + `>; 
                        <`+ database.WEB_DOMAIN + `isAccepted> \"`+isAccepted.toString()+`\"^^<`+this.rdf.xsdns("boolean")+`>
                    ] 
            } WHERE {};
        `);
    };

    private async addPotentialEmployee(
        jobURI: string,
        userURI: string,
    ): Promise<void> {
        //TODO: Check if this user is not already in this list
        let jobPotentialEmployeesBagURI: string = jobURI + "/potential-employees";

        let bagIndex: number = await this.getBagCount(jobPotentialEmployeesBagURI);

        const result = await this.client.query.update(`
            INSERT { 
                <`+ jobPotentialEmployeesBagURI + `> <` + this.rdf.rdfns('_' + bagIndex) + `> <` + userURI + `> 
            } WHERE {};
        `);
    };


    /**
     * Adds a potential employee to a job && adds the potential job to the employee's potential jobs list
     * @param jobURI the job which is going to have a new potential employee
     * @param userURI the user which is going to get a new potential job
     * @param isAccepted    the status if the user has accepted a job offer 
     *                      (the company still has the final say if the user receives the job, via addJob)
     */
    public async addPotential(jobURI: string, userURI: string, isAccepted: boolean) {
        await this.addPotentialEmployee(jobURI, userURI);
        await this.addPotentialJob(userURI, jobURI, isAccepted);
    }

    /**
     * Adds a new employee to a company && adds the job to the employee's jobs list
     * @param companyURI the company which is going to have a new employee
     * @param jobURI the job from the company which has a new employee
     * @param employeeURI the employee which is hired for a ``companyURI`` to do the ``jobURI``
     */
    public async addEmployee(companyURI: string, jobURI: string, employeeURI: string) {
        await this.addEmployeeToCompany(companyURI, employeeURI);
        await this.addJobToEmployee(employeeURI, jobURI);
    }

    // -- TESTS --
    async tests() {
        let testing: boolean = true;
        if (!testing)
            return 1;

        var db: database = new database(binDir, databaseDir);

        //await client.endpoint.importFiles([require.resolve('/Users/matiesclaesen/Documents/WEBINF/nodejs/triples.nt')]);

        let maties: string = await db.createUser("Maties", "Claesen", "matiesclaesen@gmail.com", "Genk", "maties.blog.com", true, "1");
         let femke: string = await db.createUser("Femke", "Grandjean", "femke.grandjean@ergens.com", "Hasselt", "femke.com", false, "2");
        // let tijl: string = await db.createUser("Tijl", "Elens", "tijl.elens@ergens.com", "Zonhoven", "tijl-elens@blog.com", true, "15");
        //let diploma1: string =  await db.createDiplomaFor(maties, new Date(), "Doctor of Philosophy in Mechanical Engineering", diplomaDegree.Doctorate, "UHasselt");
        // await db.createDiplomaFor(maties, new Date(), "Master of Resource Studies", diplomaDegree.Master, "UHasselt");

        // //await db.deleteAllDiplomas(maties);

        //let connectionURI: string = await db.createConnectionWith(maties, femke, connectionStatus.Pending, connectionType.Friend);
        // await db.createConnectionWith(tijl, femke, connectionStatus.Accepted, connectionType.Friend);
        // await db.createConnectionWith(tijl, maties, connectionStatus.Pending, connectionType.Friend);


        //let professionalExperience1: string = await db.createProfessionalExperienceFor(maties, new Date(), new Date(), "Afwassen");
        // await db.createProfessionalExperienceFor(maties, new Date(), new Date(), "Test");
        let company: string = await db.createCompany("Bol@gmail.com", "Bol", "Bol.com", "Utrecht", "3");
        // let edm: string = await db.createCompany("EDM@gmail.com", "EDM", "EDM.com", "Diepenbeek", "4");
        let CEO: string = await db.createJob(company, "CEO-of-Bol.com", "Alken", "He has done a lot of stuff", diplomaDegree.None, "looking at a screen all day", jobStatus.Pending, "chief executive officer");
        // let pakjes: string = await db.createJob(company, "Pakjes-Verplaatser", "Brussel", "Kunnen adressen lezen", diplomaDegree.Doctorate, "Pakjes in de juiste regio zetten", jobStatus.Pending, "chief executive officer");
        //await db.addEmployee(company, CEO, maties);

        // //await db.deleteJob(CEO);
        // //await db.deleteUser(maties);

        // //let callcenterJob: string = await db.createJob(company, "Callcenter", "Leuven", "telefoon kunnen gebruiken", diplomaDegree.None, "24/7 telefoons oppakken", jobStatus.Pending, "dishwasher");

        await db.matchForUser({ userURI: maties, maxDistanceKm: 200, jobType: "chief executive officer"});
        //await db.matchForUser({ userURI: maties, maxDistanceKm: 50,checkDegree: true });
        //await db.matchForJob({jobURI: callcenterJob, checkDegree: true});
        //await db.matchForJob({jobURI: pakjes, checkDegree: true, maxDistanceKm: 100});

        
        //await db.updateUser(maties, {firstname: "test", lastname: "idk", webpage: "tinder.com", lookingForJob: false});
        //await db.updateCompany(company, {name: "Apple", webpage: "apple.fjdkla;", headquaters: "San Francisco"});
        //await db.updateJob(CEO, {jobName: "test", area: "Gent", diploma: diplomaDegree.Bachelor, jobdescription: "Werken", workexperience: "gewerkt hebben", status: jobStatus.Pending, type: "dishwasher"})
        //await db.updateDiploma(diploma1, {graduation: new Date("2012-1-1"), field: "Master of Resource Studies", degree: diplomaDegree.Master, educationalInstitute: "Leuven"})
        //await db.updateProfessionalExperience(professionalExperience1, {startDate: new Date("2022-10-18"), endDate: new Date("2022-12-7"), description: "herhkefhelkhflefkhjel"})
        //await db.updateConnection(connectionURI, {status: connectionStatus.Accepted, type: connectionType.Coworker});
        //await db.updatePotentialJob(maties, CEO, true);
        console.log("FINAL RESULT");
        let everything: any = await db.sparqlQuery();
        console.log(everything);

    }
}

// -- TEST FUNCNTIONS -- 
// Insert User
async function TESTinsertUser(client: any) {
    var db: database = new database(binDir, databaseDir);

    let URI: string = await db.createUser("Maties", "Claesen", "matiesclaesen@gmail.com", "Belgie", "maties.blog.com", false, uuidv4());

    let result: Object = await db.selectUser(URI);
    console.log("user: after insert");
    console.log(result);
}

// Insert Company
async function TESTinsertCompany(client: any) {
    let db: database = new database(binDir, databaseDir);

    let URI: string = await db.createCompany("apple@mail.com", "Apple", "Apple.com", "Cupertino", uuidv4());

    let result: Object = await db.selectCompany(URI);
    console.log("company: after insert");
    console.log(result);
}

// Insert Jobs
async function TESTinsertJobs(companyURI: string, client: any) {
    let db: database = new database(binDir, databaseDir);

    let URI: string = await db.createJob(
        companyURI,
        "afwasser",
        "in de keuken",
        "Ge moet al eens een bord vastgehouden hebben enz snapje",
        diplomaDegree.Elementary,
        "borden afwassen 24/7",
        jobStatus.Pending,
        "dishwasher",
    );
    let job1URI = await db.createJob(companyURI,
        "tester",
        "bij it departement debuggen",
        "weten wat een debugger is",
        diplomaDegree.Bachelor,
        "langsgaan en de hele tijd op step over klikken",
        jobStatus.Pending,
        "programmer",
    );
    let job2URI = await db.createJob(companyURI,
        "IT",
        "Bureau",
        "Ge moet al eens een programma hebben gemaakt enz snapje",
        diplomaDegree.Bachelor,
        "programeren 24/7",
        jobStatus.Pending,
        "network engineer",
    );

    let result: Object = await db.selectJob(URI);
    console.log("company: after job insertion");
    console.log(result);
}

//tests();
