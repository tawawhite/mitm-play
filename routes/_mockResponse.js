const c = require('ansi-colors');
const _match = require('./match');
const inject = require('./inject');
const {matched,searchFN} = _match;
const {source} = inject;

const mock = () => {
  return {
    status: 200,
    headers: {
      'content-type': 'text/plain',
    },
    body: ''
  }
};

function mockResponse({reqs, route}) {
  const search = searchFN('mock', reqs);
  const match = matched(search, reqs);
  if (match) {
    if (!match.url.match('/mitm-play/websocket')) {
      console.log(c.cyanBright(match.log));
    }
    let resp = mock();
    if (typeof(match.route)==='string') {
      resp.body = match.route;
    } else {          
      if (match.route.response || match.route.js) {
        if (match.route.response) {
          const resp2 = match.route.response(resp);
          resp2 && (resp = {...resp, ...resp2});
        }
        if (match.route.js) {
          resp.body = source(resp.body, match.route.js);
          resp.headers['content-type'] = 'application/javascript';
        }
      } else {
        resp.body = 'Hello mock! - mitm-play';
      }
    }
    route.fulfill(resp);
    return true;
  }
}

module.exports = mockResponse;
//https://github.com/microsoft/playwright/blob/master/docs/api.md#routefulfillresponse