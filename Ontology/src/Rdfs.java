import org.apache.jena.rdf.model.*;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.vocabulary.RDF;
import org.apache.jena.vocabulary.RDFS;

import java.io.IOException;

import static tests.TestInference.testInferenceValidity;
import static utils.Constants.DATA_LOC;
import static utils.Constants.EG;
import static utils.Prints.printStatements;
import static utils.Prints.printToFile;

public class Rdfs {
    /**
     * Example from
     * https://jena.apache.org/documentation/inference/index.html#RDFSexamples
     *
     * @throws IOException
     */
    public static void rdfsExample() throws IOException {
        Model schema = RDFDataMgr.loadModel(DATA_LOC + "rdfsDemoSchema.rdf");
        Model data = RDFDataMgr.loadModel(DATA_LOC + "rdfsDemoData.rdf");
        InfModel infmodel = ModelFactory.createRDFSModel(schema, data);

        Resource colin = infmodel.getResource(EG + "colin");
        System.out.println("colin has types:");
        printStatements(infmodel, colin, RDF.type, null);

        Resource Person = infmodel.getResource(EG + "Person");
        System.out.println("\nPerson has types:");
        printStatements(infmodel, Person, RDF.type, null);

        testInferenceValidity(infmodel);

        printToFile(schema, "rdfsExample.rdf");
    }

    /**
     * Example from
     * https://jena.apache.org/documentation/inference/index.html#generalExamples
     *
     * @throws IOException
     */
    public static void rdfs() throws IOException {
        /**
         * Create a Jena model containing the statements that some property "p" is a
         * subproperty of another property "q" and that we have a resource "a" with
         * value "foo" for "p".
         */
        String NS = "urn:x-hp-jena:eg/";

        // Build a trivial example data set
        Model model = ModelFactory.createDefaultModel();
        Property p = model.createProperty(NS, "p");
        Property q = model.createProperty(NS, "q");

        model.add(p, RDFS.subPropertyOf, q);
        model.createResource(NS + "a").addProperty(p, "foo");

        // Create an inference model which performs RDFS inference over this data
        InfModel inf = ModelFactory.createRDFSModel(model); // [1]

        // Check the resulting model
        Resource a = inf.getResource(NS + "a");
        System.out.println("Statement: " + a.getProperty(q));

        testInferenceValidity(inf);

        model.write(System.out);
        // Access raw data
        inf.getRawModel().write(System.out);
        // Access decuted statements
        inf.getDeductionsModel().write(System.out);

        printToFile(model, "rdfschema.rdf");
    }
}
