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
    db: '/Users/matiesclaesen/Documents/WEBINF/nodejs/database'
  })

  //await client.endpoint.importFiles([require.resolve('/Users/matiesclaesen/Documents/WEBINF/nodejs/triples.nt')])

  const result = await client.query.select(`
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  SELECT * WHERE {
    ?sub ?pred ?obj .
  } LIMIT 10
  `)

  console.log(result)

}

main()