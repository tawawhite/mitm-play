const {
  resp,
  routeSet,
} = global.mitm.fn;

const domain =  __dirname.split(/\\|\//).pop();

routes = {
  exclude: ['google'],
  cache: {
    '.*': {}
  },
  log: {
    '.js$': {} 
  },
  js: {
    'googleapis.com': {resp},
  }
} 

const ns = routeSet(routes, domain, true)
