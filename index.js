// module qui permet de créer et gérer des fichiers
const fs = require('fs');

// module qui permet de créer un serveur web
const http = require('http');

//module qui permet de gérer l'URL
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');

const laptopData = JSON.parse(json);

// il existe différente façon de créer un web server voici la plus simple
// contient une call back qui va être déclenchée chaque fois que quelqu'un accèdera au web serveur
const server = http.createServer((req, res) => {
  const pathName = url.parse(req.url, true).pathname;
  if (pathName === '/products' || pathName === '/') {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end('this is the products page');
  } else if (pathName === '/laptop') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    res.end('this is th laptop page');
  } else {
    res.writeHead(404, { 'Content-type': 'text/html' });
    res.end('URL was not found on the server');
  }
});

server.listen(1337, '127.0.0.1', () => {
  console.log('Listening for request now');
});
