<script>
	import AccountTypeRadio from '$lib/components/auth/AccountTypeRadio.svelte';
	import LoginForm from '$lib/components/auth/LoginForm.svelte';
	import { Alert } from 'sveltestrap';
	import { goto } from '$app/navigation';
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { auth, db } from '$lib/Firebase';
	import { ROUTES } from '$lib/routelist';
	import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
	import { authCheck, signout } from '$lib/auth';

	let userData = {};
	let selectedRole = 'student';
	let errorMessage;
	let isError = false;

	let userUID;

	async function login(event) {
		const email = event.detail.email;
		const password = event.detail.password;

		const authResult = authCheck(email, password);

		// isError = authCheck(email, password);
		if (authResult.isError) {
			isError = true;
			errorMessage = authResult.message;
			throw new Error(authResult.message);
		} else {
			try {
				const userCredential = await signInWithEmailAndPassword(auth, email, password);
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
					console.log('Successful data read from Firestore');
				} else {
					console.log('No such document!');
				}

				if (userRole === selectedRole) {
					switch (userRole) {
						case 'student':
							goto(ROUTES.feed);
							break;

						case 'organization':
							goto(ROUTES.orgDashboard);
							break;
					}
				} else {
					signout();
					errorMessage = `No ${selectedRole} account associated with this email. Please ensure you've selected the correct login type.`;
					isError = true;
				}
			} catch (error) {
				console.error('Error during user data retrieval:', error);
				isError = true;
				errorMessage = 'Error retrieving user data.';
			}
		}
	}

	$: console.log(selectedRole);
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<Alert color="danger" bind:isOpen={isError}>
	{errorMessage}
</Alert>
<div class="center">
	<h3>Log in</h3>
	<p>
		Don't have an account? <a href={ROUTES.signup}>Sign up</a>
	</p>
</div>

<AccountTypeRadio
	{selectedRole}
	on:selectRole={(event) => (selectedRole = event.detail.selectedRole)}
/>
<LoginForm on:clickLogin={login} />

<style>
	p {
		font-size: 1rem;
		margin: 0;
	}

	.center {
		display: block;
		text-align: center;
	}
</style>
