import org.apache.jena.rdf.model.InfModel;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import tests.TestInference;
import utils.Prints;

import java.io.IOException;

public class Main {

    public static void main(String[] args) {
        Model model;
        try {
            model = Ontology.generateModel(); // Create RDFs with project data
            InfModel inf = ModelFactory.createRDFSModel(model);
            TestInference.testInferenceValidity(inf);
            Prints.printInfRaw(inf);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        boolean runTest = false;
        if (runTest) {
            try {
                /// Examples
                Rdfs.rdfsExample1();
                Rdfs.rdfsExample2();
                Owl.owlExample();
                Wikidata.wikidataExample();
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
