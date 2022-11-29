const { v4: uuidv4 } = require("./node_modules/uuid");
const DataFactory = require("./node_modules/rdf");
const Client = require('./node_modules/jena-tdb/ParsingClient');


export class database {

    static readonly WEB_DOMAIN: string = "https://testDomain/";
    private rdf;
    static vCard: any;
    static foaf: any;
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
        const blankNode2 = new BlankNode();
        
        let nameTriple = new this.rdf.Triple(
            namedNode,
            database.vCard('N'),
            blankNodeName
        );
        
        let firstNameTriple = new this.rdf.Triple(
            blankNodeName,
            database.vCard('given-name'),
            new Literal(firstName)
        )

        let lastNameTriple = new this.rdf.Triple(
            blankNodeName,
            database.vCard('family-name'),
            new Literal(lastName)
        )

        let emailTriple = new this.rdf.Triple(
            namedNode,
            database.foaf('mbox'),
            new Literal(email)
        )

        let webpageTriple = new this.rdf.Triple(
            namedNode,
            database.foaf('homepage'),
            new Literal(webpage)
        )

        let areaTriple = new this.rdf.Triple(
            namedNode,
            database.foaf('based_near'),
            new Literal(area)
        )

        let lookingForJobTriple = new this.rdf.Triple(
            namedNode,
            this.rdf.rdfsns(userURI + "/looking-for-job"),
            new Literal(String(lookingForJob), this.rdf.xsdns("boolean"))
        )

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
        
        //`+ lookingForJobTriple.toNT() + `;
        return userURI;
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
        /*
        Resource company = model.createResource(companyURI)
                  .addProperty(FOAF.mbox, email)
                  .addProperty(VCARD.FN,companyName)
                  .addProperty(FOAF.based_near, companyHeadQuaters) //TODO: Syntax for ADR could be incorrect
                  .addProperty(FOAF.homepage, companyWebsite)
                  .addProperty(RDF.type, WEB_DOMAIN + "type/company");
        */
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
    }
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