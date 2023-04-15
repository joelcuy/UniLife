<script>
	import { signout } from '$lib/auth';
	import { customDateFormat } from '../../../lib/utils';
	import {
		Button,
		Card,
		CardBody,
		CardFooter,
		CardHeader,
		CardSubtitle,
		CardText,
		CardTitle,
		Modal,
		ModalBody,
		ModalFooter,
		ModalHeader
	} from 'sveltestrap';
	import { auth, db, storage } from '$lib/Firebase';
	import {
		collection,
		doc,
		deleteDoc,
		getDocs,
		onSnapshot,
		where,
		query,
		orderBy
	} from 'firebase/firestore';
	import { onAuthStateChanged } from 'firebase/auth';
	import { onMount } from 'svelte';
	import { ROUTES } from '../../../lib/routelist';
	import CenteredSpinner from '../../../lib/components/general/CenteredSpinner.svelte';
	import { goto } from '$app/navigation';

	let isOpen = false;
	// For Modal
	const toggle = () => {
		// fullscreen = undefined;
		isOpen = !isOpen;
	};

	let selectedEcaPost;

	let isLoading;
	let ecaPosts = [];

	onMount(async () => {
		await fetchData();
	});

	async function fetchData() {
		isLoading = true;
		let userUID;
		const user = await new Promise((resolve, reject) => {
			onAuthStateChanged(auth, (user) => {
				if (user) {
					resolve(user);
				} else {
					reject(new Error('Unable to get current user'));
				}
			});
		});
		userUID = user.uid;

		const q = query(
			collection(db, 'ecaPosts'),
			where('orgUidFk', '==', userUID),
			orderBy('creationDate', 'desc')
		);

		const querySnapshot = await getDocs(q);
		ecaPosts = [];
		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			console.log(doc.id, ' => ', doc.data());
			ecaPosts.push({ ...doc.data(), uid: doc.id });
		});
		isLoading = false;
	}

	async function deleteEcaPost({ uid }) {
		console.log(uid);
		await deleteDoc(doc(db, 'ecaPosts', uid));
		await fetchData();
	}
</script>

<h4>Your Events</h4>
{#if isLoading}
	<CenteredSpinner />
{:else}
	{#each ecaPosts as ecaPost}
		<Card class="mb-2">
			<CardHeader class="d-flex flex-row justify-content-between">
				<CardTitle class="my-2 fs-6">{ecaPost.title}</CardTitle>
			</CardHeader>
			<CardBody>
				<CardText class="m-0 text-muted">
					{customDateFormat(ecaPost.startDatetime.toDate())}
				</CardText>
				<CardText class="text-muted">{ecaPost.location}</CardText>
			</CardBody>
			<CardFooter class="d-flex flex-row justify-content-end">
				<Button
					class="me-2"
					color="primary"
					outline
					on:click={() => {
						goto(`${ROUTES.orgDashboard}/${ecaPost.uid}`);
					}}
				>
					Edit
				</Button>
				<Button
					color="primary"
					on:click={() => {
						toggle();
						selectedEcaPost = ecaPost;
					}}
				>
					Delete
				</Button>
			</CardFooter>
		</Card>
	{/each}
	{#if ecaPosts.length === 0}
		<p class="text-center text-muted">No events yet</p>
	{/if}
{/if}

<Modal {isOpen} {toggle} size="sm" class="mt-5">
	<ModalHeader {toggle}>Confirmation</ModalHeader>
	<ModalBody>
		<p>Delete Event?</p>
	</ModalBody>
	<ModalFooter class="d-flex justify-content-end">
		<Button
			color="primary"
			on:click={() => {
				deleteEcaPost(selectedEcaPost);
				toggle();
			}}
		>
			Confirm
		</Button>
	</ModalFooter>
</Modal>
