import org.apache.jena.rdf.model.InfModel;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.rdf.model.Resource;
import org.apache.jena.reasoner.Reasoner;
import org.apache.jena.reasoner.ReasonerRegistry;
import org.apache.jena.riot.RDFDataMgr;
import org.apache.jena.vocabulary.RDF;

import java.io.IOException;

import static tests.TestInference.testInferenceValidity;
import static utils.Constants.DATA_LOC;
import static utils.Constants.EG;
import static utils.Prints.printStatements;
import static utils.Prints.printToFile;

public class Owl {
    /**
     * Example from
     * <a href=
     * "https://jena.apache.org/documentation/inference/index.html#OWLexamples">OWL
     * Example</a>
     *
     * @throws IOException If the file exists but is a directory rather than a
     *                     regular file, does not exist but cannot be created, or
     *                     cannot be opened for any other reason.
     */
    public static void owlExample() throws IOException {
        Model schema = RDFDataMgr.loadModel(DATA_LOC + "owlDemoSchema.rdf");
        Model data = RDFDataMgr.loadModel(DATA_LOC + "owlDemoData.rdf");

        Reasoner reasoner = ReasonerRegistry.getOWLReasoner();
        reasoner = reasoner.bindSchema(schema);
        InfModel infModel = ModelFactory.createInfModel(reasoner, data);

        // find out all we know about a specific instance
        Resource nForce = infModel.getResource(EG + "nForce");
        System.out.println("nForce *:");
        printStatements(infModel, nForce, null, null);

        /// instance recognition
        // Testing if an individual is an instance of a class expression.
        Resource gamingComputer = infModel.getResource(EG + "GamingComputer");
        Resource whiteBox = infModel.getResource(EG + "whiteBoxZX");
        if (infModel.contains(whiteBox, RDF.type, gamingComputer)) {
            System.out.println("White box recognized as gaming computer");
        } else {
            System.out.println("Failed to recognize white box correctly");
        }

        testInferenceValidity(infModel);

        printToFile(schema, "owlschema.rdf");
    }
}
