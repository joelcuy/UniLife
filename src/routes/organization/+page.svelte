<script>
	import { signOut, onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { auth } from '../../lib/Firebase';
	import { onMount, afterUpdate, onDestroy } from 'svelte';
	import { Form, FormGroup, Input, Label, Button, Spinner, Alert } from 'sveltestrap';
	import { ROUTES } from '../../lib/routelist';
	import { signout } from '$lib/auth';
</script>

<h1>Organization Dashboard</h1>
<FormGroup>
	<Button color="primary" id="login-button" block on:click={signout}>SignOut</Button>
</FormGroup>
