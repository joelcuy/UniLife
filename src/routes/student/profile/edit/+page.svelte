<script>
	import EventCategoryModal from './EventCategoryModal.svelte';

	import { FormGroup, Button, Form, Label, Input, FormText, Badge } from 'sveltestrap';
	import { getStores } from '$app/stores';
	import { app, auth, db } from '$lib/Firebase';
	import { onMount } from 'svelte';
	import { signOut, onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import {
		getFirestore,
		doc,
		setDoc,
		getDocs,
		getDoc,
		query,
		collection,
		orderBy,
		limit
	} from 'firebase/firestore';
	import { ROUTES } from '$lib/routelist';
	import { page } from '$app/stores';
	import blankProfilePic from '$lib/assets/blankProfilePic.png';
	import CenteredSpinner from '../../../../lib/components/general/CenteredSpinner.svelte';

	let userUID;
	let name;
	let educationIns;
	let course;
	let bio;
	let userData;
	let selectedCategories;

	let isLoading = true;

	// For Modal
	let open = false;
	const toggleAlways = () => {
		open = true;
	};

	// TODO update this
	onMount(async () => {
		// console.log($currentUserData);
		onAuthStateChanged(auth, async (user) => {
			// User is signed in, read data from Firestore
			userUID = user.uid;
			try {
				const userRef = doc(db, 'users', userUID);
				const userDocSnap = await getDoc(userRef);

				if (userDocSnap.exists()) {
					console.log('Document data:', userDocSnap.data());
					userData = userDocSnap.data();
					name = userData.name;
					educationIns = userData.educationInstitution;
					course = userData.course;
					bio = userData.bio;
					selectedCategories = userData.eventPreferences;

					// Write to Svelte store for overall app use
					// currentUserData.set({ ...userData, uid: userUID });
				} else {
					// doc.data() will be undefined in this case
					console.log('No such document!');
				}
				console.log('Successful data read from Firestore');
			} catch (error) {
				console.error('Error reading user data from Firestore:', error);
			}

			isLoading = false;
		});
	});

	async function handleSaveProfile() {
		isLoading = true;
		try {
			const userRef = doc(db, 'users', userUID);
			await setDoc(
				userRef,
				{
					name: name,
					educationInstitution: educationIns,
					course: course,
					bio: bio,
					eventPreferences: selectedCategories
				},
				{ merge: true }
			);
			console.log('User data appended to Firestore');
			goto(ROUTES.profile);
		} catch (error) {
			console.error('Error appending user data to Firestore:', error);
		}
	}
</script>

<h4>Edit Profile</h4>
{#if isLoading}
	<CenteredSpinner />
{:else}
	<!-- <p>This information will appear on your public profile</p> -->
	<div class="profile-pic">
		<div class="image" style="background-image:url({blankProfilePic})" />
	</div>
	<br />
	<Form>
		<FormGroup>
			<Label class="font-weight-bold" for="name">Name</Label>
			<Input type="text" name="name" id="name" bind:value={name} />
		</FormGroup>
		<FormGroup>
			<Label for="educationIns">Education Institution</Label>
			<Input type="text" name="educationIns" id="educationIns" bind:value={educationIns} />
		</FormGroup>
		<FormGroup>
			<Label for="course">Course of Study</Label>
			<Input type="text" name="course" id="course" bind:value={course} />
		</FormGroup>
		<FormGroup>
			<Label for="bio">Bio</Label>
			<Input type="textarea" name="bio" id="bio" bind:value={bio} />
		</FormGroup>
		<FormGroup>
			<Label for="category">Event Preferences</Label>
			<div class="mb-2">
				{#if selectedCategories.length === 0}
					<p class="text-muted">None selected</p>
				{/if}
				{#each selectedCategories as category}
					<!-- <Badge color="secondary">{category.name}</Badge> -->
					<Button disabled size="sm" class="me-2 mb-2">{category.name}</Button>
				{/each}
			</div>
			<Button outline block color="primary" on:click={toggleAlways}>Edit</Button>
			<FormText color="muted">Event Preferences help us display events relevant to you</FormText>
		</FormGroup>
		<FormGroup>
			<Button color="primary" id="login-button" block on:click={handleSaveProfile}
				>Save Changes</Button
			>
		</FormGroup>
	</Form>
{/if}

<EventCategoryModal bind:isOpen={open} bind:selectedCategories />

<style>
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
