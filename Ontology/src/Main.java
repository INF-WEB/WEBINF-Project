import org.apache.jena.rdf.model.*;
import org.apache.jena.sparql.vocabulary.FOAF;
import org.apache.jena.vocabulary.*;

import java.io.FileWriter;
import java.io.IOException;
import java.sql.Connection;
import java.util.Date;
import java.util.UUID;

public class Main {
    private static Model model;
    private final static String WEB_DOMAIN = "https://testDomain/";
    private static Property jobTypeProperty;

    //TODO: add types to ≠ object types
    // f.e. nstype user voor een user resource
    public static void main(String[] args) throws IOException {
        // create an empty Model
        model = ModelFactory.createDefaultModel();
        jobTypeProperty = model.createProperty(WEB_DOMAIN + "job-types"); //TODO: use a database of jobtypes from elsewhere
        Resource john = createUser("John", "Smith", "johnsmith@mail.com", "Agoralaan 13 Diepenbeek", "https://johnsmiths", false);
        Resource rebecca = createUser("Rebecca", "Smith", "Rebeccasmith@mail.com", "Agoralaan 13 Diepenbeek", "https://johnsmiths", true);
        Resource jef = createUser("Jef", "Jansens", "Jefjansens@mail.com", "Agoralaan 11 Diepenbeek", "https://jefjansens", false);
        createConnectionWith(john, rebecca, ConnectionStatus.Pending, ConnectionType.Coworker);
        createConnectionWith(john, jef, ConnectionStatus.Accepted, ConnectionType.Friend);
        createDiplomaFor(john, new Date(), JobType.PlaceHolder, "Uhasselt");
        createProfessionalExperienceFor(john, new Date(2000, 1, 1), new Date(2001, 2, 1), "this is a description");
        Resource company = createCompany("company.sowewhere@gmail.com", "companyName", "https://company.com", "Agoralaan Gebouw D, 3590 Diepenbeek");
        Resource job = createJob(company, "jobName", "Agoralaan Gebouw D, 3590 Diepenbeek", "this is a description of the work experience", DiplomaType.PlaceHolder, "Maken webpagina (job description)", JobStatus.Hired, "ICT");
        addPotentialJob(john, job, false);
        addEmployeeToCompany(john, company);
        addEmployeeToCompany(rebecca, company);

        //model.write(System.out);
        String fileName = "trippels.nt";
        FileWriter out = new FileWriter( fileName );
        try {
            model.write( out, "N-TRIPLE" );
        }
        finally {
            try {
                out.close();
            }
            catch (IOException closeException) {
                // ignore
            }
        }
        //model.write(System.out, "N-TRIPLE");
    }

    public static Resource createUser(  String firstName,
                                        String lastName,
                                        String email,
                                        String area,
                                        String webpage,
                                        Boolean lookingForJob) {
        String userURI          = WEB_DOMAIN + firstName + lastName +"-"+ UUID.randomUUID(); // added unique numbers
        String fullName         = firstName + " " + lastName;

        Property lookingForJobProperty = model.createProperty(userURI + "/looking-for-job");

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
                .addProperty(RDF.type, WEB_DOMAIN + "type/user");

        System.out.println();

        return johnSmith;
    }

    public static Resource createDiplomaFor(Resource user, Date graduation, JobType jobType, String educationalInstitute) {
        Property diplomasProperty = model.createProperty(user.getURI() + "/diplomas");
        Bag diplomasBag = model.getBag(user.getURI() + "/diplomas");
        Resource diploma =
                model.createResource(WEB_DOMAIN + "diplomas/{diploma1}" +"-"+ UUID.randomUUID())
                        .addProperty(DC.date, graduation.toString())
                        .addProperty(jobTypeProperty, jobType.toString())
                        .addProperty(FOAF.based_near, educationalInstitute)
                        .addProperty(RDF.type, WEB_DOMAIN + "type/diploma");

        if(diplomasBag == null) {
            Bag diplomas = model.createBag(user.getURI() + "/diplomas");
            diplomas.add(diploma);
            user.addProperty(diplomasProperty, diplomas);
        }else{
            diplomasBag.add(diploma);
            user.addProperty(diplomasProperty, diplomasBag);
        }

        return user;
    }

    public static Resource createProfessionalExperienceFor(Resource job, Date startDate, Date endDate, String description) {
        Property professionalExperienceProperty = model.createProperty(job.getURI() + "/professional-experiences");
        Bag professionalExperiencesBag = model.getBag(job.getURI() + "/professional-experience");
        Resource professionalExperience =
                model.createResource(job.getURI() + "/professional-experiences/{professional-experience1}")
                        .addProperty(DCAT.startDate, startDate.toString())
                        .addProperty(DCAT.endDate, endDate.toString())
                        .addProperty(DC.description, description)
                        .addProperty(RDF.type, WEB_DOMAIN + "type/professional-experience");

        if(professionalExperiencesBag == null) {
            Bag professionalExperiences = model.createBag(job.getURI() + "/professional-experience");
            professionalExperiences.add(professionalExperience);
            job.addProperty(professionalExperienceProperty, professionalExperiences);
        }else{
            professionalExperiencesBag.add(professionalExperience);
            job.addProperty(professionalExperienceProperty, professionalExperiencesBag);
        }

        return job;
    }

    private static String getLastSubstring(String URI) {
        return URI.substring(URI.lastIndexOf("/")+1);
    }

    // TODO: add to bags
    public static void createConnectionWith(Resource user1, Resource user2, ConnectionStatus status, ConnectionType type) {
        String connectionURI = WEB_DOMAIN + "connection/" + getLastSubstring(user1.getURI()) + ";" + getLastSubstring(user2.getURI());
        Property connection1Property = model.createProperty(connectionURI);
        Property connection2Property = model.createProperty(connectionURI);

        Property connectionStatusProperty = model.createProperty(connectionURI + "/status");
        Property connectionTypeProperty = model.createProperty(connectionURI + "/type");

        Resource connection =
                model.createResource(connectionURI)
                        .addProperty(connectionStatusProperty, status.toString())
                        .addProperty(connectionTypeProperty, type.toString())
                        .addProperty(RDF.type, WEB_DOMAIN + "type/connection");;

        Bag connections1Bag = model.getBag(user1.getURI() + "/connections");
        if(connections1Bag == null){
            Bag connections1 = model.createBag(user1.getURI() + "/connections");
            connections1.add(connection);
            user1.addProperty(connection1Property, connections1);
        }else{
            connections1Bag.add(connection);
            user1.addProperty(connection1Property, connections1Bag);
        }

        Bag connections2Bag = model.getBag(user2.getURI() + "/connections");
        if(connections2Bag == null){
            Bag connections2 = model.createBag(user2.getURI() + "/connections");
            connections2.add(connection);
            user2.addProperty(connection2Property, connections2);
        }else{
            connections2Bag.add(connection);
            user2.addProperty(connection2Property, connections2Bag);
        }
    }

    public static void addPotentialJob(Resource user, Resource job, Boolean isAccepted){
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
        } else {
            blank.addProperty(isAcceptedProperty, isAccepted.toString());
            blank.addProperty(potentialJobProperty, job);
            potentialJobsBag.add(blank);
            user.addProperty(jobProperty, potentialJobsBag);
        }

    }

    public static void addJob(Resource user, Resource job){
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
    }

    public static Resource createCompany(String email, String companyName, String companyWebsite, String companyHeadQuaters){
        String companyURI = WEB_DOMAIN + companyName +"-"+ UUID.randomUUID();
        // make the company resource
        Resource company = model.createResource(companyURI)
                .addProperty(FOAF.mbox, email)
                .addProperty(VCARD.FN,companyName)
                .addProperty(FOAF.based_near, companyHeadQuaters) //TODO: Syntax for ADR could be incorrect
                .addProperty(FOAF.homepage, companyWebsite)
                .addProperty(RDF.type, WEB_DOMAIN + "type/company");

        //model.write(System.out);
        return company;
    }

    public static Resource createJob(Resource company, String jobName, String area, String workExperience, DiplomaType diploma, String jobDescription, JobStatus status, String type){
        String uri = company.getURI() + "/jobs";
        Property jobStatus = model.createProperty(uri + "/status");
        Property diplomaTypeProperty = model.createProperty(uri + "/diploma-type");
        Resource job = model.createResource(uri + jobName)
                .addProperty(DC.title, jobName)
                .addProperty(FOAF.based_near, area)
                .addProperty(DC.description, workExperience)
                .addProperty(diplomaTypeProperty, diploma.toString())
                .addProperty(DC.description, jobDescription)
                .addProperty(jobStatus, status.toString())
                .addProperty(jobTypeProperty, type)
                .addProperty(RDF.type, WEB_DOMAIN + "type/job");
        Property jobsProperty = model.createProperty(company.getURI() + "/jobs");
        Property companyEmployeesProperty = model.createProperty(company.getURI()); //?
        Bag jobsBag = model.getBag(company.getURI() + "/jobs");
        if(jobsBag == null) {
            Bag jobs = model.createBag(company.getURI() + "/jobs");
            jobs.add(job);
            company.addProperty(jobsProperty, jobs);
        }else{
            jobsBag.add(job);
            company.addProperty(jobsProperty, jobsBag);
        }
        Resource blank = model.createResource();
        company.addProperty(companyEmployeesProperty, job);
        return job;
    }

    public static void addEmployeeToCompany(Resource employee, Resource company){
        //Creating a list of employees
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

    }

    public static void addPotentialEmployees(Resource user, Resource job){
        String potentialEmployeesURI = job.getURI() + "/potential-employees";

        Property potentialEmployeeProperty = model.createProperty(potentialEmployeesURI);
        Property potentialEmployeesProperty = job.getModel().getProperty(potentialEmployeeProperty.getURI());
        Bag potentialEmployeesBag = model.getBag(potentialEmployeesURI);
        if(potentialEmployeesBag == null) {
            Bag potentialEmployees = model.createBag(user.getURI() + "/potential-jobs");
            potentialEmployees.add(user);
            job.addProperty(potentialEmployeesProperty, potentialEmployees);
        }else{
            potentialEmployeesBag.add(user);
            job.addProperty(potentialEmployeesProperty, potentialEmployeesBag);
        }
    }
}


// company -> job -> * potential employee
