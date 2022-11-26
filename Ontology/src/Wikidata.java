import org.apache.jena.query.*;
import org.apache.jena.rdf.model.ModelFactory;
import org.apache.jena.sparql.exec.QueryExecDatasetBuilder;

import java.io.DataInputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
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
     * @throws IOException
     */
    private static String readQueryString(String filename) throws IOException {
        DataInputStream dis = new DataInputStream(new FileInputStream(DATA_LOC + filename));

        byte[] datainBytes = new byte[dis.available()];
        dis.readFully(datainBytes);
        dis.close();

        String queryString = new String(datainBytes, 0, datainBytes.length);

        return queryString;
    }

    /**
     * Example from
     * https://www.youtube.com/watch?v=q3T1T51cH3A&ab_channel=MarcLieber
     *
     * @throws FileNotFoundException
     */
    public static void wikidata() throws FileNotFoundException {
        String queryString = "";
        try {
            queryString = readQueryString("wikidata_profession.rq");
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        System.out.println(queryString);
        Query query = QueryFactory.create(queryString);

        // Local execution which uses SERVICE for remote access.
        QueryExecDatasetBuilder.create().context(null);

        String serviceURI = "https://query.wikidata.org/sparql";
        try (QueryExecution qexec = QueryExecutionFactory.create(query, ModelFactory.createDefaultModel())) {
            Map<String, Map<String, List<String>>> serviceParams = new HashMap<>();
            Map<String, List<String>> params = new HashMap<>();
            List<String> values = new ArrayList<>();
            values.add("2000");
            params.put("timeout", values);
            serviceParams.put(serviceURI, params);
            qexec.getContext().set(ARQ.serviceParams, serviceParams);

            ResultSet rs = qexec.execSelect();
            ResultSetFormatter.out(System.out, rs, query);
        }
    }
}
