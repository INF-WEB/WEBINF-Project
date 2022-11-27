package utils;

import org.apache.jena.rdf.model.*;
import org.apache.jena.util.PrintUtil;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import static utils.Constants.DATA_LOC;

public class Prints {
    /**
     *
     * @param model RDFs model
     * @param s     The subject sought
     * @param p     The predicate sought
     * @param o     The value sought
     */
    public static void printStatements(Model model, Resource s, Property p, Resource o) {
        for (StmtIterator i = model.listStatements(s, p, o); i.hasNext();) {
            Statement stmt = i.nextStatement();
            System.out.println(" - " + PrintUtil.print(stmt));
        }
    }

    /**
     * Prints the raw RDF model being processed to the standard output stream.
     * @param inf Inference model of the RDF schema
     */
    public static void printInfRaw(InfModel inf) {
        inf.getRawModel().write(System.out);
    }

    /**
     * Prints a derivations model of the RDF model being processed to the standard output stream.
     * @param inf Inference model of the RDF schema
     */
    public static void printInfDeducted(InfModel inf) {
        inf.getDeductionsModel().write(System.out);
    }

    /**
     * Logs the produced schema to an output file.
     *
     * @param model    Produced schema
     * @param fileName Name of output file, without file location (e.g. "model.rdf")
     * @throws IOException If the file exists but is a directory rather than a
     *                     regular file, does not exist but cannot be created, or
     *                     cannot be opened for any other reason.
     */
    public static void printToFile(Model model, String fileName) throws IOException {
        File file = new File(DATA_LOC + "out/" + fileName);

        // Create new file if it does not exist
        file.createNewFile();

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
