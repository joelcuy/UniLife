<script>
	import SignUp from '$lib/components/auth/SignupForm.svelte';
	import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { app, auth, db } from '$lib/Firebase';
	import { Alert, NavLink, Nav, Icon } from 'sveltestrap';
	import { ROUTES } from '$lib/routelist';
	import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
	import { authCheck } from '$lib/auth';

	let errorMessage;
	let isError = false;

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
					email: email,
					eventPreferences: [],
				});
				console.log('Student data appended to Firestore');
				await sendEmailVerification(userCredential.user);
				// Student signed in

				if (userCredential) {
					goto(ROUTES.feed);
				} else {
					isError = true;
					errorMessage = 'Error signing up, try again later.';
				}
			} catch (error) {
				console.error('Error during signup:', error);
			}
		}
	}
</script>

<Alert color="danger" bind:isOpen={isError}>
	{errorMessage}
</Alert>
<Nav>
	<NavLink class="p-0" href={ROUTES.signup}><Icon name="arrow-left" /> Back</NavLink>
</Nav>
<h4 class="text-center">Create Student Account</h4>
<SignUp on:clickSignup={signUp} />

<style>
</style>
