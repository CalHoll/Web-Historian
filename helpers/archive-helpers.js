var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var htmlFetcher = require('../workers/htmlfetcher');

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
    // urlList = urlList.split('\n');
    // console.log(urlList);
    callback(urlList.toString().split('\n'));
  });
};

exports.isUrlInList = function(targetUrl, callback) {
  exports.readListOfUrls(function(array) {
    if (callback) {
      callback(_.contains(array, targetUrl));
    } else {
      return _.contains(array, targetUrl);
    }
  });
};

exports.addUrlToList = function(urlString, callback) {
  fs.appendFile(exports.paths.list, urlString + '\n', function (err) {
    callback();  // for test spec
  });
};

exports.isUrlArchived = function(urlString, callback) {
  fs.exists(exports.paths.archivedSites + '/' + urlString, function (foundIt) {
    foundIt ? callback(true) : callback(false);
  });
};

exports.downloadUrls = function(urlList) { // return paths.list?
  list = urlList.split('\n');
  list.forEach(function(url) {
    exports.isUrlArchived(url, function(exists) {
      if (!exists) {
        // run html fetcher.
        htmlFetcher.htmlFetcher(url);
      }
    });
  });
};
