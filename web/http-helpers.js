var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var Promise = require('bluebird');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {

  var encoding = {encoding: 'utf8'};
  fs.readFile(archive.paths.siteAssets + asset, encoding, function (err, html) {
    if (err) {
      fs.readFile( archive.paths.archivedSites + asset, encoding, function(err, data) {
        if (err) {
          // file doesn't exist in archive!
          // callback ? callback() : exports.send404(res);
          callback ? callback() : res.writeHead(404, exports.headers);
          response.end('404: Page not found');
        } else {
          // exports.sendResponse(res, data);
          res.writeHead(200, exports.headers);
          res.end(data);
        }
      });
    } else {
      res.writeHead(200, exports.headers);
      res.end(html);
    }
  });
};

// exports.sendResponse = function(response, obj, status) {
//   status = status || 200;
//   response.writeHead(status, exports.headers);
//   response.end(obj);
// };

exports.collectData = function(request, callback) {
  var data = '';
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on('end', function() {
    callback(data);
  });
};
