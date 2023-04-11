<script>
	import CustomProfileImageInput from './CustomProfileImageInput.svelte';

	import EventCategoryModal from './EventCategoryModal.svelte';

	import { FormGroup, Button, Form, Label, Input, FormText, Icon } from 'sveltestrap';
	import { getStores } from '$app/stores';
	import { app, auth, db, storage } from '$lib/Firebase';
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
	import {
		ref,
		uploadBytesResumable,
		getDownloadURL,
		listAll,
		deleteObject
	} from 'firebase/storage';

	let userData;
	let userUID;
	let name;
	let educationIns;
	let course;
	let bio;
	let profilePic;
	let selectedCategories;

	let imageFile;
	let isLoading = true;

	// For Modal
	let open = false;
	const toggleAlways = () => {
		open = true;
	};

	const PROFILE_PIC_STATES = Object.freeze({ noChange: 1, remove: 2, upload: 3 });
	let currentprofilePicState = PROFILE_PIC_STATES.noChange;

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
					profilePic = userData.profilePic;
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

	// function handleProfilePicChange(event) {
	// 	if (event.detail) {
	// 		imageFile = event.detail.image;
	// 	}

	// 	console.log(event.detail);
	// }

	function handleProfilePicInput(event) {
		imageFile = event.detail.image;
		currentprofilePicState = PROFILE_PIC_STATES.upload;
	}

	function handleProfilePicRemove(event) {
		currentprofilePicState = PROFILE_PIC_STATES.remove;
	}

	async function handleSaveProfile() {
		isLoading = true;

		if (currentprofilePicState === PROFILE_PIC_STATES.upload) {
			// If new image selected, delete previous and reupload
			if (profilePic) {
				await deleteProfilePic();
			}
			uploadProfilePic();
		} else if (currentprofilePicState === PROFILE_PIC_STATES.remove) {
			await deleteProfilePic();
		}
		await setProfileDetails();
		goto(ROUTES.profile);
	}

	async function setProfileDetails() {
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
		} catch (error) {
			console.error('Error appending user data to Firestore:', error);
		}
	}

	async function deleteProfilePic() {
		const filePath = profilePic.filePath;
		// console.log(filePath);
		const fileRef = ref(storage, filePath);

		// Delete the file
		deleteObject(fileRef)
			.then(() => {
				// File deleted successfully
			})
			.catch((error) => {
				console.error('Error deleting image:', error);
			});

		// Save the image URLs to the Firestore document
		await setDoc(doc(db, 'users', userUID), { profilePic: null }, { merge: true });
	}

	async function uploadProfilePic() {
		try {
			const filePath = `profilepic/${userUID}/${imageFile.name}`;
			const fileRef = ref(storage, filePath);
			const uploadTask = uploadBytesResumable(fileRef, imageFile);

			// Wait for the upload to complete and get the download URL
			await new Promise((resolve, reject) => {
				uploadTask.on(
					'state_changed',
					null,
					(error) => {
						console.error('Error uploading image:', error);
						reject(error);
					},
					async () => {
						const downloadUrl = await getDownloadURL(fileRef);
						profilePic = { filePath: filePath, URL: downloadUrl };
						resolve();
					}
				);
			});
			// Save the image URLs to the Firestore document
			await setDoc(doc(db, 'users', userUID), { profilePic: profilePic }, { merge: true });
		} catch (error) {
			console.error('Error uploading image to storage:', error);
		}
	}
</script>

<h4>Edit Profile</h4>
{#if isLoading}
	<CenteredSpinner />
{:else}
	<!-- <p>These information will appear on your public profile</p> -->
	<Form>
		<FormGroup>
			<CustomProfileImageInput
				on:upload={handleProfilePicInput}
				on:remove={handleProfilePicRemove}
				currentImage={profilePic ? profilePic.URL : undefined}
			/>
		</FormGroup>
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
</style>
