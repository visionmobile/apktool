Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _typeOf = require('type-of');

var _typeOf2 = _interopRequireDefault(_typeOf);

var _customerror = require('customerror');

var _customerror2 = _interopRequireDefault(_customerror);

// resolve path to apktool.jar
var apktool = _path2['default'].resolve(__dirname, '../bin/apktool.jar');

var Apktool = (function () {
  function Apktool() {
    _classCallCheck(this, Apktool);
  }

  _createClass(Apktool, null, [{
    key: 'decompile',

    /**
     * Decompiles the given .apk file and stores results in the target directory.
     * @param {String} source path to the .apk file
     * @param {String} [target=os.tmpdir()] path to the directory to store results into
     * @param {Function} [callback] optional callback function
     * @return {Promise} resolving to the path of the decompiled directory
     * @static
     */
    value: function decompile(source, target, callback) {
      // validate arguments
      if (!_lodash2['default'].isString(source)) {
        return _bluebird2['default'].reject(new _customerror2['default']('Invalid source argument; expected string, received ' + (0, _typeOf2['default'])(source), 'InvalidArgument')).nodeify(callback);
      }

      if (_lodash2['default'].isFunction(target)) {
        callback = target;
        target = undefined;
      }

      if (_lodash2['default'].isUndefined(target)) {
        target = _path2['default'].join(_os2['default'].tmpdir(), _path2['default'].basename(source, '.apk'));
      }

      if (!_lodash2['default'].isString(target)) {
        return _bluebird2['default'].reject(new _customerror2['default']('Invalid target argument; expected string, received ' + (0, _typeOf2['default'])(target), 'InvalidArgument')).nodeify(callback);
      }

      // resolve relative paths
      source = _path2['default'].resolve(source);
      target = _path2['default'].resolve(target);

      // compile apktool command
      var cmd = 'java -jar ' + apktool + ' decode --force -c --output=' + target + ' ' + source;

      // set promise resolver
      var resolver = function resolver(resolve, reject) {
        (0, _child_process.exec)(cmd, function (err) {
          if (err) return reject(err);
          resolve(target);
        });
      };

      return new _bluebird2['default'](resolver).nodeify(callback);
    }
  }]);

  return Apktool;
})();

exports['default'] = Apktool;
module.exports = exports['default'];