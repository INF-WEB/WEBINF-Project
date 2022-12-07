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

example:
```
<vcard:Individual rdf:about="http://example.com/me/corky">
   <vcard:fn>Corky Crystal</vcard:fn>
   <vcard:nickname>Corks</vcard:nickname>
   <vcard:hasEmail rdf:resource="mailto:corky@example.com"/>
 </vcard:Individual>
```

## [Geo](https://www.w3.org/2003/01/geo/)
Representing lat(itude), long(itude) and other information about spatially-located things.

A Point has only one 'lat', only one 'long', and only one 'alt'; we could use W3C's Web Ontology Language (OWL) to express this. OWL allows us to note that these RDF properties are 'functional properties'.
[Source](https://www.w3.org/2003/01/geo/#discussion)

example:
```
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#">
  <geo:Point>
    <geo:lat>55.701</geo:lat>
    <geo:long>12.552</geo:long>
  </geo:Point>
</rdf:RDF>
```

## [GeoNames](http://www.geonames.org/ontology/documentation.html)
Add geospatial semantic information.

The Ontology for GeoNames is available in OWL: https://www.geonames.org/ontology/ontology_v3.3.rdf, [mappings](https://www.geonames.org/ontology/mappings_v3.01.rdf).

Has complete list of all countries with relevant information.

[See](https://www.geonames.org/export/) for GeoNames Data, it contains links to the:
- available web services
- support pages
- sources

example:
```
<rdf:RDF 
	xmlns:cc="http://creativecommons.org/ns#" 
	xmlns:dcterms="http://purl.org/dc/terms/" 
	xmlns:foaf="http://xmlns.com/foaf/0.1/" 
	xmlns:gn="https://www.geonames.org/ontology#" 
	xmlns:owl="http://www.w3.org/2002/07/owl#" 
	xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
	xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#" 
	xmlns:wgs84_pos="http://www.w3.org/2003/01/geo/wgs84_pos#">
<gn:Feature rdf:about="https://sws.geonames.org/3020251/">
  <rdfs:isDefinedBy rdf:resource="https://sws.geonames.org/3020251/about.rdf"/>
  <gn:name>Embrun</gn:name>
  <gn:alternateName xml:lang="oc">Ambrun</gn:alternateName>
  <gn:featureClass rdf:resource="https://www.geonames.org/ontology#P"/>
  <gn:featureCode rdf:resource="https://www.geonames.org/ontology#P.PPL"/>
    ...
</gn:Feature>
<foaf:Document rdf:about="https://sws.geonames.org/3020251/about.rdf">
  <foaf:primaryTopic rdf:about="https://sws.geonames.org/3020251/"/>
  <cc:license rdf:resource="https://creativecommons.org/licenses/by/3.0/"/>
  <cc:attributionURL rdf:resource="https://sws.geonames.org/3020251/"/>
  <cc:attributionName rdf:datatype="http://www.w3.org/2001/XMLSchema#string">GeoNames</cc:attributionName>
  <dcterms:created rdf:datatype="http://www.w3.org/2001/XMLSchema#date">2006-01-15</dcterms:created>
  <dcterms:modified rdf:datatype="http://www.w3.org/2001/XMLSchema#date">2010-04-19</dcterms:modified>
</foaf:Document>
</rdf:RDF>
```

## [The BIO Ontology](https://vocab.org/bio/)

Biographical information about people, both living and dead.
Finding out more about people and their backgrounds and has some cross-over into genealogical information.
Concerned with people, their relationships and the events in their lives.

Useful for events/relations between persons.

Good documentation.

example:
```
@prefix bio: <http://purl.org/vocab/bio/0.1/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .

_:henryviii
  a foaf:Person
  ; foaf:name "Henry VIII, King of England"
  ; bio:father _:henryvii
  ; bio:mother _:elizplantagenet
  ; bio:child _:child1, _:child2, _:child3, _:child4, _:child5, _:child6, _:child7, _:child8
  ; bio:birth _:birth
  ; bio:death _:death
  ; bio:event _:burial, _:accession, _:coronation, _:marriage1
            , _:marriage2, _:marriage3, _:marriage4, _:marriage5, _:marriage6
```

## Comparison with analysis
- _Cursive_: optional

| **Analysis**                 | **FOAF** ```foaf:```                                     | **vCard** ```vcard:```         | **Geo** ```geo:```              | **GeoNames** ```gn:```                                                                                    | **The BIO Ontology** ```bio:```             |
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

- FOAF: For almost everything.
- vCard: No, contains almost everything the same as FOAF, but documentation is bad.
- Geo: Only usable for coordinates.
- GeoNames: Can be used for locations. Home, work.
- BIO: Usable for personal relations. Making of, and attributes of a person are also available in FOAF. This can be useful if we would dive deeper in the personal relationships of an ```Agent```.
