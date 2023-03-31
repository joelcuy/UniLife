<script>
	import SignUp from '$lib/components/auth/SignupForm.svelte';
	import {
		createUserWithEmailAndPassword,
		updateProfile,
		sendEmailVerification
	} from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { app, auth } from '$lib/Firebase';
	import { Form, FormGroup, Input, Label, Button, Spinner, Alert } from 'sveltestrap';
	import { ROUTES } from '$lib/routelist';
	import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
	import { authCheck } from '$lib/auth';

	const db = getFirestore(app);

	let errorMessage;
	let isError = false;
	// let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

	async function signUp(event) {
		const email = event.detail.email;
		const password = event.detail.password;
		const passwordConfirmation = event.detail.passwordConfirmation;

		const authResult = authCheck(email, password, passwordConfirmation);
		if (authResult.isError) {
			isError = true;
			errorMessage = authResult.message;
			throw new Error(authResult.message);
		} else {
			try {
				const userCredential = await createUserWithEmailAndPassword(auth, email, password);
				const userRef = doc(db, 'users', userCredential.user.uid);
				await setDoc(userRef, {
					role: 'student',
					email: 'email'
				});
				console.log('Student data appended to Firestore');
				await sendEmailVerification(userCredential.user);
				// Student signed in
				goto(ROUTES.feed);
			} catch (error) {
				console.error('Error during signup:', error);
			}
		}
	}
</script>

<svelte:head>
	<title>Sign Up</title>
</svelte:head>

<Alert color="danger" bind:isOpen={isError}>
	{errorMessage}
</Alert>
<div class="center">
	<h3>Sign Up</h3>
	<p>Already a member? <a href={ROUTES.login}>Log in</a></p>
</div>
<SignUp on:clickSignup={signUp} />

<style>
	.center {
		display: block;
		text-align: center;
	}
</style>
