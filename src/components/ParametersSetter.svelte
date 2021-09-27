<script>
    import { currentScene,alignmentFactor,cohesionFactor,separationFactor, seekFactor } from "./stores.js";
    import EventDispatcher from "../utils/eventDispatcher";
    
    let active = false

    let params = {}

    function changeParameters(data){
        EventDispatcher.getInstance().emit("setParameters",data)
        //console.log("Emmiting signal new parameters with ",data)
    }

    $: if ($currentScene == "FlockingScene"){
        active = true        
    }
    else {
        active = false        
    }
    $: changeParameters({
        "alignment":$alignmentFactor,
        "cohesion":$cohesionFactor,
        "separation":$separationFactor,
        "seek":$seekFactor
    })

</script>

    <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle {active? "": "disabled"}" href="#" id="parametersDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
           Parameters
        </a>
        <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="parametersDropdown">
            <li>
                <label for="rangeAlignment" class="dropdown-item form-label disabled">Alignment</label>
                <input  id="rangeAlignment" bind:value={$alignmentFactor} type="range" class="dropdown-item form-range"  min="0.1" max="3" step="0.01">
            </li>
            <!--<li><hr class="dropdown-divider"></li>-->
            <li>
                <label for="rangeCohesion" class="dropdown-item form-label disabled">Cohesion</label>
                <input  id="rangeCohesion" bind:value={$cohesionFactor} type="range" class="dropdown-item form-range"  min="0.1" max="3" step="0.01">
            </li>
            <li>
                <label for="rangeSeparation" class="dropdown-item form-label disabled">Separation</label>
                <input  id="rangeSeparation" bind:value={$separationFactor} type="range" class="dropdown-item form-range"  min=".1" max="3" step="0.01">
            </li>
            <li>
                <label for="rangeSeek" class="dropdown-item form-label disabled">Seek target</label>
                <input  id="rangeSeek" bind:value={$seekFactor} type="range" class="dropdown-item form-range"  min=".1" max="3" step="0.01">
            </li>
        </ul>
    </li>