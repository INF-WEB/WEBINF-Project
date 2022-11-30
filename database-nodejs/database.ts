const { v4: uuidv4 } = require("./node_modules/uuid");
const DataFactory = require("./node_modules/rdf");
const Client = require('./node_modules/jena-tdb/ParsingClient');


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
            bin: '/Users/matiesclaesen/Documents/WEBINF/apache-jena-4.6.1/bin',
            db: '/Users/matiesclaesen/Documents/WEBINF/nodejs/database'
        })
        this.rdf = require('./node_modules/rdf');
        database.foaf = this.rdf.ns('http://xmlns.com/foaf/0.1/');
        database.vCard = this.rdf.ns('http://www.w3.org/2001/vcard-rdf/3.0#');
        database.dc = this.rdf.ns('');
        database.dcat = this.rdf.ns('http://www.w3.org/ns/dcat#');
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
            this.rdf.rdfsns(userURI + "/looking-for-job"),
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
        jobType: any,
        educationalInstitute: string
    ): Promise<string>{
        const { NamedNode, BlankNode, Literal } = this.rdf;
        let diplomaURI = userURI + "/diplomas";
        let diplomaNode = new NamedNode(database.WEB_DOMAIN + "/diplomas/{diploma1}" +"-"+ uuidv4());
        let dateTriple = new this.rdf.Triple(
            diplomaNode,
            database.dc('date'),
            new Literal(String(graduation), this.rdf.xsdns("date"))
        );

        let adresTriple = new this.rdf.Triple(
            diplomaNode,
            database.vCard('ADR'),
            new Literal(educationalInstitute)
        );

        //TODO: jobTypeproperty

        let typeTriple = new this.rdf.Triple(
            diplomaNode,
            this.rdf.rdfsns('type'),
            new Literal(database.WEB_DOMAIN + "/type/diploma")
        )

        const result = await this.client.query.update(`
        INSERT {`+ typeTriple.toNT() + `} WHERE {};
        INSERT {`+ dateTriple.toNT() + `} WHERE {};
        INSERT {`+ adresTriple.toNT() + `} WHERE {};
        `);

        //TODO: herbekijken
        await this.client.query.update(`
            INSERT {<`+ result + `>} WHERE {<` + diplomaURI + "/diplomas" + `>};
        `);

        return userURI;
    }
    
    public async createProfessionalExperienceFor(
        jobURI: string,
        startDate: Date,
        endDate: Date,
        description: string
    ): Promise<String>{
        const { NamedNode, BlankNode, Literal } = this.rdf;
        let professionalURI = jobURI + "/professional-experiences/{professional-experience1}";
        let professionalNode = new NamedNode(professionalURI);
        let startDateTriple = new this.rdf.Triple(
            professionalNode,
            database.dcat('startDate'),
            new Literal(String(startDate), this.rdf.xsdns("date"))
        );

        let endDateTriple = new this.rdf.Triple(
            professionalNode,
            database.dcat('endDate'),
            new Literal(String(endDate), this.rdf.xsdns("date"))
        );

        let descriptionTriple = new this.rdf.Triple(
            professionalNode,
            database.dc('description'),
            new Literal(description)
        );

        let typeTriple = new this.rdf.Triple(
            professionalNode,
            this.rdf.rdfsns('type'),
            new Literal(database.WEB_DOMAIN + "/type/professional-experience")
        )

        const result = await this.client.query.update(`
        INSERT {`+ typeTriple.toNT() + `} WHERE {};
        INSERT {`+ startDateTriple.toNT() + `} WHERE {};
        INSERT {`+ endDateTriple.toNT() + `} WHERE {};
        INSERT {`+ descriptionTriple.toNT() + `} WHERE {};
        `);

        //TODO: herbekijken
        await this.client.query.update(`
            INSERT {`+ result.toNT() + `} WHERE {<` + jobURI + "/professional-experience" + `>};
        `);

        return jobURI;
    }

    private getLastSubstring(
        URI: string
    ): string{
        return URI.substring(URI.lastIndexOf("/") + 1)
    };


    public async createConnectionWith(
        userURI1: string,
        userURI2: string,
        status: any,
        type: any
    ): Promise<void>{
        let connectionURI = database.WEB_DOMAIN + "connection/" + this.getLastSubstring(userURI1) + ";" + this.getLastSubstring(userURI2)
        const { NamedNode, BlankNode, Literal } = this.rdf;
        let connectionURINode = new NamedNode(connectionURI);
        let connectionStatus = this.rdf.Triple(
            connectionURINode,
            connectionURI + "/status",
            new Literal(String(status))
        );

        let connectionsType = new this.rdf.Triple(
            connectionURINode,
            connectionURI + "/type",
            new Literal(String(type))
        );

        let connectionType = new this.rdf.Triple(
            connectionURINode,
            this.rdf.rdfsns('type'),
            new Literal(database.WEB_DOMAIN + "/type/connection")
        );
        
        const result = await this.client.query.update(`
            INSERT {`+ connectionType.toNT() + `} WHERE {};
            INSERT {`+ connectionStatus.toNT() + `} WHERE {};
            INSERT {`+ connectionsType.toNT() + `} WHERE {};
        `);
        
        //TODO: herbekijken
        await this.client.query.update(`
            INSERT {<`+ result + `>} WHERE {<` + userURI1 + "/connections" + `>};
        `);
        
        //TODO: herbekijken
        await this.client.query.update(`
        INSERT {<`+ result + `>} WHERE {<` + userURI2 + "/connections" + `>};
        `);
    };

    public async addPotentialJob(
        userURI: string, //Resource user
        jobURI: string, //Resource job
        isAccepted: boolean
    ): Promise<void>{
        //TODO:
        /*
        Property potentialJobsProperty = model.createProperty(user.getURI() + "/potential-jobs");
        Property potentialJobProperty = model.createProperty(user.getURI() + "/potential-job");
        Property jobProperty = user.getModel().getProperty(potentialJobsProperty.getURI());
        Bag potentialJobsBag = model.getBag(user.getURI() + "/potential-jobs");
        Property isAcceptedProperty = model.createProperty(user.getURI() + getLastSubstring(job.getURI()) + "/isAccepted");
        Resource blank = model.createResource();

        if(potentialJobsBag == null) {
            Bag potentialJobs = model.createBag(user.getURI() + "/potential-jobs");
            blank.addProperty(isAcceptedProperty, isAccepted.toString());
            blank.addProperty(potentialJobProperty, job);
            user.addProperty(jobProperty, potentialJobs);
        }else{
            blank.addProperty(isAcceptedProperty, isAccepted.toString());
            blank.addProperty(potentialJobProperty, job);
            potentialJobsBag.add(blank);
            user.addProperty(jobProperty, potentialJobsBag);
        }
        */
    };

    public async addJob(
        userURI: string, //Resourse user
        jobUri: string //Resourse job
    ): Promise<void>{
        //TODO:
        /*
        Property jobProperty = model.createProperty(user.getURI() + "/jobs");
        Bag jobsBag = model.getBag(user.getURI() + "/jobs");
        if(jobsBag == null) {
            Bag jobs = model.createBag(user.getURI() + "/jobs");
            jobs.add(job);
            user.addProperty(jobProperty, jobs);
        }else{
            jobsBag.add(job);
            user.addProperty(jobProperty, jobsBag);
        }
        */
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
        diploma: any,
        jobDescription: string,
        status: any,
        type: string
    ): Promise<string>{
        let jobURI: string = companyURI + "/jobs";
        const { NamedNode, BlankNode, Literal } = this.rdf;
        let jobNameURI = new NamedNode(jobURI + jobName);

        let jobType = new this.rdf.Triple(
            jobNameURI,
            this.rdf.rdfsns('type'),
            new Literal(database.WEB_DOMAIN + "/type/job")
        );

        let jobStatusType = new this.rdf.Triple(
            jobNameURI,
            jobURI + "/status",
            new Literal(String(status))
        );

        let diplomaType = new this.rdf.Triple(
            jobNameURI,
            jobURI + "/diploma-type",
            new Literal(String(diploma))
        );

        let titleTriple = new this.rdf.Triple(
            jobNameURI,
            database.dc('title'),
            new Literal(jobName)
        );
        
        let areaTriple = new this.rdf.Triple(
            jobNameURI,
            database.vCard('ADR'),
            new Literal(area)
        );

        let descriptionTriple = new this.rdf.Triple(
            jobNameURI,
            database.dc('description'),
            new Literal(workExperience)
        );
        
        let jobDescriptionTriple = new this.rdf.Triple(
            jobNameURI,
            database.dc('description'),
            new Literal(jobDescription)
        );
        
        //TODO: jobtypeProperty
        
        const result = await this.client.query.update(`
        INSERT {`+ jobType.toNT() + `} WHERE {` + jobURI + `};
        INSERT {`+ jobStatusType.toNT() + `} WHERE {` + jobURI + `};
        INSERT {`+ diplomaType.toNT() + `} WHERE {` + jobURI + `};
        INSERT {`+ titleTriple.toNT() + `} WHERE {` + jobURI + `};
        INSERT {`+ areaTriple.toNT() + `} WHERE {` + jobURI + `};
        INSERT {`+ descriptionTriple.toNT() + `} WHERE {` + jobURI + `};
        INSERT {`+ jobDescriptionTriple.toNT() + `} WHERE {` + jobURI + `};
      `);
        return jobURI;
    };

    public async addEmployeeToCompany(
        employeeURI: string, //Resource employee
        companyURI: string //Resource company
    ): Promise<void>{
        //TODO:
        /*
        Property employeesProperty = model.createProperty(company.getURI() + "/employees");
        Bag companyEmployeesBag = (Bag) company.getModel().getBag(company.getURI() + "/employees");
        if (companyEmployeesBag == null) {
            Bag employees = model.createBag(company.getURI() + "/employees");
            employees.add(employee);
            company.addProperty(employeesProperty, employees);
        } else {
            companyEmployeesBag.add(employee);
            company.addProperty(employeesProperty, companyEmployeesBag);
        }
        */
    };

    public async addPotentialEmployees(
        userURI: string, //Resource user
        jobURI: string  //Resource job
    ): Promise<void>{
        //TODO:
        /*
        Property potentialEmployeeProperty = model.createProperty(job.getURI() + "/potential-employees");
        Property potentialEmployeesProperty = user.getModel().getProperty(potentialEmployeeProperty.getURI());
        Bag potentialEmployeesBag = model.getBag(user.getURI() + "/potential-jobs");
        if(potentialEmployeesBag == null) {
            Bag potentialEmployees = model.createBag(user.getURI() + "/potential-jobs");
            potentialEmployees.add(user);
            user.addProperty(potentialEmployeesProperty, potentialEmployees);
        }else{
            potentialEmployeesBag.add(user);
            user.addProperty(potentialEmployeesProperty, potentialEmployeesBag);
        }
        */
    };
}

// === MAIN ===

// Insert User
async function insertUser(client: any): Promise<void> {
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
}

// Insert Company
async function insertCompany(client: any) {
    // get first result from graph
    var db: database = new database();

    let URI: string = await db.createCompany("apple@mail.com", "Apple", "Apple.com", "Cupertino");

    console.log("company: after insert");

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
        bin: '/Users/matiesclaesen/Documents/WEBINF/apache-jena-4.6.1/bin',
        db: '/Users/matiesclaesen/Documents/WEBINF/nodejs/database'
    })

    await client.endpoint.importFiles([require.resolve('/Users/matiesclaesen/Documents/WEBINF/nodejs/triples.nt')])

    await insertUser(client);
    await insertCompany(client);

}

main();