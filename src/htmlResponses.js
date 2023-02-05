const fs = require('fs');

/* const index = fs.readFileSync(`${__dirname}/../client/client.html`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
}; */

const getPage = (request, response, path) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(fs.readFileSync(`${__dirname}/${path}`));
  response.end();
};

module.exports = {
  getPage,
};
