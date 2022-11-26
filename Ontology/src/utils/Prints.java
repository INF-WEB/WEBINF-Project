package utils;

import org.apache.jena.rdf.model.*;
import org.apache.jena.util.PrintUtil;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import static utils.Constants.DATA_LOC;

public class Prints {
    public static void printStatements(Model m, Resource s, Property p, Resource o) {
        for (StmtIterator i = m.listStatements(s, p, o); i.hasNext();) {
            Statement stmt = i.nextStatement();
            System.out.println(" - " + PrintUtil.print(stmt));
        }
    }

    /**
     * Logs the produced schema to an output file.
     *
     * @param model    Produced schema
     * @param fileName Name of outout file, without file location
     * @throws IOException
     */
    public static void printToFile(Model model, String fileName) throws IOException {
        File file = new File(DATA_LOC + fileName);

        // creates the file
        file.createNewFile();

        // creates a FileWriter Object
        FileWriter writer = new FileWriter(file);

        try {
            model.write(writer, "RDF/XML-ABBREV");
        } finally {
            try {
                writer.close();
                System.out.println("\nFile: '" + fileName + "' made");
            } catch (IOException closeException) {
                closeException.printStackTrace();
            }
        }
    }
}
