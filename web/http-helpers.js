var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {

  fs.readFile(archive.paths.siteAssets + '/' + asset, function (err, html) {
    if (err) {
      callback ? callback() : res.writeHead(404, exports.headers);
    }
    res.writeHead(200, exports.headers);
    // console.log("INSIDE SERVEASSETS, html content = " + html);
    // res.write(html);
    // console.log(res);
    res.end(html.toString());
  });
};
