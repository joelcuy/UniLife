<script>
	import { FormGroup, Button } from 'sveltestrap';
	import { auth, app, db } from '../../../lib/Firebase';
	import { onMount } from 'svelte';
	import { onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
	import { ROUTES } from '$lib/routelist';
	import blankProfilePic from '$lib/assets/blankProfilePic.png';
	import CenteredSpinner from '../../../lib/components/general/CenteredSpinner.svelte';

	let userData = {};
	let isLoading = true;

	onMount(async () => {
		// console.log($currentUserData);
		onAuthStateChanged(auth, async (user) => {
			// User is signed in, read data from Firestore
			const userUID = user.uid;
			try {
				const userRef = doc(db, 'users', userUID);
				const userDocSnap = await getDoc(userRef);

				if (userDocSnap.exists()) {
					console.log('Document data:', userDocSnap.data());
					userData = userDocSnap.data();

					// Write to Svelte store for overall app use
					// currentUserData.set({ ...userData, uid: userUID });
				} else {
					// doc.data() will be undefined in this case
					console.log('No such document!');
				}
				console.log('Successful data read from Firestore');
				isLoading = false;
			} catch (error) {
				console.error('Error reading user data from Firestore:', error);
			}
		});
	});
</script>

{#if isLoading}
	<CenteredSpinner />
{:else}
	<div class="profile-pic">
		<div class="image" style="background-image:url({blankProfilePic})" />
	</div>
	<h3 class:text-muted={!userData.name} class="text-center">
		{userData.name || 'No Name Provided'}
	</h3>
	<br />
	<h5>Education Institution</h5>
	<p class:text-muted={!userData.educationInstitution}>
		{userData.educationInstitution || 'Not set'}
	</p>
	<h5>Course of Study</h5>
	<p class:text-muted={!userData.course}>{userData.course || 'Not set'}</p>
	<h5>Bio</h5>
	<p class:text-muted={!userData.bio}>{userData.bio || 'Not set'}</p>
	<h5>Event Preferences</h5>
	<div class="fs-4 mb-3">
		{#each userData.eventPreferences as category}
			<!-- <Badge color="secondary">{category.name}</Badge> -->
			<Button disabled size="sm" class="me-2">{category.name}</Button>
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
	p {
		text-align: justify;
	}

	.profile-pic {
		width: 45%;
		margin: auto;
	}

	div.image {
		/* make it responsive */
		max-width: 100%;
		width: 100%;
		height: auto;
		display: block;
		/* div height to be the same as width*/
		padding-top: 100%;

		/* make it a circle */
		border-radius: 50%;

		/* Centering on image`s center*/
		background-position-y: center;
		background-position-x: center;
		background-repeat: no-repeat;

		/* it makes the clue thing, takes smaller dimension to fill div */
		background-size: cover;

		/* it is optional, for making this div centered in parent*/
		margin: 0 auto;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}
</style>
