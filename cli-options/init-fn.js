const fs = require('fs-extra');
const fg = require('fast-glob');
const c = require('ansi-colors');
const stringify = require('./stringify');

function tldomain(fullpath) {
  let fp;
  if (fullpath.match(/^chrome/)) {
    return fullpath;
  }
  try {
    fp = fullpath.match(/^\w+:\/\/([\w.]+)/);
    if (fp) {
      fp = fp[1].
      split('.').reverse().
      slice(0,3).reverse().
      join('.');    
    } else {
      fp = '**tld-error**';  
      console.log(c.redBright(`>> Error tldomain ${fullpath}`));
    }
  } catch (error) {
    fp = '**tld-error**';
    console.log(c.redBright(`>> Error tldomain ${fullpath}`));
    console.log(error);
  }
  return fp.replace('www.', '');
}

function unstrictCSP({headers}) {
  let csp = headers['content-security-policy'];
  csp && (csp[0] = csp[0].replace(/'(strict)[^ ]+/g, ''));
  csp && (csp[0] = csp[0].replace(/default-src [^;]+;/, ''));
  return {headers}
}

function routeSet(routes, namespace, print=false) {
  mitm.routes[namespace] = routes;
  if (namespace==='default') {
    mitm.routes.default.mock = {
      ...mitm.routes.default.mock,
      ...global.mitm.__mock
    }
  }
  const msg = `>> ${namespace}\n${stringify(mitm.routes[namespace])}`;
  print && console.log(msg);
  return routes;
};

const load = function(path) {
  console.log('>> userroute', path);
  const rpath = require.resolve(path);
  if (require.cache[rpath]) {
    delete require.cache[rpath];
  }
  return require(path);
}

const loadJS = function(path, log) {
  const {clear} = global.mitm.fn;
  console.log(log);
  load(path);
  clear();
}

function clear() {
  const {clear:c} = global.mitm.argv;
  (c===true || c==='cache') && fs.remove(`${mitm.home}/cache`);
  (c===true || c==='log') && fs.remove(`${mitm.home}/log`);
}

function home(path) {
  const {platform, env: {HOME, HOMEPATH}} = process;
  const home = (platform === 'win32' ? HOMEPATH.replace(/\\/g, '/') : HOME);
  return path.replace('~', home);
}

const hello = function() {
  console.log('Hello from mimt-play');
};

const mock = function() {
  return {body: 'Hi there!'}
};

const resp = () => {};

module.exports = () => {
  global.mitm.fn.unstrictCSP = unstrictCSP;
  global.mitm.fn.stringify = stringify;
  global.mitm.fn.tldomain = tldomain;
  global.mitm.fn.routeSet = routeSet;
  global.mitm.fn.loadJS = loadJS;
  global.mitm.fn.clear = clear;
  global.mitm.fn.hello = hello;
  global.mitm.fn.home = home;
  global.mitm.fn.mock = mock;
  global.mitm.fn.resp = resp;
  global.mitm.fn.fg = fg;
  global.mitm.fn.fs = fs;
}
