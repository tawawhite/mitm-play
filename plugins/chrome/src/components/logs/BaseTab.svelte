<script>
import { onMount } from 'svelte';
import { logstore } from './stores.js';
import { Tab } from 'svelma';

const minimap = {enabled: false};
const option = {
  contextmenu: false,
  readOnly: true,
  // model: null,
  minimap,
}

onMount(async () => {
  console.log($logstore)
  const element1 = window.document.getElementById('monaco1');
  const editor1 =  window.monaco.editor.create(element1, {
    value: $logstore.headers,
    language: 'json',
    ...option,
  });

  var ro1 = new ResizeObserver(entries => {
    const {width, height} = entries[0].contentRect
    editor1.layout({width, height})
  });
  ro1.observe(element1);

  const element2 = window.document.getElementById('monaco2');
  const editor2 =  window.monaco.editor.create(element2, {
    value: $logstore.response,
    language: $logstore.ext,
    ...option,
  });

  var ro2 = new ResizeObserver(entries => {
    const {width, height} = entries[0].contentRect
    editor2.layout({width, height})
  });
  ro2.observe(element2);

  const obj = JSON.parse($logstore.headers);
  if (obj.CSP) {
    const element3 = window.document.getElementById('monaco3');
    const editor3 =  window.monaco.editor.create(element3, {
      value: JSON.stringify(obj.CSP, null, 2),
      language: 'json',
      ...option,
    });

    var ro3 = new ResizeObserver(entries => {
      const {width, height} = entries[0].contentRect
      editor3.layout({width, height})
    });
    ro3.observe(element3);
  }
});
function isCSP() {
  const h = $logstore.respHeader;
  const csp = h['content-security-policy'] || h['content-security-policy-report-only'];
  return csp;
}
</script>

<Tab label="Headers">
  <div class="view-container">
    <div id="monaco1">
    </div>
  </div>
</Tab>
<Tab label="Response">
  <div class="view-container">
    <div id="monaco2">
    </div>
  </div>
</Tab>
{#if isCSP()}
  <Tab label="CSP">
    <div class="view-container">
      <div id="monaco3">
    </div>
  </Tab>
{/if} 

<style>
.view-container {
  position: relative;
  height: calc(100vh - 50px);
}
#monaco1,
#monaco2,
#monaco3 {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
</style>
