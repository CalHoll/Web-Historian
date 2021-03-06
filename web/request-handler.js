var fs = require('fs');
var path = require('path');
var http = require('http');
var httpHelpers = require('./http-helpers');
var archive = require('../helpers/archive-helpers');
var url = require('url');

exports.handleRequest = function (req, res) {
  var statusCode = 200;

  if (req.method === 'GET') {
    var parsedUrl = url.parse(req.url).pathname;
    // console.log('parsed url = ' + JSON.stringify(parsedUrl, null, 2));

    if (parsedUrl === '/') {
      parsedUrl = '/index.html';
    }
    httpHelpers.serveAssets(res, parsedUrl, function() {
      if (parsedUrl[0] === '/') { parsedUrl = parsedUrl.slice(1); }

      archive.isUrlInList(parsedUrl, function(found) {
        if (found) {
          // send loading page back
          res.writeHead(302, {Location: '/loading.html'});
          res.end();
        } else {
          // send error
          res.writeHead(404, httpHelpers.headers);
          res.end('404: Page not found');
        }
      });
    });
  } else if (req.method === 'POST') {

    var data = '';
    req.on('data', function(chunk) {
      data += chunk;
    });

    req.on('end', function() {
      var url = data.split('=')[1].replace('http://', '');

      archive.isUrlInList(url, function(found) {
        if (found) { // found site
          // check if site is on disk
          archive.isUrlArchived(url, function(exists) {
            if (exists) {
              res.writeHead(302, { Location: '/' + url });
              res.end();
            } else {
              // Redirect to loading.html
              res.writeHead(302, { Location: '/loading.html' });
              res.end();
            }
          });
        } else {
          archive.addUrlToList(url, function() {
            res.writeHead(302, { Location: '/loading.html' });
            res.end();
          });
        }
      });
    });
  } else {
    res.writeHead(404, { Location: '/loading.html' });
    res.end();
  }
};
