var os = require('os');
var path = require('path');
var Promise = require('bluebird');
var rimraf = Promise.promisify(require('rimraf'));
var osenv = require('osenv');

var dir;

if (os.platform() === 'darwin') {
  dir = path.join(osenv.home(), 'Library', 'apktool', 'framework');
} else {
  dir = path.join(osenv.home(), 'apktool', 'framework');
}

console.log('Removing existing framework files from ' + dir);
return rimraf(dir)
  .catch(console.warn);
