<script>
	import EventForm from '$lib/components/organization/EventForm.svelte';
	import { Button, Icon, FormGroup, Nav, NavLink } from 'sveltestrap';
	import { onAuthStateChanged } from 'firebase/auth';
	import { customDateFormat } from '$lib/utils.js';
	import { auth, db, storage } from '$lib/Firebase';
	import { collection, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import CustomImageCarousel from '$lib/components/student/CustomImageCarousel.svelte';
	import CenteredSpinner from '../../../../lib/components/general/CenteredSpinner.svelte';
	import { goto } from '$app/navigation';
	import { ROUTES } from '../../../../lib/routelist';
	import { timeAgo } from '../../../../lib/utils';
	import { showBackButton } from '../../../../lib/stores';

	let ecaPostData;
	let studentData;
	let studentUID;
	let ecaPostId;
	let isRegistered = false;

	const PAGE_STATES = Object.freeze({ details: 1, loading: 2 });

	let currentPageState = PAGE_STATES.loading;

	onMount(async () => {
		// Display back button
		// $showBackButton = true;

		// Get eca post id from url
		const path = window.location.pathname;
		const pathParts = path.split('/');
		ecaPostId = pathParts[pathParts.length - 1];

		onAuthStateChanged(auth, async (user) => {
			// User is signed in, read data from Firestore
			studentUID = user.uid;
		});

		const ecaPostRef = doc(db, 'ecaPosts', ecaPostId);
		const ecaPostDoc = await getDoc(ecaPostRef);

		if (ecaPostDoc.exists()) {
			const orgUID = ecaPostDoc.data().orgUidFk;
			const orgRef = doc(db, 'users', orgUID);
			const orgSnapshot = await getDoc(orgRef);

			ecaPostData = { ...ecaPostDoc.data(), uid: ecaPostDoc.id, organizer: orgSnapshot.data() };
			console.log('Successful data read from Firestore');
		} else {
			console.log('No such document!');
		}

		// Get a reference to the registration document in the student's registeredEvents subcollection
		const registrationRef = doc(db, 'users', studentUID, 'registeredEvents', ecaPostId);

		// Check if the registration document exists
		const registrationSnapshot = await getDoc(registrationRef);

		// If the registration document exists, the student has registered for the event
		if (registrationSnapshot.exists()) {
			isRegistered = true;
		}
		// console.log(post);
		currentPageState = PAGE_STATES.details;
	});

	async function register() {
		currentPageState = PAGE_STATES.loading;
		try {
			const studentRef = doc(db, 'users', studentUID);
			const ecaPostRef = doc(db, 'ecaPosts', ecaPostId);

			const registrationDate = new Date();
			await setDoc(doc(studentRef, 'registeredEvents', ecaPostId), {
				ecaPostUidFk: ecaPostId,
				title: ecaPostData.title,
				startDatetime: ecaPostData.startDatetime,
				location: ecaPostData.location,
				registrationDate: Timestamp.fromDate(registrationDate)
			});

			const studentDocSnap = await getDoc(studentRef);
			studentData = studentDocSnap.data();

			await setDoc(doc(ecaPostRef, 'attendees', studentUID), {
				userUidFk: studentUID,
				name: studentData.name,
				email: studentData.email,
				registrationDate: Timestamp.fromDate(registrationDate)
			});
			window.location.reload();
			console.log('User data appended to Firestore');
		} catch (error) {
			console.error('Error appending user data to Firestore:', error);
		}
		// currentPageState = PAGE_STATES.details;
	}
</script>

{#if currentPageState === PAGE_STATES.loading}
	<CenteredSpinner />
{:else}
	<div class="post">
		<CustomImageCarousel images={ecaPostData.images} />

		<div class="post-content px-3">
			<h4 class="title">{ecaPostData.title}</h4>

			<div>
				{#each ecaPostData.selectedCategories as category}
					<Button color="primary" disabled size="sm" class="me-2 mb-2">{category.name}</Button>
				{/each}
			</div>
			<!-- <p class="post-time">{timeAgo(post.creationDate)}</p> -->
			<div class="d-flex align-items-center">
				<Icon name="clock-fill" class="fs-4 me-3 text-muted" /><span
					>{customDateFormat(ecaPostData.startDatetime.toDate())}</span
				>
			</div>
			<div class="d-flex align-items-center">
				<Icon name="geo-alt-fill" class="fs-4 me-3 text-muted font-weight-bold" /><span
					>{ecaPostData.location}</span
				>
			</div>
			<div>
				<h6>About the Event</h6>
				<p>{ecaPostData.description}</p>
			</div>
			<div>
				<h6>Organizer</h6>
				<p>{ecaPostData.organizer.orgName}</p>
			</div>
			<Button
				disabled={isRegistered}
				block
				color={isRegistered ? 'disabled' : 'primary'}
				on:click={register}>{isRegistered ? 'Registered' : 'Register'}</Button
			>
		</div>
	</div>
{/if}

<style>
	p {
		margin: 0;
		word-break: break-word;
	}

	.post {
		width: 100vw;
	}

	.post-content {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		padding: 16px;
		gap: 1rem;
	}
</style>
