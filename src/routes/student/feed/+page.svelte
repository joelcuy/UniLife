<script>
	import { signOut, onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/Firebase';
	import { Form, FormGroup, Input, Label, Button, Spinner, Alert } from 'sveltestrap';
	import { onMount } from 'svelte';
	import { ROUTES } from '$lib/routelist';
	import { signout } from '$lib/auth.js';

	// async function signout() {
	// 	signOut(auth)
	// 		.then(() => {
	// 			// Sign-out successful.
	// 			goto(ROUTES.login);
	// 			console.log('signed out');
	// 		})
	// 		.catch((error) => {
	// 			// An error happened.
	// 		});
	// }
</script>

<h1>Student Home</h1>
<FormGroup>
	<Button color="primary" id="login-button" block on:click={signout}>SignOut</Button>
</FormGroup>
