<script>
import { tags } from './stores.js';
import Tags32 from './Tags3_2.svelte';

export let items;
export let key;

</script>

<div class="border">
  <div class="space0">ns:{key}</div>
  {#each Object.keys(items) as item}
    <div class="space1">{item}</div>
    <Tags32 items={items[item]} key={item}/>
  {/each}
</div>

<style>
.border {
  border-style: dotted;
}
.space0 {
  font-weight: bolder;
  color: darkblue;
}
.space1 {
  padding-left: 10px;
  font-weight: bolder;
  color: blueviolet
}
</style>
