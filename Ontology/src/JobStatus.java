public enum JobStatus {
    Pending("pending"),
    Cancelled("cancelled"),
    Hired("hired"),
    Retired("retired"),
    Fired("fired"),
    OnLeave("onleave");
    //TODO: could add more

    // Member to hold the name
    private final String string;

    // constructor to set the string
    JobStatus(String name) {
        string = name;
    }

    // the toString just returns the given name
    @Override
    public String toString() {
        return string;
    }
}