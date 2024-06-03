/**
 * @author: @AngularClass
 */
const path = require('path');

// Helper functions
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src', 'main', 'app');
const MVN_BUILD = path.join(ROOT, 'target', 'classes', 'nuxeo.war', 'app');

function hasProcessFlag(flag) {
  return process.argv.join('').indexOf(flag) > -1;
}

function isWebpackDevServer() {
  return process.argv[1] && !! (/webpack-dev-server$/.exec(process.argv[1]));
}

function src() {
  const args = Array.prototype.splice.call(arguments, 0)
  return path.join.apply(this, [SRC].concat(args));
}

function root() {
  const args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [ROOT].concat(args));
}

function maven() {
  const args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [MVN_BUILD].concat(args));
}

function checkNodeImport(context, request, cb) {
  if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
    cb(null, 'commonjs ' + request); return;
  }
  cb();
}

exports.hasProcessFlag = hasProcessFlag;
exports.isWebpackDevServer = isWebpackDevServer;
exports.root = root;
exports.src = src;
exports.maven = maven;
exports.checkNodeImport = checkNodeImport;
