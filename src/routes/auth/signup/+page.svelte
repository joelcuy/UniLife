<script>
	import SignUp from '../../../lib/components/auth/SignupForm.svelte';
	import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification} from 'firebase/auth';
	import { goto } from '$app/navigation';
	// import { auth, userDoc } from '../../../Firebase';
	import { auth } from '../../../Firebase';
	import { Form, FormGroup, Input, Label, Button, Spinner, Alert } from 'sveltestrap';
	import { ROUTES } from '../../routelist';
	// import { setDoc } from 'Firebase/firestore/lite';

	let errorMessage;
	let isError = false;
	let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

	async function signUp(event) {
		let email = event.detail.email;
		let password = event.detail.password;
		let passwordConfirmation = event.detail.passwordConfirmation;

		isError = authCheck(email, password, passwordConfirmation);
		console.log(isError);
		if (!isError) {
			createUserWithEmailAndPassword(auth, email, password)
				.then((userCredential) => {
					console.log(userCredential);
					sendEmailVerification(userCredential.user).then(() => {
						// TODO redirect to login page https://stackoverflow.com/questions/47329158/firebase-redirect-user-to-a-page-after-clicking-verification-link#:~:text=By%20going%20into%20%22Firebase%20%2D%3E,any%20URL%20you%20want%20here.
					});
					goto('/');
					// Signed in
				})
				.catch((error) => {
					errorMessage = 'Server failed. Try again later';
					console.log(error);
				});

			// try {
			// 	let user = await createUserWithEmailAndPassword(
			// 		auth,
			// 		event.detail.email,
			// 		event.detail.password
			// 	);
			// 	await updateProfile(user.user, { displayName: event.detail.username });
			// 	await setDoc(userDoc(auth.currentUser.uid), {
			// 		username: user.user.displayName,
			// 		email: user.user.email
			// 	});
			// } catch (e) {
			// 	console.log('error from creating user', e);
			// }
		} else {
			throw new Error('Did not meet authentication criteria.');
		}
	}

	function authCheck(email, password, passwordConfirmation) {
		console.log(email, password, passwordConfirmation);
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
		} else if (password.length < 8) {
			errorMessage = 'Password must be more than 8 characters';
			return true;
		} else if (password !== passwordConfirmation) {
			errorMessage = 'Passwords do not match';
			return true;
		}

		return false;
	}
</script>

<svelte:head>
	<title>Sign Up</title>
</svelte:head>

<Alert color="danger" bind:isOpen={isError}>
	{errorMessage}
</Alert>
<SignUp on:clickSignup={signUp} />

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
			goto(ROUTES.login);
		}}
	>
		Login
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
