var fs = require('fs');
var path = require('path');
var http = require('http');
var httpHelpers = require('./http-helpers');
var archive = require('../helpers/archive-helpers');
var url = require('url');

exports.handleRequest = function (req, res) {

  var statusCode = 200;

  if (req.method === 'GET') {
    // var parsedUrl = url.parse(req.url);
    // console.log('parsed url = ' + JSON.stringify(parsedUrl, null, 2));

    if (req.url === '/') {
      httpHelpers.serveAssets(res, 'index.html');
    } else {

      // check if in archives?
      if (archive.isUrlArchived(req.url)) {
        // serve assets

        // httpHelpers.serveAssets(res, req.url);
      } else if (archive.isUrlInList(req.url)) { // check if in list?
        res.writeHead(102, httpHelpers.headers);
        res.end('Working on it!');
      } else {      // if in neither, 404 error
        res.writeHead(404, httpHelpers.headers);
        res.end();
      }

    }
  } else if (req.method === 'POST') {

    // objective: put a url to a list
    if (archive.isUrlArchived(req.url)) {
      res.writeHead(200, headers);
      res.end('already done!');
    } else if (archive.isUrlInList(req.url)) {
      res.writeHead(200, headers);
      res.end('working on it!');
    } else {
      archive.addUrlToList(req.url);
      res.writeHead(200, headers);
      res.end('working on it!');
    }

    // request.on('data', function(message) {
    //   var message = JSON.parse(message);
    //   response.writeHead(201, headers);
    //   storage.push(message);
    // });
    // request.on('end', function() {

      // is the url already on the list?

        // if it is archived, return "already done!"

        // if it is on list, return a "working on it"

        // if it isn't, add it to the list, return "working on it!"
      // response.end("Working on it!");
    // });
  } else if (request.method === 'OPTIONS') {

  }
  // console.log(res);
  // httpHelpers.serveAssets(res, 'index.html');
};
