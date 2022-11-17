# Ontology vocabularies

## [FOAF](http://xmlns.com/foaf/0.1/)
FOAF = Friend Of A Friend

The initial focus of FOAF has been on the description of people.

‘Friend of a Friend’ is a vocabulary that describes persons and organizations. It defines the terms that you can use to represent a user profile: name, picture, homepage…
([source](https://solidproject.org/developers/vocabularies/well-known/common))

### Categories
See FOAF Overview, above [Introduction](http://xmlns.com/foaf/0.1/#sec-intro).

Their main class is ```foaf:Agent```, this is a person, group, software or physical artifact.
It's the class of things that do stuff.
A subclass is ```foaf:Person```, ```foaf:Organization``` and ```foaf:Group```.

example:
```
<foaf:Person>
  <foaf:name>Dan Brickley</foaf:name>
  <foaf:mbox_sha1sum>241021fb0e6289f92815fc210f9e9137262c252e</foaf:mbox_sha1sum>
  <foaf:homepage rdf:resource="http://rdfweb.org/people/danbri/" />
  <foaf:img rdf:resource="http://rdfweb.org/people/danbri/mugshot/danbri-small.jpeg" />
</foaf:Person>
```

## [vCard](https://www.w3.org/TR/vcard-rdf/)
For describing People and Organizations.

[Difference between FOAF and vCard:](https://solidproject.org/developers/vocabularies/well-known/common#:~:text=vCard%20(vc)&text=Note%20that%20there%20is%20a,from%20applications%20using%20the%20other.)
"vCard is aligned with an RFC, while foaf is a little lighter"

The documentation of vCard is not great.

## [Geo](https://www.w3.org/2003/01/geo/)
Representing lat(itude), long(itude) and other information about spatially-located things.

A Point has only one 'lat', only one 'long', and only one 'alt'; we could use W3C's Web Ontology Language (OWL) to express this. OWL allows us to note that these RDF properties are 'functional properties'.
[Source](https://www.w3.org/2003/01/geo/#discussion)

## [GeoNames](http://www.geonames.org/ontology/documentation.html)
Add geospatial semantic information.

The Ontology for GeoNames is available in OWL: https://www.geonames.org/ontology/ontology_v3.3.rdf, [mappings](https://www.geonames.org/ontology/mappings_v3.01.rdf).

Has complete list of all countries with relevant information.

[See](https://www.geonames.org/export/) for GeoNames Data, it contains links to the:
- available web services
- support pages
- sources

## [The BIO Ontology](https://vocab.org/bio/)

Biographical information about people, both living and dead.
Finding out more about people and their backgrounds and has some cross-over into genealogical information.
Concerned with people, their relationships and the events in their lives.

Useful for events/relations between persons.

Good documentation.

## Comparison with analysis
- _Cursive_: optional

| **Analysis**                 | **FOAF** ```foaf:```                                     | **vCard** ```vcard:```         | **Geo** ```geo:```              | **GeoNames** ```:gn```                                                                                    | **The BIO Ontology** ```bio:```             |
|------------------------------|----------------------------------------------------------|--------------------------------|---------------------------------|-----------------------------------------------------------------------------------------------------------|---------------------------------------------|
| User                         | ```Person```                                             | ```Agent``` ```Individual```   |                                 |                                                                                                           | ```Agent```                                 |
| Name (front, (middle,) last) | ```name``` ```title```                                   | ```Name```                     |                                 |                                                                                                           |                                             |
| _Profile picture_            | ```img``` ```Image```                                    |                                |                                 |                                                                                                           |                                             |
| Email                        | ```mbox```                                               | ```Email```                    |                                 |                                                                                                           |                                             |
| Area                         | ```based_near```                                         | ```Address```                  | ```Point``` ```lat``` ```lon``` | ```Class``` ```Code``` ```GeonamesFeature``` ```Feature``` ```Map``` ```RDFData``` ```WikipediaArticle``` | ```Place```                                 |
| Current job(s)               |                                                          |                                |                                 |                                                                                                           |                                             |
| Web page                     | ```homepage```                                           |                                |                                 |                                                                                                           |                                             |
| Diploma(s)                   | ```Document```                                           |                                |                                 |                                                                                                           |                                             |
| Professional experience      |                                                          |                                |                                 |                                                                                                           |                                             |
| Looking for job              |                                                          |                                |                                 |                                                                                                           |                                             |
| Connection                   | ```knows```                                              |                                |                                 |                                                                                                           | ```Agent Relationship``` ```Relationship``` |
| Current Job                  |                                                          |                                |                                 |                                                                                                           |                                             |
| _Interests_                  | ```interest``` ```topic_interest```                      |                                |                                 |                                                                                                           |                                             |
| _Collection of agents_       | ```Group``` ```member``` ```membershipClass```           | ```Group```                    |                                 |                                                                                                           |                                             |
| Job Offer                    | ```Document```                                           |                                |                                 |                                                                                                           |                                             |
| Company                      | ```Organization``` ```logo```                            | ```Organization```             |                                 |                                                                                                           | ```Organization```                          |
| Headquarters                 | ```based_near```                                         |                                |                                 |                                                                                                           |                                             |
| Web page                     | ```homepage```                                           |                                |                                 |                                                                                                           |                                             |
| Email                        | ```mbox```                                               |                                |                                 |                                                                                                           |                                             |
| Employee(s)                  | ```Person```                                             |                                |                                 |                                                                                                           | ```Employment```                            |
| Company type                 | ```topic```                                              |                                |                                 |                                                                                                           |                                             |
| _EXTRA_                      | ```OnlineAccount``` ```holdsAccount``` ```accountName``` | ```Colleague``` ```Coworker``` |                                 |                                                                                                           | ```Birth Event``` ```Date``` ```Event```    |

## Usability
