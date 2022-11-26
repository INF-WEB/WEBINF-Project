package tests;

import org.apache.jena.rdf.model.InfModel;
import org.apache.jena.reasoner.ValidityReport;

import java.util.Iterator;

public class TestInference {
    /**
     * To test a data set for inconsistencies and list any problems.
     *
     * @param inf The schema to check
     */
    public static void testInferenceValidity(InfModel inf) {
        ValidityReport validity = inf.validate();
        if (validity.isValid()) {
            System.out.println("\nOK");
        } else {
            System.out.println("\nConflicts");
            for (Iterator<ValidityReport.Report> i = validity.getReports(); i.hasNext();) {
                System.out.println(" - " + i.next());
            }
        }
    }
}
