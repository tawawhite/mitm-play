function filename(pathname, resp, nanoid) {
  const arr = pathname.split('/');
  
  let file = arr.pop();
  if (file==='') {
    file = '_';
  }
  let ext = '';
  let file2 = file.split('.');
  file2[0] = `${file2[0]}${nanoid}`;
  let ctype = resp.headers['content-type'];
  if (ctype) {
    ctype = ctype[0];
    if (file2.length===1) {
      if (ctype.indexOf('html')>-1) {
        ext = 'html';
      } else if (ctype.indexOf('css')>-1) {
        ext = 'css';
      } else if (ctype.indexOf('json')>-1) {
        ext = 'json';
      } else if (ctype.indexOf('script')>-1) {
        ext = 'js';
      }
    } else {
      ext = file2[1];
    }
    file2.push(ext);
  }
  
  arr.push(file2[0]);
  const fpath = arr.join('/');
  return {fpath, ext};
}

module.exports = (match, resp, stamp) => {
  const {home, session} = mitm;
  const {host,pathname} = match;
  return function(nanoid='') {
    const {fpath, ext} = filename(pathname, resp, nanoid);
    const fpath1 = `${home}/log/${session}/${host}/${stamp}/${fpath}.${ext}`;
    const fpath2 = `${home}/log/${session}/${host}/$/${stamp}/${fpath}.json`;
    return {fpath1, fpath2, ext};  
  }
}
