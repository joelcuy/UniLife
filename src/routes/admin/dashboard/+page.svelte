<script>
	import { signOut } from 'firebase/auth';
	import { ListGroup, ListGroupItem, Nav, NavLink } from 'sveltestrap';
	import {
		Button,
		Card,
		CardBody,
		CardFooter,
		CardHeader,
		CardSubtitle,
		CardText,
		CardTitle,
		Icon,
		Modal,
		ModalBody,
		ModalFooter,
		ModalHeader
	} from 'sveltestrap';
	import { goto } from '$app/navigation';
	import { auth, app, db } from '$lib/Firebase';
	import { onMount, afterUpdate, onDestroy } from 'svelte';
	import { Form, FormGroup, Input, Label, Spinner, Alert } from 'sveltestrap';
	import {
		getFirestore,
		collection,
		query,
		where,
		orderBy,
		getDocs,
		doc,
		setDoc,
		onSnapshot
	} from 'firebase/firestore';
	import { ROUTES } from '$lib/routelist';
	import CenteredSpinner from '$lib/components/general/CenteredSpinner.svelte';

	const AVAILABLE_ACTIONS = Object.freeze({
		Approve: 1,
		Reject: 2
	});
	let selectedAction;

	let selectedOrgRequest;

	let isOpen = false;
	// For Modal
	const toggle = () => {
		// fullscreen = undefined;
		isOpen = !isOpen;
	};

	let isLoading;
	let orgRequests = [];

	onMount(async () => {
		await fetchData();
	});

	async function fetchData() {
		isLoading = true;
		orgRequests = [];
		// Fetch Pending requests
		const pendingQuery = query(
			collection(db, 'organizationRequests'),
			where('requestStatus', '==', 'Pending'),
			orderBy('requestDate', 'desc')
		);

		const pendingQuerySnapshot = await getDocs(pendingQuery);
		pendingQuerySnapshot.forEach((doc) => {
			orgRequests.push({ ...doc.data(), uid: doc.id });
		});

		// onSnapshot(pendingQuery, (collectionSnapshot) => {
		// 	orgRequests = [];
		// 	collectionSnapshot.forEach((doc) => {
		// 		// doc.data() is never undefined for query doc snapshots
		// 		console.log(doc.id, ' => ', doc.data());
		// 		orgRequests.push({ ...doc.data(), uid: doc.id });
		// 	});
		// });

		// Fetch Approved and Rejected requests
		const otherQuery = query(
			collection(db, 'organizationRequests'),
			where('requestStatus', 'in', ['Approved', 'Rejected']),
			orderBy('requestDate', 'desc')
		);

		const otherQuerySnapshot = await getDocs(otherQuery);
		otherQuerySnapshot.forEach((doc) => {
			orgRequests.push({ ...doc.data(), uid: doc.id });
		});

		isLoading = false;
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
			fetchData();

			// TODO: Redirect to login page after email verification
		} catch (error) {
			console.error('Error in approveRequest:', error);
		}
	}

	async function rejectRequest({ uid }) {
		try {
			// Update organization request status
			const orgRequestRef = doc(db, 'organizationRequests', uid);
			await setDoc(orgRequestRef, { requestStatus: 'Rejected' }, { merge: true });

			fetchData();
		} catch (error) {
			console.error('Error in rejectRequest:', error);
		}
	}
</script>

<h4>Organization Requests</h4>
{#if isLoading}
	<CenteredSpinner />
{:else}
	{#each orgRequests as orgRequest}
		<Card class="mb-2">
			<CardHeader class="d-flex flex-row justify-content-between align-items-center">
				<CardTitle class="my-2 fs-6">{orgRequest.orgName}</CardTitle>
				<!-- <Nav>
					<NavLink href="#" class="px-0">View Details</NavLink>
				</Nav> -->
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
							toggle();
							selectedOrgRequest = orgRequest;
							selectedAction = AVAILABLE_ACTIONS.Approve;
						}}
					>
						Approve
					</Button>
					<Button
						color="primary"
						outline
						on:click={() => {
							toggle();
							selectedOrgRequest = orgRequest;
							selectedAction = AVAILABLE_ACTIONS.Reject;
						}}
					>
						Reject
					</Button>
				{:else}
					{orgRequest.requestStatus.charAt(0).toUpperCase() + orgRequest.requestStatus.slice(1)}
				{/if}
			</CardFooter>
		</Card>
	{/each}
{/if}

<Modal {isOpen} {toggle} size="sm" class="mt-5">
	<ModalHeader {toggle}>Confirmation</ModalHeader>
	<ModalBody>
		{#if selectedAction === AVAILABLE_ACTIONS.Approve}
			<p>Approve organization request?</p>
		{:else if selectedAction === AVAILABLE_ACTIONS.Reject}
			<p>Reject organization request?</p>
		{/if}
	</ModalBody>
	<ModalFooter class="d-flex justify-content-end">
		<Button
			color="primary"
			on:click={() => {
				toggle();
				if (selectedAction === AVAILABLE_ACTIONS.Approve) {
					approveRequest(selectedOrgRequest);
				} else {
					rejectRequest(selectedOrgRequest);
				}
			}}
		>
			Confirm
		</Button>
	</ModalFooter>
</Modal>
