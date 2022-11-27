import org.apache.jena.rdf.model.Model;

import java.io.IOException;

public class Main {

    public static void main(String[] args) {
        Model model;
        try {
            model = Ontology.generateModel(); // Create RDFs with project data

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
