import org.apache.jena.datatypes.xsd.XSDDatatype;
import org.apache.jena.ontology.ObjectProperty;
import org.apache.jena.rdf.model.*;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.VCARD;
import org.apache.jena.vocabulary.AS;
import org.apache.jena.vocabulary.XSD;

public class Main {
    private static Model model;
    private final static String WEB_DOMAIN = "https://testDomain/";

    public static void main(String[] args) {
        // create an empty Model
        model = ModelFactory.createDefaultModel();
        Resource john = createUser("John", "Smith", "johnsmith@mail.com", "Agoralaan 13 Diepenbeek", "https://johnsmiths");
        Resource rebecca = createUser("Rebecca", "Smith", "Rebeccasmith@mail.com", "Agoralaan 13 Diepenbeek", "https://johnsmiths");
        Resource company = createCompany("company.sowewhere@gmail.com", "companyName", "https://company.com", "Agoralaan Gebouw D, 3590 Diepenbeek");
        //addEmployeeToCompany(john, company);
        //addEmployeeToCompany(rebecca, company);
        //test1();
        //test2();
    }

    public static Resource createUser(  String firstName,
                                        String lastName,
                                        String email,
                                        String area,
                                        String webpage) {
        String userURI          = WEB_DOMAIN + firstName + lastName; //TODO: is not unique
        String fullName         = firstName + " " + lastName;

        Boolean lookingForWork  = true;

        // create an empty Model


        Resource johnSmith
                = model.createResource(userURI)
                .addProperty(VCARD.FN, fullName)
                .addProperty(VCARD.N,
                        model.createResource()
                                .addProperty(VCARD.Given, firstName)
                                .addProperty(VCARD.Family, lastName))
                .addProperty(VCARD.EMAIL, email)
                .addProperty(AS.url, webpage) //TODO: Syntax for url could be incorrect
                .addProperty(VCARD.ADR, area);
        //.addProperty(model.createProperty("https://"), lookingForWork); //TODO: looking for work as it's own URI perhaps
        model.write(System.out);

        System.out.println();

        return johnSmith;
    }

//    public static Resource createDiploma() {
//
//    }

    public static Resource createCompany(String email, String companyName, String companyWebsite, String companyHeadQuaters){
        String companyURI = WEB_DOMAIN + companyName;
        // make the company resource
        Resource company = model.createResource(companyURI)
                .addProperty(VCARD.EMAIL, email)
                .addProperty(VCARD.FN,companyName)
                .addProperty(VCARD.ADR, companyHeadQuaters) //TODO: Syntax for ADR could be incorrect
                .addProperty(AS.url, companyWebsite);

        model.write(System.out);
        return company;
    }

    //TODO: make this one work
    public static void addEmployeeToCompany(Resource employee, Resource company){
        //Creating a list of employees
        Property employeesProperty = model.createProperty(WEB_DOMAIN + "employees");
        Property companyEmployeesProperty = company.getModel().getProperty(employeesProperty.getURI());
        if (companyEmployeesProperty == null) {
            Bag employees = model.createBag();
            employees.add(employee);
            company.addProperty(employeesProperty, employees);
        } else {
            Bag companyEmployeesBag = (Bag) companyEmployeesProperty;
            companyEmployeesBag.add(employee);
        }

        model.write(System.out);
    }

    public static void test2() {
        // some definitions
        String personURI    = "http://somewhere/JohnSmith";
        String givenName    = "John";
        String familyName   = "Smith";
        String fullName     = givenName + " " + familyName;

        // create an empty Model
        Model model = ModelFactory.createDefaultModel();

// create the resource
//   and add the properties cascading style
        Resource johnSmith
                = model.createResource(personURI)
                .addProperty(VCARD.FN, fullName)
                .addProperty(VCARD.N,
                        model.createResource()
                                .addProperty(VCARD.Given, givenName)
                                .addProperty(VCARD.Family, familyName));

        // list the statements in the Model
        StmtIterator iter = model.listStatements();

        // print out the predicate, subject and object of each statement
        while (iter.hasNext()) {
            Statement stmt      = iter.nextStatement();  // get next statement
            Resource  subject   = stmt.getSubject();     // get the subject
            Property  predicate = stmt.getPredicate();   // get the predicate
            RDFNode   object    = stmt.getObject();      // get the object

            System.out.print(subject.toString());
            System.out.print(" " + predicate.toString() + " ");
            if (object instanceof Resource) {
                System.out.print(object.toString());
            } else {
                // object is a literal
                System.out.print(" \"" + object.toString() + "\"");
            }

            System.out.println(" .");
        }

        model.write(System.out);
    }

    public static void test1() {
        System.out.println("Viet - Jena Ontology & Inference API Demo");

        Model m = ModelFactory.createDefaultModel();
        String NS = "http://bibooki.com/test/";

        Resource viet = m.createResource(NS + "viet");
        Property studyAt = m.createProperty(NS + "studyAt");

        viet.addProperty(studyAt, "Konkuk Graduate University", XSDDatatype.XSDstring);
        m.write(System.out, "Turtle");
    }
}