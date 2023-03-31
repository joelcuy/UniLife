<script>
	import {
		signOut,
		onAuthStateChanged,
		createUserWithEmailAndPassword,
		sendEmailVerification
	} from 'firebase/auth';
	import { ListGroup, ListGroupItem, Nav, NavLink } from 'sveltestrap';
	import {
		Button,
		Card,
		CardBody,
		CardFooter,
		CardHeader,
		CardSubtitle,
		CardText,
		CardTitle
	} from 'sveltestrap';
	import { goto } from '$app/navigation';
	import { auth, app } from '../../lib/Firebase';
	import { onMount, afterUpdate, onDestroy } from 'svelte';
	import { Form, FormGroup, Input, Label, Spinner, Alert } from 'sveltestrap';
	import {
		getFirestore,
		collection,
		query,
		where,
		getDocs,
		doc,
		setDoc,
		onSnapshot
	} from 'firebase/firestore';
	import { httpsCallable } from 'firebase/functions';

	// Testing in emulator
	import { getApp } from 'firebase/app';
	import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
	import { ROUTES } from '../../lib/routelist';

	// const functions = getFunctions(getApp());
	// connectFunctionsEmulator(functions, 'localhost', 5001);

	// Initialize Cloud Firestore and get a reference to the service
	const db = getFirestore(app);

	let isLoading = true;
	let orgRequests = [];

	onMount(async () => {
		onSnapshot(collection(db, 'organizationRequests'), (collectionSnapshot) => {
			orgRequests = [];
			collectionSnapshot.forEach((doc) => {
				// doc.data() is never undefined for query doc snapshots
				console.log(doc.id, ' => ', doc.data());
				orgRequests.push({ ...doc.data(), uid: doc.id });
			});
			// console.log(orgRequests);
			isLoading = false;
		});
	});

	async function signout() {
		signOut(auth)
			.then(() => {
				// Sign-out successful.
				console.log('signed out');
				goto(ROUTES.adminLogin);
			})
			.catch((error) => {
				// An error happened.
			});
	}

	async function approveRequest({ email, about, orgName, uid, userUidFk }) {
		try {
			// Update organization request status
			const orgRequestRef = doc(db, 'organizationRequests', uid);
			await setDoc(orgRequestRef, { requestStatus: 'Approved' }, { merge: true });

			// Add user role to Firestore
			const userRef = doc(db, 'users', userUidFk);
			await setDoc(
				userRef,
				{ about: about, email: email, orgName: orgName, isActive: true },
				{ merge: true }
			);

			console.log('User data appended to Firestore');

			// TODO: Redirect to login page after email verification
		} catch (error) {
			console.error('Error in approveRequest:', error);
		}
	}
</script>

<h4 class="ms-2">Organization Requests</h4>
{#if isLoading}
	Loading...
{:else}
	{#each orgRequests as orgRequest}
		<Card class="mb-2 mx-2">
			<CardHeader class="d-flex flex-row justify-content-between">
				<CardTitle class="my-2">{orgRequest.orgName}</CardTitle>
				<Nav>
					<NavLink href="#" class="px-0">View Details</NavLink>
				</Nav>
			</CardHeader>
			<CardBody>
				<CardSubtitle>Email</CardSubtitle>
				<CardText>{orgRequest.email}</CardText>
				<CardSubtitle>About</CardSubtitle>
				<CardText>{orgRequest.about}</CardText>
			</CardBody>
			<CardFooter class="d-flex flex-row justify-content-end">
				{#if orgRequest.requestStatus === 'Pending'}
					<Button
						class="me-2"
						color="primary"
						on:click={() => {
							approveRequest(orgRequest);
						}}>Approve</Button
					>
					<Button color="primary" outline>Reject</Button>
				{:else}
					{orgRequest.requestStatus.charAt(0).toUpperCase() + orgRequest.requestStatus.slice(1)}
				{/if}
			</CardFooter>
		</Card>
	{/each}
{/if}
<FormGroup>
	<Button color="primary" id="login-button" block on:click={signout}>SignOut</Button>
</FormGroup>
