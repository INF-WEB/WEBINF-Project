public enum DiplomaType {
    PlaceHolder("general");
    //TODO: Could are more

    // Member to hold the name
    private final String string;

    // constructor to set the string
    DiplomaType(String name) {
        string = name;
    }

    // the toString just returns the given name
    @Override
    public String toString() {
        return string;
    }
}
