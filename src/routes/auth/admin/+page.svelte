<script>
	import LoginForm from '../../../lib/components/auth/LoginForm.svelte';
	import {
		Form,
		FormGroup,
		Input,
		Label,
		Button,
		Spinner,
		Alert,
		TabContent,
		TabPane
	} from 'sveltestrap';
	import { goto } from '$app/navigation';
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { auth, app, db } from '../../../lib/Firebase';
	import { ROUTES } from '../../../lib/routelist';
	import { onMount } from 'svelte';
	import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
	import { authCheck, signout } from '$lib/auth';

	let userData = {};
	let errorMessage;
	let isError = false;
	let userUID;

	async function login(event) {
		const email = event.detail.email;
		const password = event.detail.password;

		const authResult = authCheck(email, password);

		if (authResult.isError) {
			isError = true;
			errorMessage = authResult.message;
			throw new Error(authResult.message);
		} else {
			try {
				const userCredential = signInWithEmailAndPassword(auth, email, password);
				userUID = userCredential.user.uid;
			} catch (error) {
				console.error('Error during login:', error);
				isError = true;
				errorMessage = 'Incorrect email or password.';
			}

			try {
				const userRef = doc(db, 'users', userUID);
				const userDocSnap = await getDoc(userRef);

				let userRole;
				if (userDocSnap.exists()) {
					// console.log('Document data:', userDocSnap.data());
					userData = userDocSnap.data();
					userRole = userData.role;
					// console.log(userRole);
					console.log('Successful data read from Firestore');
				} else {
					console.log('No such document!');
				}

				if (userRole === 'admin') {
					goto(ROUTES.adminDashboard);
				} else {
					signout();
					errorMessage = `No admin account associated with this email. Please ensure you've selected the correct login type.`;
					isError = true;
				}
			} catch (error) {
				console.error('Error during user data retrieval:', error);
				isError = true;
				errorMessage = 'Error retrieving user data.';
			}
		}
	}
</script>

<svelte:head>
	<title>Admin</title>
</svelte:head>

<Alert color="danger" bind:isOpen={isError}>
	{errorMessage}
</Alert>
<div class="center">
	<h3>Admin Log in</h3>
</div>
<LoginForm on:clickLogin={login} />

<style>
	.center {
		display: block;
		text-align: center;
	}
</style>
