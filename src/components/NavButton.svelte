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
<li class="nav-item">
    <!-- svelte-ignore a11y-invalid-attribute -->
    <a class="nav-link active" href="#">{name}</a>
</li>
{:else}
<li class="nav-item">
    <!-- svelte-ignore a11y-invalid-attribute -->
    <a class="nav-link" href="#" on:click={ ()=> currentScene.set(key) } >
        {name}
    </a>
</li>
{/if}