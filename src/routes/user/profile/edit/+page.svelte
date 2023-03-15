<script>
	import { FormGroup, Button, Form, Label, Input } from 'sveltestrap';
	import { getStores } from '$app/stores';
	import { auth } from '../../../../Firebase';
	import { app } from '../../../../Firebase';
	import { onMount } from 'svelte';
	import { signOut, onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
	import { ROUTES } from '../../../routelist';
	import { page } from '$app/stores';

	import { currentUserData } from '../../../../stores';

	// Initialize Cloud Firestore and get a reference to the service
	const db = getFirestore(app);

	let userUID;
	let name;
	let educationIns;
	let course;
	let bio;

	onMount(() => {
		userUID = $currentUserData.uid;
		name = $currentUserData.name;
		educationIns = $currentUserData.education_institution;
		course = $currentUserData.course;
		bio = $currentUserData.bio;
	});

	// onMount(async () => {
	// 	onAuthStateChanged(auth, async (user) => {
	// 		if (user) {
	// 			// User is signed in, read data from Firestore
	// 		} else {
	// 			console.log('no current user');
	// 		}
	// 	});
	// });

	async function handleSaveProfile() {
		try {
			const userRef = doc(db, 'users', userUID);
			await setDoc(userRef, {
				name: name,
				education_institution: educationIns,
				course: course,
				bio: bio
			});
			console.log('User data appended to Firestore');
			goto(ROUTES.profile);
		} catch (error) {
			console.error('Error appending user data to Firestore:', error);
		}
	}
</script>

<div class="page-container">
	<h1>Edit Profile</h1>
	<p>This information will appear on your public profile</p>
	<div class="profile-pic">
		<div
			class="image"
			style="background-image:url(https://images.unsplash.com/photo-1603775020644-eb8decd79994?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXQlMjBwaG90b2dyYXBoeXxlbnwwfHwwfHw%3D&w=1000&q=80)"
		/>
	</div>
	<br />
	<Form on:submit={handleSaveProfile}>
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
			<Button color="primary" id="login-button" block>Save Changes</Button>
		</FormGroup>
	</Form>
</div>

<style>
	.page-container {
		padding: 1rem;
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
