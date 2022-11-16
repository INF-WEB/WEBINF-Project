public enum ConnectionStatus {
    Pending("pending"),
    Cancelled("cancelled"),
    Declined("declined"),
    Accepted("accepted");
    //EXTRA: Blocked,

    // Member to hold the name
    private final String string;

    // constructor to set the string
    ConnectionStatus (String name){string = name;}

    // the toString just returns the given name
    @Override
    public String toString() {
        return string;
    }
}

