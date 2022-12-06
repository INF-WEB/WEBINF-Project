// const http = require('http');

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World 2');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

// var SparqlParser = require('sparqljs').Parser;
// var parser = new SparqlParser();
// var query = 'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>' +
//   'SELECT ?subject ?predicate ?object WHERE { ?subject ?predicate ?object } LIMIT 25';
// var parsedQuery = parser.parse(query);

// console.log(parsedQuery);

// fetch('http://localhost:3030/fu-what-i/sparql', {
//   method: 'POST',
//   headers: {
//     "Content-type": "application/sparql-query"
//   },
//   body: query
// })
//   .then(async function (response) {
//     const body = await response.text();
//     console.log(body);
//   });
//  .then(function(response) {
//      return response;
//  })
//  .then(function(data) {
//      console.log('Request succeeded with JSON response', data);
//  })
//  .catch(function(error) {
//      console.log('Request failed', error);
//  });

// (async () => {
//   const response = await fetch('http://localhost:3030/fu-what-i/sparql', 
//   {
//     method: 'POST',
//     headers: {
//       "Content-type": "application/sparql-query"
//     },
//     body: query
//   })
//   const body = await response.text();
//   console.log(body);
// })();


const Client = require('./node_modules/jena-tdb/ParsingClient');

async function main() {
  const client = new Client({
    bin: '/Users/matiesclaesen/Documents/WEBINF/apache-jena-4.6.1/bin',
    db: '/database-nodejs/database'
  })

  await client.endpoint.importFiles([require.resolve('1/triples.nt')])

  // get first result from graph
  const getResult = await client.query.select(`
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  SELECT * WHERE {
    ?sub ?pred ?obj .
  } LIMIT 20
  `)

  console.log("before delete");
  console.log(getResult)

  // insert
  // const update = await client.query.update(`
  // INSERT { <https://test>  } WHERE {}
  // `);

  // delete first result (connection between jef and john smith)
  const del = await client.query.update(`
  DELETE DATA
  {
    <https://testDomain/connection/JohnSmith-06a70033-4416-45c1-9fc3-6731035e71be;JefJansens-083917fe-a60d-4993-bfe4-5172222f835f> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> "https://testDomain/type/connection"
  }
  `);

  console.log("after delete");

  // get first result agian
  const getResult2 = await client.query.select(`
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  SELECT * WHERE {
    ?sub ?pred ?obj .
  } LIMIT 3
  `)

  console.log(getResult2);

  
}

main()
