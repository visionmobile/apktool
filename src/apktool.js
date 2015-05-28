var os = require('os');
var path = require('path');
var exec = require('child_process').exec;
var Promise = require('bluebird');
var _ = require('lodash');
var type = require('type-of');

// resolve path to apktool.jar
var apktool = path.resolve(__dirname, './bin/apktool.jar');

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

  if (!_.isString(source)) {
    return Promise.reject(new Error('Invalid source argument; expected string, received ' + type(source)))
      .nodeify(callback);
  }

  if (_.isFunction(target)) {
    callback = target;
    target = undefined;
  }

  if (_.isUndefined(target)) {
    target = path.join(os.tmpdir(), path.basename(source, '.apk'));
  }

  if (!_.isString(target)) {
    return Promise.reject(new Error('Invalid target argument; expected string, received ' + type(target)))
      .nodeify(callback);
  }

  // resolve relative paths
  source = path.resolve(source);
  target = path.resolve(target);

  // compile apktool command
  cmd = 'java -jar ' + apktool + ' decode --force -c --output=' + target + ' ' + source;

  resolver = function (resolve, reject) {
    exec(cmd, function (err) {
      if (err) return reject(err);
      resolve(target);
    });
  };

  return new Promise(resolver).nodeify(callback);
};
