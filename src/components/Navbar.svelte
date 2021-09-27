<script>
import { each } from "svelte/internal";

    import EventDispatcher from "../utils/eventDispatcher";
    import NavButton from "./NavButton.svelte";
    import ParametersSetter from "./ParametersSetter.svelte";
    import { currentScene } from "./stores.js";

    function changeScene(newScene){
        EventDispatcher.getInstance().emit("changeScene",newScene)    
    }

    let scenes = [
        { key:"SeekScene", name:"Seek"},
        { key:"ArriveScene", name:"Arrive"},
        { key:"FleeScene", name:"Flee"},
        { key:"PursuitScene", name:"Pursuit"},
        { key:"EvadeScene", name:"Evade"},
        { key:"WanderScene", name:"Wander"},
        { key:"CollisionScene", name:"Collision Avoidance"},
        { key:"LeaderScene", name:"Follow leader"},     
        { key:"FlockingScene", name:"Flocking"}
    ]


    let current = "Select"

    $: changeScene($currentScene)
    $: if ($currentScene == ""){
        current = "Select"
    }
    else{
        let k = $currentScene
        current = scenes.find( ({key}) => key == k ).name
    }

</script>

<nav class="navbar navbar-expand-sm navbar-dark bg-dark fixed-top">
    <div class="container-fluid">
        
        <!-- Toggler/collapsibe Button -->
        <button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
  
        <!-- Navbar links -->
        <div class="navbar-collapse collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="stateDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Steering behaviour: {current}
                    </a>
                    <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="stateDropdown">
                        {#each scenes as scene}
                            <NavButton key={scene.key} name={scene.name}/>
                        {/each}                            
                    </ul>
                </li>
                <ParametersSetter/>                 
            </ul>
        </div>
    </div>
</nav>
