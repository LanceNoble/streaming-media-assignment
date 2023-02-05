const fs = require('fs');
const path = require('path');

const getMedia = (request, response, relativePath, contentType) => {
  const file = path.resolve(__dirname, relativePath);
  fs.stat(file, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        response.writeHead(404);
      }
      return response.end(err);
    }

    console.log(request.headers);

    // destructuring assignment
    let { range } = request.headers;

    if (!range) {
      range = 'bytes=0-';
    }

    // replace regular expression (regex) with empty string
    const positions = range.replace(/bytes=/, '').split('-');

    let start = parseInt(positions[0], 10);
    const total = stats.size;

    // ternary operator
    // why do we subtract 1 from total?
    const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

    if (start > end) {
      start = end - 1;
    }

    // why do we add 1?
    const chunksize = (end - start) + 1;

    // why don't we do response.write()?
    response.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': contentType,
    });

    const stream = fs.createReadStream(file, { start, end });
    stream.on('open', () => {
      stream.pipe(response);
    });
    stream.on('error', (streamErr) => {
      response.end(streamErr);
    });

    // why do we return a stream?
    return stream;
  });
};

module.exports.getMedia = getMedia;
