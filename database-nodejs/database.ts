const workingDir : string = "..";

const { v4: uuidv4 } = require(workingDir+'/node_modules/uuid');
const DataFactory = require(workingDir+'/node_modules/rdf');
const Client = require(workingDir+'/node_modules/jena-tdb/ParsingClient');
import { jobStatus } from './jobStatus'; 
import { connectionType } from './connectionType';
import { connectionStatus } from './connectionStatus';
const binDir : string = "/Users/matiesclaesen/Documents/WEBINF/apache-jena-4.6.1/bin";
const dbDir : string = "/Users/matiesclaesen/Documents/repos/WEBINF-Project/database-nodejs/database"; 

export class database {

    static readonly WEB_DOMAIN: string = "https://testDomain/";
    private rdf;
    static vCard: any;
    static foaf: any;
    static dc: any;
    static dcat: any;
    /* TODO: Add the rest */

    client;
    constructor() {
        this.client = new Client({
            bin: binDir,
            db: dbDir
        })
        this.rdf = require(workingDir+'/node_modules/rdf');
        database.foaf = this.rdf.ns('http://xmlns.com/foaf/0.1/');
        database.vCard = this.rdf.ns('http://www.w3.org/2001/vcard-rdf/3.0#');
        database.dc = this.rdf.ns('http://purl.org/dc/elements/1.1/');
        database.dcat = this.rdf.ns('http://www.w3.org/ns/dcat#');
    }

    /**
     * Gets the last index from the bag + 1
     * @param bag 
     * @returns 
     */
     private async getBagCount(bag: string): Promise<number> {
        const result = await this.client.query.select(`
            SELECT * WHERE {
                <`+ bag +`> ?pred ?obj .
            }
        `)
        
        let max: number = 0;
        result.forEach((element : any) => {
            const outputBagURI: string = element.pred.value.toString();

            const splittedOutputBagURI : string[] = outputBagURI.split(this.rdf.rdfns('_'));
            const lastIndex : number = 1;
            const currentNumBagURI : number = Number(splittedOutputBagURI[lastIndex]); 

            if (max < currentNumBagURI)
                max = currentNumBagURI;
        });

        return max+1;
    }

    public async createUser(
        firstName: string,
        lastName: string,
        email: string,
        area: string,
        webpage: string,
        lookingForJob: boolean
    ): Promise<string> {
        let userURI: string = database.WEB_DOMAIN + firstName + lastName + "-" + uuidv4();
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
            database.foaf('based_near'),
            new Literal(area)
        );

        let lookingForJobTriple = new this.rdf.Triple(
            namedNode,
            userURI + "/looking-for-job",
            new Literal(String(lookingForJob), this.rdf.xsdns("boolean"))
        );


        await this.client.query.update(`
        INSERT {`+ typeTriple.toNT() + `} WHERE {};
        INSERT {`+ fullNameTriple.toNT() + `} WHERE {};
        INSERT { 
                    <`+ userURI +`> <`+ database.vCard("N") +`> 
                        [   
                            <`+ database.vCard("given-name") +`> \"`+ firstName +`\"; 
                            <`+ database.vCard("family-name") +`> \"`+ lastName +`\" 
                        ] 
                } WHERE {};
        INSERT {`+ emailTriple.toNT() + `} WHERE {};
        INSERT {`+ webpageTriple.toNT() + `} WHERE {};
        INSERT {`+ areaTriple.toNT() + `} WHERE {};
        INSERT {`+ lookingForJobTriple.toNT() + `} WHERE {};
        `);
        
        return userURI;
    };

    public async createDiplomaFor(
        userURI: string,
        graduation: Date,
        jobType: string,
        educationalInstitute: string
    ): Promise<string>{
        const { NamedNode, BlankNode, Literal } = this.rdf;
        let diplomaBagURI: string = userURI + "/diplomas";
        let diplomaNode = new NamedNode(database.WEB_DOMAIN + "diplomas/diploma1-"+ uuidv4());

        let bagIndex: number = await this.getBagCount(diplomaBagURI);
        let diplomaInBag = new this.rdf.Triple(
            diplomaBagURI,
            this.rdf.rdfns('_'+bagIndex),
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
            new Literal(graduation.toUTCString(), this.rdf.xsdns("date"))
        );

        let adresTriple = new this.rdf.Triple(
            diplomaNode,
            database.vCard('ADR'),
            new Literal(educationalInstitute)
        );

        //TODO: jobTypeproperty

        const result = await this.client.query.update(`
            INSERT {`+ diplomaInBag.toNT() + `} WHERE {};
            INSERT {`+ typeTriple.toNT() + `} WHERE {};
            INSERT {`+ dateTriple.toNT() + `} WHERE {};
            INSERT {`+ adresTriple.toNT() + `} WHERE {};
        `);

        return userURI;
    }
    
    public async createProfessionalExperienceFor(
        userURI: string, 
        startDate: Date,
        endDate: Date,
        description: string
    ): Promise<void>{
        const { NamedNode, BlankNode, Literal } = this.rdf;
        let professionalBagURI : string = userURI + "/professional-experiences";
        let professionalURI : string = professionalBagURI + "/professionalExperience1";
        let professionalNode = new NamedNode(professionalURI);
        
        let bagIndex: number = await this.getBagCount(professionalBagURI);
        let professionalInBag = new this.rdf.Triple(
            professionalBagURI,
            this.rdf.rdfns('_'+bagIndex),
            professionalNode
        )
        
        let startDateTriple = new this.rdf.Triple(
            professionalNode,
            database.dcat('startDate'),
            new Literal(startDate.toUTCString(), this.rdf.xsdns("date"))
        );

        let endDateTriple = new this.rdf.Triple(
            professionalNode,
            database.dcat('endDate'),
            new Literal(endDate.toUTCString(), this.rdf.xsdns("date"))
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
        INSERT {`+ professionalInBag.toNT() +`} WHERE {};
        INSERT {`+ typeTriple.toNT() + `} WHERE {};
        INSERT {`+ startDateTriple.toNT() + `} WHERE {};
        INSERT {`+ endDateTriple.toNT() + `} WHERE {};
        INSERT {`+ descriptionTriple.toNT() + `} WHERE {};
        `);

    }

    private getLastSubstring(
        URI: string
    ): string{
        return URI.substring(URI.lastIndexOf("/") + 1)
    };


    public async createConnectionWith(
        userURI1: string,
        userURI2: string,
        status: connectionStatus,
        type: connectionType
    ): Promise<void>{
        let connection1BagURI : string = userURI1 + "/connections";
        let connection2BagURI : string = userURI2 + "/connections";
        let connectionURI: string = database.WEB_DOMAIN + "connection/" + this.getLastSubstring(userURI1) + ";" + this.getLastSubstring(userURI2)
        const { NamedNode, BlankNode, Literal } = this.rdf;
        let connectionURINode = new NamedNode(connectionURI);
        
        let bagIndex: number = await this.getBagCount(connection1BagURI);
        let connectionInBagUser1 = new this.rdf.Triple(
            connection1BagURI,
            this.rdf.rdfns('_'+bagIndex),
            connectionURINode
        );

        bagIndex = await this.getBagCount(connection2BagURI);
        let connectionInBagUser2 = new this.rdf.Triple(
            connection2BagURI,
            this.rdf.rdfns('_'+bagIndex),
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
            connectionURI + "/type",
            new Literal(type.toString())
        );
        
        const result = await this.client.query.update(`
            INSERT {`+ connectionInBagUser1.toNT() + `} WHERE {};
            INSERT {`+ connectionInBagUser2.toNT() + `} WHERE {};
            INSERT {`+ connectionTypeTriple.toNT() + `} WHERE {};
            INSERT {`+ connectionStatusTriple.toNT() + `} WHERE {};
            INSERT {`+ connectionHasType.toNT() + `} WHERE {};
        `);
        
    };

    public async addPotentialJob(
        userURI: string, //Resource user
        jobURI: string, //Resource job
        isAccepted: boolean
    ): Promise<void>{
        let pojoBagURI: string = userURI + "/potential-jobs";
        let pojoURI: string = userURI + "/potential-job";

        let bagIndex: number = await this.getBagCount(pojoBagURI);
        
        //TODO: jobtypeProperty
        
        const result = await this.client.query.update(`
            INSERT { 
                <`+ pojoBagURI +`> <`+ this.rdf.rdfns('_'+bagIndex) +`> 
                    [   
                        <`+ pojoURI +`> <`+ jobURI +`>; 
                        <`+ pojoURI +`/isAccepted> \"`+ String(isAccepted) +`\" 
                    ] 
            } WHERE {};
        `);
    };

    public async addJob(
        userURI: string, //Resourse user
        jobUri: string //Resourse job
    ): Promise<void>{
        let jobBagURI: string = userURI + "/jobs";

        let bagIndex: number = await this.getBagCount(jobBagURI);
        
        const result = await this.client.query.update(`
            INSERT { 
                <`+ jobBagURI +`> <`+ this.rdf.rdfns('_'+bagIndex) +`> <`+ jobUri +`> 
            } WHERE {};
        `);
    }

    public async createCompany(
        companyEmail: string,
        companyName: string,
        companyWebsite: string,
        companyHeadQuaters: string
    ): Promise<string> {
        let companyURI: string = database.WEB_DOMAIN + companyName + "-" + uuidv4();

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
            new Literal(companyName)
        );

        let companyTripleEmail = new this.rdf.Triple(
            companyNode,
            database.foaf('mbox'),
            new Literal(companyEmail)
        );

        let companyTripleHeadquaters = new this.rdf.Triple(
            companyNode,
            database.foaf('based_near'),
            new Literal(companyHeadQuaters)
        );

        let companyTripleHomepage = new this.rdf.Triple(
            companyNode,
            database.foaf('homepage'),
            new Literal(companyWebsite)
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

    public async createJob(
        companyURI: string,
        jobName: string,
        area: string,
        workExperience: string,
        diploma: string,
        jobDescription: string,
        status: jobStatus,
        type: string
    ): Promise<string>{
        let jobBagURI: string = companyURI + "/jobs";
        const { NamedNode, Literal } = this.rdf;
        let jobsNode = new NamedNode(jobBagURI);
        let jobNameNode = new NamedNode(jobBagURI+"/"+jobName); //TODO: add "/"

        let bagIndex: number = await this.getBagCount(jobBagURI);
        let jobInBag = new this.rdf.Triple(
            jobsNode,
            this.rdf.rdfns('_'+bagIndex),
            jobNameNode
        )

        let jobType = new this.rdf.Triple(
            jobNameNode,
            this.rdf.rdfsns('type'),
            new Literal(database.WEB_DOMAIN + "type/job")
        );

        let jobStatusType = new this.rdf.Triple(
            jobNameNode,
            jobBagURI + "/status",
            new Literal(status.toString())
        );

        let diplomaType = new this.rdf.Triple(
            jobNameNode,
            jobBagURI + "/diploma-type",
            new Literal(diploma)
        );

        let titleTriple = new this.rdf.Triple(
            jobNameNode,
            database.dc('title'),
            new Literal(jobName)
        );
        
        let areaTriple = new this.rdf.Triple(
            jobNameNode,
            database.vCard('ADR'),
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
        
        //TODO: jobtypeProperty
        
        const result = await this.client.query.update(`
        INSERT {`+ jobInBag.toNT() + `} WHERE {};
        INSERT {`+ jobType.toNT() + `} WHERE {};
        INSERT {`+ jobStatusType.toNT() + `} WHERE {};
        INSERT {`+ diplomaType.toNT() + `} WHERE {};
        INSERT {`+ titleTriple.toNT() + `} WHERE {};
        INSERT {`+ areaTriple.toNT() + `} WHERE {};
        INSERT {`+ descriptionTriple.toNT() + `} WHERE {};
        INSERT {`+ jobDescriptionTriple.toNT() + `} WHERE {};
      `);
        return jobBagURI;
    };

    public async addEmployeeToCompany(
        companyURI: string, //Resource employee
        employeeURI: string //Resource company
    ): Promise<void>{
        let companyEmployeesBagURI: string = companyURI + "/jobs";

        let bagIndex: number = await this.getBagCount(companyEmployeesBagURI);
        
        const result = await this.client.query.update(`
            INSERT { 
                <`+ companyEmployeesBagURI +`> <`+ this.rdf.rdfns('_'+bagIndex) +`> <`+ employeeURI +`> 
            } WHERE {};
        `);
    };

    public async addPotentialEmployees(
        jobURI: string,
        userURI: string, 
    ): Promise<void>{
        let jobPotentialEmployeesBagURI: string = jobURI + "/potential-employees";

        let bagIndex: number = await this.getBagCount(jobPotentialEmployeesBagURI);
        
        const result = await this.client.query.update(`
            INSERT { 
                <`+ jobPotentialEmployeesBagURI +`> <`+ this.rdf.rdfns('_'+bagIndex) +`> <`+ userURI +`> 
            } WHERE {};
        `);
    };
}

// === MAIN ===

// Insert User
async function insertUser(client: any): Promise<string> {
    var db: database = new database();

    let URI: string = await db.createUser("Maties", "Claesen", "matiesclaesen@gmail.com", "Belgie", "maties.blog.com", false);

    console.log("user: after insert");

    // get first result again
    const getResult2 = await client.query.select(`
        SELECT * WHERE {
            {
                <`+ URI + `> ?pred ?obj .
            } UNION {
                <`+ URI + `> ?pred _:blankNode1 .
                _:blankNode1 <`+ database.vCard('given-name') + `> ?obj .
            } UNION {
                <`+ URI + `> ?pred _:blankNode2 .
                _:blankNode2 <`+ database.vCard('family-name') + `> ?obj .
            }
        } LIMIT 10
  `);

    console.log(getResult2);
    return URI;
}

// Insert Company
async function insertCompany(client: any) {
    // get first result from graph
    let db: database = new database();

    let URI: string = await db.createCompany("apple@mail.com", "Apple", "Apple.com", "Cupertino");

    console.log("company: after insert");

    // get first result again
    const getResult2 = await client.query.select(`
        SELECT * WHERE {
            <`+ URI + `> ?pred ?obj .
        } LIMIT 20
    `);

    console.log(getResult2);
    return URI;
}

async function insertJob(companyURI: string, client: any) {
    let db: database = new database();

    let URI: string = await db.createJob(
        companyURI, 
        "afwasser", 
        "in de keuken", 
        "Ge moet al eens een bord vastgehouden hebben enz snapje", 
        "diploma-ofz", 
        "borden afwassen 24/7", 
        jobStatus.Pending,
        "TODO:-uit-de-OWL-ofz-krijgen",      
        );
    
    console.log("company: after job insertion");

    // get first result again
    const getResult2 = await client.query.select(`
        SELECT * WHERE {
            <`+ URI + `> ?pred ?obj .
        } LIMIT 20
    `);   

    console.log(getResult2);
}

async function main() {
    const client = new Client({
        bin: binDir,
        db: dbDir
    });
    var db: database = new database();
    
    //await client.endpoint.importFiles([require.resolve('/Users/matiesclaesen/Documents/WEBINF/nodejs/triples.nt')]);

    let maties : string = await db.createUser("Maties", "Claesen", "matiesclaesen@gmail.com", "Belgie", "maties.blog.com", false);
    let femke : string = await db.createUser("Femke", "Grandjean", "femke.grandjean@ergens.com", "België", "femke.com", false);
    await db.createDiplomaFor(maties, new Date(), "nothing", "UHasselt");
    await db.createDiplomaFor(maties, new Date(), "nothing2", "UHasselt");

    await db.createConnectionWith(maties, femke, connectionStatus.Accepted, connectionType.Friend);
    await db.createProfessionalExperienceFor(femke, new Date(), new Date(), "IT'er");


    let companyURI: string = await insertCompany(client);
    let job1URI = await db.createJob(companyURI, 
        "afwasser", 
        "in de keuken", 
        "Ge moet al eens een bord vastgehouden hebben enz snapje", 
        "diploma-ofz", 
        "borden afwassen 24/7", 
        jobStatus.Pending,
        "TODO:-uit-de-OWL-ofz-krijgen",      
        );
    let job2URI = await db.createJob(companyURI, 
        "IT", 
        "Bureau", 
        "Ge moet al eens een programma hebben gemaakt enz snapje", 
        "diploma's-ofz", 
        "programeren 24/7", 
        jobStatus.Pending,
        "TODO:-uit-de-OWL-ofz-krijgen",      
        );

    await db.addJob(femke, job1URI);
    await db.addJob(femke, job2URI);
    await db.addEmployeeToCompany(companyURI, femke);
    await db.addPotentialJob(maties, job1URI, false);
    await db.addPotentialEmployees(job1URI, maties);
    await db.addPotentialEmployees(job1URI, maties);


    console.log("FINAL RESULT");
    const everything = await client.query.select(`
        SELECT * WHERE {
            ?subj ?pred ?obj
        } 
    `);



    console.log(everything);
}

main();