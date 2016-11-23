var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var htmlFetcher = require('../workers/htmlfetcher');
var request = require('request');  // https://www.npmjs.com/package/request

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {  // loop through the list?
  fs.readFile(exports.paths.list, function(err, urlList) {
    urlList = urlList.toString().split('\n');
    // console.log(urlList);
    if (callback) {
      callback(urlList);
    }
    // callback(urlList.toString().split('\n'));
  });
};

exports.isUrlInList = function(targetUrl, callback) {
  exports.readListOfUrls(function(urlList) {
    var found = _.any(urlList, function(site, i) {
      return site.match(targetUrl);
    });
    callback(found);
  });
    // if (callback) {
    //   callback(_.contains(urlList, targetUrl));
    // } else {
    //   return _.contains(urlList, targetUrl);
    // }
};

exports.addUrlToList = function(urlString, callback) {
  fs.appendFile(exports.paths.list, urlString + '\n', function (err) {
    callback();  // for test spec
  });
};

exports.isUrlArchived = function(urlString, callback) {
  var sitePath = path.join(exports.paths.archivedSites, urlString);
  fs.exists(sitePath, function (foundIt) {
    callback(foundIt);
  });
};

exports.downloadUrls = function(urlList) {
  // list = urlList.split('\n');
  urlList.forEach(function(url) {
    if (!url) { return; }
    request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url));
  });
};
