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

## [Geo](https://www.w3.org/2003/01/geo/)


## [GeoNames](http://www.geonames.org/ontology/documentation.html)


## [The BIO Ontology](https://vocab.org/bio/)

## Comparison with analysis
- _Cursive_: optional

### FOAF

#### User ```foaf:Person```
- Name (front, (middle,) last) ```foaf:name``` ```foaf:title```
- _Profile picture_ ```foaf:img``` ```foaf:Image```
- Email ```foaf:mbox```
- Area ```foaf:based_near```
- Current job(s)
- Web page ```foaf:homepage```
- Diploma(s) ```foaf:Document```
- Professional experience
- Looking for job
- Connection ```foaf:knows```
- Current Job
- _Interests_ ```foaf:interest``` ```foaf:topic_interest```
- ```foaf:OnlineAccount``` ```foaf:holdsAccount``` ```foaf:accountName```
- _Collection of agents_ ```foaf:Group``` ```foaf:member``` ```foaf:membershipClass```

#### Job Offer ```foaf:Document```

#### Company ```foaf:Organization``` ```foaf:logo```
- Headquarters ```foaf:based_near```
- Web page ```foaf:homepage```
- Email ```foaf:mbox```
- Employee(s) ```foaf:Person```
- Company type ```foaf:topic```

### vCard

#### User
- Name (front, (middle,) last)
- _Profile picture_
- Email
- Area ```vcard:Adress```
- Current job(s)
- Web page
- Diploma(s)
- Professional experience
- Looking for job
- Connection
- Current Job
- _Interests_
- _Collection of agents_

#### Job Offer

#### Company
- Headquarters ```vcard:Adress```
- Web page
- Email
- Employee(s)
- Company type