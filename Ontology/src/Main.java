import java.io.IOException;

public class Main {

    public static void main(String[] args) {
        try {
            Ontology.generateModel(); // Create RDFs with project data

            /// Examples
            Rdfs.rdfs();
            Rdfs.rdfsExample();
            Owl.owl();
            Wikidata.wikidata();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }
}
