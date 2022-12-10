# TODO

- [x] database functies testen
- [x] server genereerd 
- [x] ids gebruiken ipv namen
- [x] fix het windows
- [x] matching algorithm 
  - [x] jobtypes
  - [x] area
  - [x] companies
  - [x] diploma degree (add to job and user) "diplomaDegree: diplomaDegree"
- [x] mergen
- [x] delete / insert
- [ ] <s>jena eens tegoei nakijken</s>
- [ ] demonstration plan
- [ ] verslag


# Final Deadline
## Phase 2 
- [x] investigate the common linked data vocabularies
- [x] Design ontology
  - [ ] EXTRA: Add additional information (hobbies, language skills, competences) -> staan vermeld in projectopgave bij phase 2 opeens
- [x] Can you integrate your ontology with the WikiData entities? 
- [x] Perhaps you can bootstrap your ontology by loading relevant professions and skills from Wikidata ?
- [x] Matching algorithm
    **"using semantic web technologies"**


- # Mutable
  - ## CREATE
    - [x] user
    - [x] company
    - [x] job
    - [x] connection
    - [x] diploma
    - [x] professional experience 
  - ## SELECT
    - [x] *all connections?*
    - [x] *all diplomas?*
    - [x] user
      - [x] professional experiences bag
      - [x] diplomas bag
      - [x] connections bag
      - [x] jobs
    - [x] job
    - [x] professional experience
    - [x] diploma
    - [x] connection
    - [x] company
      - [x] employees bag
      - [x] potential employees bag
      - [x] jobs
  - ## DELETE
    - [x] user
    - [x] company
    - [x] job
    - [x] professional experience
    - [x] diploma
    - [x] connection 
  - ## UPDATE
    - user
      - [x] firstname
      - [x] lastname
      - [x] webpage
      - [x] looking for job
    - company
      - [x] name
      - [x] website
      - [x] headquaters
    - job
      - [x] area
      - [x] workexperience
      - [x] diploma
      - [x] jobdescription
      - [x] status
      - [x] type
    - diploma
      - [x] graduation
      - [x] field
      - [x] degree
      - [x] educational institute
    - professional experience
      - [x] start date
      - [x] end date
      - [x] description
    - connection
      - [x] status
      - [x] type
    - [x] potential job 
  - ## OPERATION
    - potential jobs
      - [x] match with job
    - jobs
      - [x] hire someone


# SECURITY:
## UPDATE
- [x] update diploma
- [x] update professional experience
- [x] update connection
- [o] update job
## DELETE
- [ ] delete diploma
- [ ] delete professional experience
- [ ] delete connection
- [ ] delete job

EXTRA:
- [ ] change bag index
- [ ] geen job hebben en toch zoeken voor job maar geen job meegeven
- [ ] als je meerdere jobs hebt bij een company, maar je verwijdert een job, dan zou je niet uit de employee bag gegooit mogen worden
- [ ] field, work experience, professional experience, ... niet gebruikt bij matching algoritme

## Phase 2 Reporting
1. Introduction and requirements.
2. Summary of chosen technologies and platforms.
3. Ontology.
4. Matching algorithm.
5. Implementation & API
6. Observations on your development.
7. Conclusions.