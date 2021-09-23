<script>
    import EventDispatcher from "../utils/eventDispatcher";
    import NavButton from "./NavButton.svelte";
    import { currentScene } from "./stores.js";

    function changeScene(newScene){
        EventDispatcher.getInstance().emit("changeScene",newScene)    
    }

    $: changeScene($currentScene)

</script>

<nav class="navbar navbar-expand-md bg-dark navbar-dark fixed-top">
    <!-- svelte-ignore a11y-invalid-attribute -->
    <a href="#" class="navbar-brand" >Steering Behaviours</a>
  
    <!-- Toggler/collapsibe Button -->
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
      <span class="navbar-toggler-icon"></span>
    </button>
  
    <!-- Navbar links -->
    <div class="collapse navbar-collapse" id="collapsibleNavbar">
        <ul class="navbar-nav nav nav-pills">
            <NavButton key="SeekScene" name="Seek"/>
            <NavButton key="ArriveScene" name="Arrive"/>
            <NavButton key="LeaderScene" name="Leader"/>
            <NavButton key="FlockingScene" name="Flocking"/>   
      </ul>
      
    </div>
</nav>