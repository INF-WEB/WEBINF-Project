import org.apache.jena.base.Sys;
import org.apache.jena.datatypes.xsd.XSDDatatype;
import org.apache.jena.ontology.ObjectProperty;
import org.apache.jena.rdf.model.*;
import org.apache.jena.vocabulary.*;

import java.util.Date;
import java.util.List;

public class Main {
    private static Model model;
    private final static String WEB_DOMAIN = "https://testDomain/";
    private static Property jobTypeProperty;

    //TODO: add types to ≠ object types
    // f.e. nstype user voor een user resource
    public static void main(String[] args) {
        // create an empty Model
        model = ModelFactory.createDefaultModel();
        jobTypeProperty = model.createProperty(WEB_DOMAIN + "job-types"); //TODO: use a database of jobtypes from elsewhere
        Resource john = createUser("John", "Smith", "johnsmith@mail.com", "Agoralaan 13 Diepenbeek", "https://johnsmiths", false);
        Resource rebecca = createUser("Rebecca", "Smith", "Rebeccasmith@mail.com", "Agoralaan 13 Diepenbeek", "https://johnsmiths", true);
        createConnectionWith(john, rebecca, "Pending");
        createDiplomaFor(john, new Date(), "testjobtype", "Uhasselt");
        createProfessionalExperienceFor(john, "testjobtype", new Date(), new Date(), "this is a description");
        Resource company = createCompany("company.sowewhere@gmail.com", "companyName", "https://company.com", "Agoralaan Gebouw D, 3590 Diepenbeek");
        Resource job = createJobOffer(company, "jobName", "Agoralaan Gebouw D, 3590 Diepenbeek", "this is a description of the work experience", "testdiplomatype", "Maken webpagina (job description)", "pending", "ICT");
        addPotentialJob(john, job, false);
        //addEmployeeToCompany(john, company);
        //addEmployeeToCompany(rebecca, company);

        model.write(System.out);
    }

    public static Resource createUser(  String firstName,
                                        String lastName,
                                        String email,
                                        String area,
                                        String webpage,
                                        Boolean lookingForJob) {
        String userURI          = WEB_DOMAIN + firstName + lastName; //TODO: is not unique
        String fullName         = firstName + " " + lastName;

        // create an empty Model

        Property lookingForJobProperty = model.createProperty(userURI + "looking-for-job");

        Resource johnSmith
                = model.createResource(userURI)
                .addProperty(VCARD.FN, fullName)
                .addProperty(VCARD.N,
                        model.createResource()
                                .addProperty(VCARD.Given, firstName)
                                .addProperty(VCARD.Family, lastName))
                .addProperty(VCARD.EMAIL, email)
                .addProperty(AS.url, webpage) //TODO: Syntax for url could be incorrect
                .addProperty(VCARD.ADR, area)
                .addProperty(lookingForJobProperty, lookingForJob.toString());
        //model.write(System.out);

        System.out.println();

        return johnSmith;
    }

    public static Resource createDiplomaFor(Resource user, Date graduation, String jobType, String educationalInstitute) {
        Property diplomasProperty = model.createProperty(user.getURI() + "diplomas");
        Bag diplomas = model.createBag(); //TODO: add uri

        Resource diploma =
                model.createResource(user.getURI() + "diplomas/{diploma1}" )
                        .addProperty(DC.date, graduation.toString())
                        .addProperty(jobTypeProperty, jobType)
                        .addProperty(VCARD.ADR, educationalInstitute);
        diplomas.add(diploma);
        user.addProperty(diplomasProperty, diplomas);

        return user;
    }

    public static Resource createProfessionalExperienceFor(Resource user, String jobType, Date startDate, Date endDate, String description) {
        Property professionalExperienceProperty = model.createProperty(user.getURI() + "professional-experiences");
        Bag professionalExperiences = model.createBag(); //TODO: add uri

        Resource professionalExperience =
                model.createResource(user.getURI() + "professional-experiences/{professional-experience1}")
                        .addProperty(jobTypeProperty, jobType)
                        .addProperty(DCAT.startDate, startDate.toString())
                        .addProperty(DCAT.endDate, endDate.toString())
                        .addProperty(DC.description, description);

        professionalExperiences.add(professionalExperience);
        user.addProperty(professionalExperienceProperty, professionalExperiences);

        return user;
    }

    private static String getLastSubstring(String URI) {
        return URI.substring(URI.lastIndexOf("/")+1);
    }

    //TODO: make status an enum
    public static void createConnectionWith(Resource user1, Resource user2, String status) {
        String connectionURI = WEB_DOMAIN + "/connection/" + getLastSubstring(user1.getURI()) + ";" + getLastSubstring(user2.getURI());
        Property connection1Property = model.createProperty(connectionURI);
        Property connection2Property = model.createProperty(connectionURI);

        Property connectionStatusProperty = model.createProperty(connectionURI + "/status");


        Resource connection =
                model.createResource(connectionURI)
                        .addProperty(connectionStatusProperty, status);

        Bag connections1 = model.createBag(user1.getURI() + "/connections");
        Bag connections2 = model.createBag(user2.getURI() + "/connections");

        connections1.add(connection);
        connections2.add(connection);

        user1.addProperty(connection1Property, connections1);
        user2.addProperty(connection2Property, connections2);
    }

    public static void createCurrentJob() {

    }

    // TODO: else werkende krijgen
    public static void addPotentialJob(Resource user, Resource job, Boolean isAccepted){
        Property potentialJobsProperty = model.createProperty(user.getURI() + "/potential-jobs");
        Property potentialJobProperty = model.createProperty(user.getURI() + "/potential-job");
        Property jobProperty = user.getModel().getProperty(potentialJobsProperty.getURI());
        Bag potentialJobs = model.createBag(user.getURI() + "/potential-jobs");
        Resource blank = model.createResource();

        Property isAcceptedProperty = model.createProperty(user.getURI() + getLastSubstring(job.getURI()) + "/isAccepted");
        blank.addProperty(isAcceptedProperty, isAccepted.toString());
        blank.addProperty(potentialJobProperty, job);
        potentialJobs.add(blank);
        user.addProperty(jobProperty, potentialJobs);
        /*
        if (jobProperty == null) {
            Bag potentialJobs = model.createBag(user.getURI() + "/potential-jobs");
            potentialJobs.add(job);
            user.addProperty(jobProperty, potentialJobs);
        } else {
            Bag companyEmployeesBag = (Bag) jobProperty;
            companyEmployeesBag.add(job);
        }
         */
    }
    // Extra
    public static void addJobOffer(Resource user, Resource job){
        Property jobOfferProperty = model.createProperty(user.getURI() + "/job-offers");
        Property offerJobProperty = user.getModel().getProperty(jobOfferProperty.getURI());
        Bag jobOffers = model.createBag(user.getURI() + "/job-offers");
        jobOffers.add(job);
        user.addProperty(offerJobProperty, jobOffers);
    }

    public static Resource createCompany(String email, String companyName, String companyWebsite, String companyHeadQuaters){
        String companyURI = WEB_DOMAIN + companyName;
        // make the company resource
        Resource company = model.createResource(companyURI)
                .addProperty(VCARD.EMAIL, email)
                .addProperty(VCARD.FN,companyName)
                .addProperty(VCARD.ADR, companyHeadQuaters) //TODO: Syntax for ADR could be incorrect
                .addProperty(AS.url, companyWebsite);

        //model.write(System.out);
        return company;
    }

    public static Resource createJobOffer(Resource company, String jobName,String area, String workExperience, String diploma, String jobDescription, String status, String type){
        String uri = company.getURI() + "/job-offers";
        Property jobStatus = model.createProperty(uri + "/status");
        Resource job = model.createResource(uri + jobName)
                .addProperty(DC.title, jobName)
                .addProperty(VCARD.ADR, area)
                .addProperty(DC.description, workExperience)
                .addProperty(DC.description, diploma)
                .addProperty(DC.description, jobDescription)
                .addProperty(jobStatus, status)
                .addProperty(jobTypeProperty, type);
        Property jobOfferProperty = model.createProperty(company.getURI() + "/job-offers");
        Property companyEmployeesProperty = company.getModel().getProperty(jobOfferProperty.getURI());
            Bag jobs = model.createBag();
            jobs.add(job);
            company.addProperty(jobOfferProperty, jobs);
        company.addProperty(VCARD.N, job);
        return job;
    }

    //TODO: make this one work & add URI ta bag
    public static void addEmployeeToCompany(Resource employee, Resource company){
        //Creating a list of employees
        Property employeesProperty = model.createProperty(company.getURI() + "/employees");
        Property companyEmployeesProperty = company.getModel().getProperty(employeesProperty.getURI());
        if (companyEmployeesProperty == null) {
            Bag employees = model.createBag();
            employees.add(employee);
            company.addProperty(employeesProperty, employees);
        } else {
            Bag companyEmployeesBag = (Bag) companyEmployeesProperty;
            companyEmployeesBag.add(employee);
        }

        //model.write(System.out);
    }

    public static void addPotentialEmployees(Resource user, Resource job){
        Property potentialEmployeeProperty = model.createProperty(job.getURI() + "/potential-employees");
        Property potentialEmployeesProperty = user.getModel().getProperty(potentialEmployeeProperty.getURI());
        Bag potentialEmployees = model.createBag(user.getURI() + "/potential-jobs");
        potentialEmployees.add(user);
        user.addProperty(potentialEmployeesProperty, potentialEmployees);
    }
}