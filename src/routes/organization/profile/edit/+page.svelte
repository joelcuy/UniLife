<script>
	import CustomProfileImageInput from '$lib/components/general/CustomProfileImageInput.svelte';

	import EventCategoryModal from '$lib/components/general/EventCategoryModal.svelte';

	import { FormGroup, Button, Form, Label, Input, FormText, Icon } from 'sveltestrap';
	import { getStores } from '$app/stores';
	import { app, auth, db, storage } from '$lib/Firebase';
	import { onMount } from 'svelte';
	import { signOut, onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { doc, setDoc, getDoc } from 'firebase/firestore';
	import { ROUTES } from '$lib/routelist';
	import CenteredSpinner from '../../../../lib/components/general/CenteredSpinner.svelte';
	import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';

	let userData;
	let userUID;
	let orgName;
	let about;
	let contactEmail;
	let website;
	let profilePic;

	let imageFile;
	let isLoading = true;

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
					orgName = userData.orgName;
					about = userData.about;
					profilePic = userData.profilePic;
					website = userData.website;
					contactEmail = userData.contactEmail;

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
		goto(ROUTES.orgProfile);
	}

	async function setProfileDetails() {
		try {
			const userRef = doc(db, 'users', userUID);
			await setDoc(
				userRef,
				{
					orgName: orgName,
					about: about,
					contactEmail: contactEmail,
					website: website
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
			<Label class="font-weight-bold" for="orgName">Organization Name</Label>
			<Input type="text" name="orgName" id="orgName" bind:value={orgName} />
		</FormGroup>
		<FormGroup>
			<Label for="about">About</Label>
			<Input type="textarea" name="about" id="about" bind:value={about} />
		</FormGroup>
		<FormGroup>
			<Label for="website">Website</Label>
			<Input type="textarea" name="website" id="website" bind:value={website} />
		</FormGroup>
		<FormGroup>
			<Label for="contactEmail">Contact Email</Label>
			<Input type="textarea" name="contactEmail" id="contactEmail" bind:value={contactEmail} />
		</FormGroup>
		<FormGroup>
			<Button color="primary" id="login-button" block on:click={handleSaveProfile}
				>Save Changes</Button
			>
		</FormGroup>
	</Form>
{/if}

<style>
</style>
