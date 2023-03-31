<script>
	import { signOut, onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { auth } from '../../lib/Firebase';
	import { onMount, afterUpdate, onDestroy } from 'svelte';
	import { Form, FormGroup, Input, Label, Button, Spinner, Alert } from 'sveltestrap';
	import { ROUTES } from '../../lib/routelist';

	async function signout() {
		signOut(auth)
			.then(() => {
				// Sign-out successful.
				console.log('signed out');
				goto(ROUTES.login);
			})
			.catch((error) => {
				// An error happened.
			});
	}
</script>

<h1>Organization Dashboard</h1>
<FormGroup>
	<Button color="primary" id="login-button" block on:click={signout}>SignOut</Button>
</FormGroup>
