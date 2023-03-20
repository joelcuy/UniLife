<script>
	import { signOut, onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { auth } from '../../../lib/Firebase';
	import { Form, FormGroup, Input, Label, Button, Spinner, Alert } from 'sveltestrap';
	import { onMount } from 'svelte';

	async function signout() {
		signOut(auth)
			.then(() => {
				// Sign-out successful.
				console.log('signed out');
			})
			.catch((error) => {
				// An error happened.
			});
	}
</script>

<h1>FUCK</h1>
<FormGroup>
	<Button color="primary" id="login-button" block on:click={signout}>SignOut</Button>
</FormGroup>
