import os from 'os';
import path from 'path';
import Promise from 'bluebird';
import rimraf from 'rimraf';
import osenv from 'osenv';

const rimrafAsync = Promise.promisify(rimraf);

function getDir() {
  if (os.platform() === 'darwin') { // osx
    return path.join(osenv.home(), 'Library', 'apktool', 'framework');
  }

  return path.join(osenv.home(), 'apktool', 'framework');
}

function init() {
  const dir = getDir();

  console.log(`Removing existing framework files from ${dir}`);
  return rimrafAsync(dir).catch(console.warn);
}

init(); // run immediately
