<script>
    import { onMount } from "svelte";
    import { createGame } from "../game";
  
    export let width = 800;
    export let height = 600; 
    export let bgcolor = '#001122';
    export let debug = false;

    export let game;

    onMount( () => { game = createGame('game-container',width,height,bgcolor,debug) } )

</script>

<div id='game-container'></div>
  
  