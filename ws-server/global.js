const WebSocket = require('ws');

module.exports = () => {
//ex: broadcast({data:"there"});
function broadcast({data,_all}) {
  const {logs} = global.mitm.routes._global_.config;
  const pages = [];
    const that = this;
    data = typeof(data)==='string' ? data : JSON.stringify(data);
    global.wsservers.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        if (_all || client !== that) {
          pages.push(client._page);
          client.send(data);
        }
      }
    });
    if (logs['ws-broadcast']) {
      console.log('broadcast', data, pages)
    }
  }
  
  //ex: emitpage({data:"there", regex: "window"});
  function emitpage({data,regex}) {
    const pages = [];
    data = typeof(data)==='string' ? data : JSON.stringify(data);
    global.wsservers.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN && client._page.match(regex)) {
        pages.push(client._page);
        client.send(data);
      }
    });
    console.log('emitpage', data, pages)
  }
  global.broadcast = broadcast;
  global.emitpage = emitpage;

  return {
      broadcast,
      emitpage,
  }  
}
