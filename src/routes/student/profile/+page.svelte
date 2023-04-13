<script>
	import CustomProfilePicDisplay from '$lib/components/general/CustomProfilePicDisplay.svelte';

	import { FormGroup, Button } from 'sveltestrap';
	import { auth, app, db } from '../../../lib/Firebase';
	import { onMount } from 'svelte';
	import { onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { getFirestore, doc, onSnapshot, getDoc } from 'firebase/firestore';
	import { ROUTES } from '$lib/routelist';
	import blankProfilePic from '$lib/assets/blankProfilePic.png';
	import CenteredSpinner from '../../../lib/components/general/CenteredSpinner.svelte';

	let userData;
	let isLoading = true;

	onMount(async () => {
		// console.log($currentUserData);
		onAuthStateChanged(auth, async (user) => {
			// User is signed in, read data from Firestore
			const userUID = user.uid;
			try {
				const userRef = doc(db, 'users', userUID);
				// const userDocSnap = await getDoc(userRef);

				onSnapshot(userRef, (userDocSnap) => {
					console.log('Real-time update:', userDocSnap.data());
					userData = userDocSnap.data();
				});
				console.log('Successful data read from Firestore');
				isLoading = false;
			} catch (error) {
				console.error('Error reading user data from Firestore:', error);
			}
		});
	});
</script>

{#if !userData}
	<CenteredSpinner />
{:else}
	<CustomProfilePicDisplay profilePic={userData.profilePic} />
	<h4 class:text-muted={!userData.name} class="text-center">
		{userData.name || 'No Name Provided'}
	</h4>
	<br />
	<h6>Education Institution</h6>
	<p class:text-muted={!userData.educationInstitution}>
		{userData.educationInstitution || 'Not set'}
	</p>
	<h6>Course of Study</h6>
	<p class:text-muted={!userData.course}>{userData.course || 'Not set'}</p>
	<h6>Bio</h6>
	<p class:text-muted={!userData.bio}>{userData.bio || 'Not set'}</p>
	<h6>Event Preferences</h6>
	<div class="mb-3">
		{#if userData.eventPreferences.length === 0}
			<p class="text-muted">None selected</p>
		{/if}
		{#each userData.eventPreferences as category}
			<Button color="primary" disabled size="sm" class="me-2 mb-2">{category.name}</Button>
		{/each}
	</div>
{/if}

<FormGroup>
	<Button
		color="primary"
		id="login-button"
		block
		on:click={() => {
			goto(ROUTES.editProfile);
		}}
	>
		Edit Profile
	</Button>
</FormGroup>

<style>
</style>
