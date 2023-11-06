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
  console.log(pathName);
  const id = url.parse(req.url, true).query.id;

  //PRODUCTS OVERVIEW
  if (pathName === '/products' || pathName === '/') {
    res.writeHead(200, { 'content-type': 'text/html' });
    // res.end('this is the products page');
    fs.readFile(
      `${__dirname}/templates/template-overview.html`,
      'utf-8',
      (err, data) => {
        let overviewOutput = data;
        fs.readFile(
          `${__dirname}/templates/template-card.html`,
          'utf-8',
          (err, data) => {
            const cardsOutput = laptopData
              .map((el) => {
                return replaceTemplate(data, el);
              })
              .join('');
            overviewOutput = overviewOutput.replace(`{%CARDS%}`, cardsOutput);
            res.end(overviewOutput);
          }
        );
      }
    );
  }

  //LAPTOP DETAIL
  else if (pathName === '/laptop' && id < laptopData.length) {
    res.writeHead(200, { 'Content-type': 'text/html' });
    // res.end(`this is the laptop page for the laptop ${id}`);
    fs.readFile(
      `${__dirname}/templates/template-laptop.html`,
      'utf-8',
      (err, data) => {
        const laptop = laptopData[id];
        const output = replaceTemplate(data, laptop);
        res.end(output);
      }
    );
  }

  //IMAGES
  else if (/\.(jpg|jpeg|png|gif)$/i.test(pathName)) {
    fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
      res.writeHead(200, { 'Content-type': 'image/jpg' });
      res.end(data);
    });
  }

  // URL NOT FOUND
  else {
    res.writeHead(404, { 'Content-type': 'text/html' });
    res.end('URL was not found on the server');
  }
});

server.listen(1337, '127.0.0.1', () => {
  console.log('Listening for request now');
});

function replaceTemplate(originalHtml, laptop) {
  let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
  output = output.replace(/{%IMAGE%}/g, laptop.image);
  output = output.replace(/{%PRICE%}/g, laptop.price);
  output = output.replace(/{%SCREEN%}/g, laptop.screen);
  output = output.replace(/{%CPU%}/g, laptop.cpu);
  output = output.replace(/{%STORAGE%}/g, laptop.storage);
  output = output.replace(/{%RAM%}/g, laptop.ram);
  output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
  output = output.replace(/{%ID%}/g, laptop.id);
  return output;
}
