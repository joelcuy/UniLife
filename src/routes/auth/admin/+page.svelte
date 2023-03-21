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
	import { auth, app } from '../../../lib/Firebase';
	import { ROUTES } from '../../../lib/routelist';
	import { onMount } from 'svelte';
	import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
	// import { currentUserData } from '../../../lib/stores';

	// Initialize Cloud Firestore and get a reference to the service
	const db = getFirestore(app);
	let userData = {};
	let selectedRole;

	let errorMessage;
	let isError = false;
	let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

	async function login(event) {
		let email = event.detail.email;
		let password = event.detail.password;

		isError = authCheck(email, password);
		if (!isError) {
			signInWithEmailAndPassword(auth, email, password)
				.then(async (userCredential) => {
					const userUID = userCredential.user.uid;
					try {
						const userRef = doc(db, 'users', userUID);
						const userDocSnap = await getDoc(userRef);

						let userRole;
						if (userDocSnap.exists()) {
							console.log('Document data:', userDocSnap.data());
							userData = userDocSnap.data();
							userRole = userData.role;
							console.log(userRole);
						} else {
							// doc.data() will be undefined in this case
							console.log('No such document!');
						}
						console.log('Successful data read from Firestore');

						if (userRole === "admin") {
							goto(ROUTES.adminDashboard);
						} else {
							errorMessage = `No ${selectedRole} account associated with this email. Please ensure you've selected the correct login type.`;
							isError = true;
						}
					} catch (error) {
						console.error('Error reading user data from Firestore:', error);
					}

					// Signed in
					// ...
				})
				.catch((error) => {
					console.log(error.message);
					errorMessage = 'Email or password incorrect!';
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
