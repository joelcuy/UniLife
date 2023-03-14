<script>
	import LoginForm from '../../../lib/components/auth/LoginForm.svelte';
	import { Form, FormGroup, Input, Label, Button, Spinner, Alert } from 'sveltestrap';
	import { goto } from '$app/navigation';
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { auth } from '../../../Firebase';
	import { ROUTES } from '../../routelist';
	import { onMount } from 'svelte';

	let errorMessage;
	let isError = false;
	let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

	async function login(event) {
		let email = event.detail.email;
		let password = event.detail.password;

		isError = authCheck(email, password);
		if (!isError) {
			signInWithEmailAndPassword(auth, email, password)
				.then((userCredential) => {
					goto('/');
					// Signed in
					const user = userCredential.user;
					// ...
				})
				.catch((error) => {
					console.log(error.message);
					errorMessage = "Authentication failed";
					isError = true;
				});
		}
	}

	function authCheck(email, password) {
		if (email.length == 0 && password.length == 0) {
			errorMessage = 'Please enter email address and password';
			return true;
		} else if (email.length == 0) {
			errorMessage = 'Please enter email address';
			return true;
		} else if (!email.match(validRegex)) {
			errorMessage = 'Please enter a proper email address';
			return true;
		} else if (password == '') {
			errorMessage = 'Please enter your password';
			return true;
		}

		return false;
	}
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<Alert color="danger" bind:isOpen={isError}>
	{errorMessage}
</Alert>
<LoginForm on:clickLogin={login} />

<!-- TODO Make this maintainable between login and signup -->
<div class="separator-column">
	<div class="vertical-line" />
	<div class="or-text">OR</div>
	<div class="vertical-line" />
</div>

<!-- TODO Change this button to secondary -->
<FormGroup>
	<Button
		id="login-button"
		block
		on:click={() => {
			goto(ROUTES.signup);
		}}
	>
		Create New Account
	</Button>
</FormGroup>

<style>
	.vertical-line {
		width: 80px;
		background-color: black;
		height: 1px;
	}

	.separator-column {
		display: flex;
		flex-direction: row;
		column-gap: 16px;
		align-items: center;
		flex: 1;
		justify-content: center;
	}
</style>
