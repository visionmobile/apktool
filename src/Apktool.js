import os from 'os';
import path from 'path';
import {exec} from 'child_process';
import Promise from 'bluebird';
import _ from 'lodash';
import type from 'type-of';
import CustomError from 'customerror';

// resolve path to apktool.jar
const apktool = path.resolve(__dirname, '../bin/apktool.jar');

class Apktool {

  /**
   * Decompiles the given .apk file and stores results in the target directory.
   * @param {String} source path to the .apk file
   * @param {String} [target=os.tmpdir()] path to the directory to store results into
   * @param {Function} [callback] optional callback function
   * @return {Promise} resolving to the path of the decompiled directory
   * @static
   */
  static decompile(source, target, callback) {
    // validate arguments
    if (!_.isString(source)) {
      return Promise.reject(new CustomError(`Invalid source argument; expected string, received ${type(source)}`, 'InvalidArgument'))
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
      return Promise.reject(new CustomError(`Invalid target argument; expected string, received ${type(target)}`, 'InvalidArgument'))
        .nodeify(callback);
    }

    // resolve relative paths
    source = path.resolve(source);
    target = path.resolve(target);

    // compile apktool command
    const cmd = `java -jar ${apktool} decode --force -c --output=${target} ${source}`;

    // set promise resolver
    const resolver = (resolve, reject) => {
      exec(cmd, (err) => {
        if (err) return reject(err);
        resolve(target);
      });
    };

    return new Promise(resolver).nodeify(callback);
  }

}

export default Apktool;
