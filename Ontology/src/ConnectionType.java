public enum ConnectionType {
    Friend("friend"),
    Acquaintance("acquaintance"),
    Coworker("coworker"),
    ExCoworker("excoworker");
    //TODO: Could are more

    // Member to hold the name
    private final String string;

    // constructor to set the string
    ConnectionType(String name) {
        string = name;
    }

    // the toString just returns the given name
    @Override
    public String toString() {
        return string;
    }
}