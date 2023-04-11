<script>
	import CustomProfilePicDisplay from '$lib/components/general/CustomProfilePicDisplay.svelte';

	import { FormGroup, Button } from 'sveltestrap';
	import { auth, app, db } from '../../../lib/Firebase';
	import { onMount } from 'svelte';
	import { onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { getFirestore, doc, onSnapshot, getDoc } from 'firebase/firestore';
	import { ROUTES } from '$lib/routelist';
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
	<h4 class:text-muted={!userData.orgName} class="text-center">
		{userData.orgName || 'No Name Provided'}
	</h4>
	<h6>About</h6>
	<p class:text-muted={!userData.about}>{userData.about || 'Not set'}</p>
	<h6>Website</h6>
	{#if userData.website}
		<p>{userData.website}</p>
	{:else}
		<p class:text-muted={!userData.website}>Not set</p>
	{/if}
	<h6>Contact Email</h6>
	<p class:text-muted={!userData.contactEmail}>{userData.contactEmail || 'Not set'}</p>
{/if}

<FormGroup>
	<Button
		color="primary"
		id="login-button"
		block
		on:click={() => {
			goto(ROUTES.orgEditProfile);
		}}
	>
		Edit Profile
	</Button>
</FormGroup>

<style>
</style>
