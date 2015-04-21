var os = require('os');
var path = require('path');
var exec = require('child_process').exec;
var Promise = require('bluebird');

// resolve path to apktool.jar
var APK_TOOL = path.resolve(__dirname, '../bin/apktool.jar');

/**
 * Decompiles the given .apk file and stores results in the target directory.
 * @param {String} source path to the .apk file
 * @param {String} target path to the directory to store results into
 * @return {Promise} resolving to the path of the decompiled directory
 * @static
 */
exports.decompile = function (source, target, callback) {
  var resolver;
  var cmd;

  // resolve relative path
  file = path.resolve(__dirname, file);

  // compile apktool command
  cmd = 'java -jar ' + APK_TOOL + ' decode --force --output=' + options.destination + ' ' + file;

  resolver = function (resolve, reject) {
    exec(cmd, function (err) {
      if (err) return reject(err);
      resolve(options.destination);
    });
  };

  return new Promise(resolver).nodeify(callback);
};
