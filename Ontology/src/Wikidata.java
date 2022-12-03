import org.apache.jena.query.*;
import org.apache.jena.rdf.model.Model;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.sparql.exec.QueryExecDatasetBuilder;

import utils.Prints;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static utils.Constants.DATA_LOC;

public class Wikidata {
    /**
     * Reads and returns the SPARQL query from given file.
     *
     * @param filename Filename containing SPARQL query
     * @return SPARQL query as string
     * @throws IOException If an I/O error occurs.
     */
    private static String readQueryString(String filename) throws IOException {
        DataInputStream dis = new DataInputStream(new FileInputStream(DATA_LOC + filename));

        byte[] dataInBytes = new byte[dis.available()];
        dis.readFully(dataInBytes);
        dis.close();

        return new String(dataInBytes, 0, dataInBytes.length);
    }

    /**
     * Example from
     * <a href=
     * "https://www.youtube.com/watch?v=q3T1T51cH3A&ab_channel=MarcLieber">Wikidata
     * on Apache Jena and Fuseki</a>
     */
    public static void wikidataExample() {
        String filename = "wikidata_academicDegree_en.rq";
        String queryString = "";
        try {
            queryString = readQueryString(filename);
        } catch (Exception ex) {
            ex.printStackTrace();
        }

//        System.out.println(queryString);

        Query query = QueryFactory.create(queryString);

        // Local execution which uses SERVICE for remote access.
        QueryExecDatasetBuilder.create().context(null);

        String serviceURI = "https://query.wikidata.org/sparql";
        try (QueryExecution qExec = QueryExecutionFactory.create(query, ModelFactory.createDefaultModel())) {
            Map<String, Map<String, List<String>>> serviceParams = new HashMap<>();
            Map<String, List<String>> params = new HashMap<>();
            List<String> values = new ArrayList<>();
            values.add("2000");
            params.put("timeout", values);
            serviceParams.put(serviceURI, params);
            qExec.getContext().set(ARQ.serviceParams, serviceParams);

            ResultSet rs = qExec.execSelect();

            Prints.printWikidataToFileAsJSON(rs, filename);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


}
