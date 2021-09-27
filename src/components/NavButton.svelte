<script>

    import { currentScene } from "./stores.js"

    export let key
    export let name

    let active = false

    $:if ($currentScene == key) {
        console.log("currentScene = "+$currentScene, " | key = "+key)
        active = true
    }
    else {
        active = false
    }

</script>

{#if (active)}
<li><a class="dropdown-item active" href="#">{name}</a></li>
{:else}
<li><a class="dropdown-item" href="#" on:click={ ()=> currentScene.set(key)}>{name}</a></li>
{/if}

