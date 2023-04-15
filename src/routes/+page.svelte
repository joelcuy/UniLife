<script>
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";
    import { ROUTES } from "../lib/routelist";

    // No landing page, so redirect to login
    onMount(()=>{
        goto(ROUTES.login);
    })
</script>