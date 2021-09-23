<script>
    import { onMount } from "svelte";
    import { createGame } from "../game";
  
    export let width = 800;
    export let height = 600; 
    export let bgcolor = '#3f3f74';
    export let debug = false;

    onMount( () => {createGame('game',width,height,bgcolor,debug) } )

</script>

<div id='game'></div>
  
  