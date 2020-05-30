const c = require('ansi-colors');
const yargs = require('yargs-parser');
const uroute = require('../userroute');
const initfn = require('./init-fn');
const cliChg = require('./cli-chg');
const cliCmd = require('./cli-cmd');
const routes = require('./routes');

const {platform, env: {HOME, HOMEPATH}} = process;
const home = (platform === 'win32' ? HOMEPATH : HOME).replace(/\\/g, '/');

global.mitm = {
  argv: yargs(process.argv.slice(2)),
  data: {userroute: './**/*.js'},
  home: `${home}/.mitm-play`,
  port: 3000,
};

initfn();
cliChg();
routes();
cliCmd();

module.exports = () => {
  const {argv} = mitm;
  const package = require('../package.json')
  if (argv.help) {
    console.log(c.greenBright(
  `
  Usage: mitm-play <profl> [options]
  
  Options:
    -h --help     \t show this help
    -g --go       \t go to location
    -b --browser  \t browser: chromium/firefox/webkit
    -p --pristine \t pristine browser, not recommended to use
    -z --lazylog  \t debounce save after millsec last invoked
    -l --logurl   \t test route to log url & headers
    -r --route    \t set userscript folder of routes
    -c --clear    \t clear cache and/or logs
    -s --save     \t save as default <profl>
    --chromium    \t browser = chromium
    --firefox     \t browser = firefox
    --webkit      \t browser = webkit

  v${package.version}
`));
    process.exit();
  }
  console.log(c.greenBright(JSON.stringify(argv, null, 2)));
  console.log(c.green(`v${package.version}\n`));
  uroute();
}
//mitm-play zd --chromium='D:\Apps\chrome-gog\chrome.exe' -cspr='.'