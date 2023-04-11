<script>
	import EventForm from '$lib/components/organization/EventForm.svelte';
	import { Button, Icon, FormGroup } from 'sveltestrap';
	import { onAuthStateChanged } from 'firebase/auth';
	import { customDateFormat } from '$lib/utils.js';
	import { auth, db, storage } from '$lib/Firebase';
	import { collection, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
	import {
		ref,
		uploadBytesResumable,
		getDownloadURL,
		listAll,
		deleteObject
	} from 'firebase/storage';
	import CenteredSpinner from '$lib/components/general/CenteredSpinner.svelte';
	import { onMount } from 'svelte';

	let ecaPostData;

	const PAGE_STATES = Object.freeze({ details: 1, editForm: 2, loading: 3 });

	let currentPageState = PAGE_STATES.loading;

	// let editMode = false;

	onMount(async () => {
		const path = window.location.pathname;
		const pathParts = path.split('/');
		const ecaPostId = pathParts[pathParts.length - 1];

		// Images upload take some time, solution is to call reload upon finish editing and manually updatefirestore onMount
		await updateFirestoreImageReference(ecaPostId);

		const postRef = doc(db, 'ecaPosts', ecaPostId);
		const postDocSnap = await getDoc(postRef);

		if (postDocSnap.exists()) {
			ecaPostData = { ...postDocSnap.data(), uid: postDocSnap.id };
			console.log('Successful data read from Firestore');
		} else {
			console.log('No such document!');
		}
		currentPageState = PAGE_STATES.details;
	});

	async function handleEditEvent(event) {
		currentPageState = PAGE_STATES.loading;
		// Get data from component dispatcher
		const title = event.detail.title;
		const description = event.detail.description;
		const eventLocation = event.detail.location;
		const selectedCategories = event.detail.selectedCategories;
		let startDatetime = event.detail.startDatetime;
		let endDatetime = event.detail.endDatetime;
		let uploadPostImages = event.detail.uploadPostImages;
		let deletePostImages = event.detail.deletePostImages;
		console.log(deletePostImages);
		try {
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
			await setDoc(
				doc(db, 'ecaPosts', ecaPostData.uid),
				{
					title: title,
					description: description,
					location: eventLocation,
					selectedCategories: selectedCategories,
					startDatetime: Timestamp.fromDate(new Date(`${startDatetime}:00.000Z`)),
					endDatetime: Timestamp.fromDate(new Date(`${endDatetime}:00.000Z`)),
					lastModified: Timestamp.fromDate(new Date())
				},
				{ merge: true }
			);
			console.log('ECA Post document edited with ID: ', ecaPostData.uid);
		} catch (error) {
			console.error('Error appending eca post data to Firestore:', error);
		}

		// Must delete before upload
		// If user already has 123.png uploaded but chooses to reupload
		// Uploading first will not work cuz already there, but gets deleted.
		// Hence, must delete first
		if (deletePostImages.length !== 0) {
			// console.log(deletePostImages);
			await deleteImage(deletePostImages);
		}
		await uploadImage(ecaPostData, uploadPostImages);
		// await updateFirestoreImageReference(data);
		location.reload();
		// currentPageState = PAGE_STATES.complete;
	}
	async function uploadImage(data, uploadPostImages) {
		// const storage = getStorage();
		const images = [];

		// Upload images to Firebase Storage
		for (const [index, file] of uploadPostImages.entries()) {
			const filePath = `ecaPosts/${data.uid}/${file.name}`;
			const fileRef = ref(storage, filePath);

			const uploadTask = uploadBytesResumable(fileRef, file);

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
						resolve();
					}
				);
			});
		}

		return images;
	}

	async function updateFirestoreImageReference(uid) {
		let images = [];
		// Create a reference under which you want to list
		const listRef = ref(storage, `ecaPosts/${uid}`);

		try {
			const res = await listAll(listRef);
			for (const itemRef of res.items) {
				// All the items under listRef.
				const fileRef = ref(storage, itemRef.fullPath);
				const downloadUrl = await getDownloadURL(fileRef);
				images.push({ filePath: itemRef.fullPath, URL: downloadUrl });
			}
			console.log(images);
		} catch (error) {
			// Uh-oh, an error occurred!
			console.log(error);
		}
		await setDoc(doc(db, 'ecaPosts', uid), { images: images }, { merge: true });
	}

	async function deleteImage(deletePostImages) {
		console.log(deletePostImages);

		// Upload images to Firebase Storage
		for (const [index, file] of deletePostImages.entries()) {
			const filePath = file.filePath;
			console.log(filePath);
			const fileRef = ref(storage, filePath);

			// Delete the file
			deleteObject(fileRef)
				.then(() => {
					// File deleted successfully
				})
				.catch((error) => {
					console.error('Error deleting image:', error);
				});
		}
	}
</script>

{#if currentPageState === PAGE_STATES.loading}
	<CenteredSpinner />
{:else if currentPageState === PAGE_STATES.editForm}
	<h4>Edit Event Details</h4>
	<EventForm
		formData={ecaPostData}
		isEditing="true"
		on:cancel={() => {
			currentPageState = PAGE_STATES.details;
		}}
		on:save={handleEditEvent}
	/>
{:else if currentPageState === PAGE_STATES.details}
	<h4>Event Details</h4>
	<h6 class="font-weight-bold">Title</h6>
	<p>{ecaPostData.title}</p>
	<h6 class="font-weight-bold">Description</h6>
	<p>{ecaPostData.description}</p>
	<h6 class="font-weight-bold">Location</h6>
	<p>{ecaPostData.location}</p>
	<h6>Category</h6>
	<div class="mb-3">
		{#if ecaPostData.selectedCategories.length === 0}
			<p class="text-muted">None selected</p>
		{/if}
		{#each ecaPostData.selectedCategories as category}
			<Button disabled size="sm" class="me-2 mb-2">{category.name}</Button>
		{/each}
	</div>
	<h6>Images</h6>
	<div class="image-preview mb-3">
		{#each ecaPostData.images as image}
			<img src={image.URL} alt="Event" />
		{/each}
	</div>
	<h6>Event Start</h6>
	<p>{customDateFormat(ecaPostData.startDatetime.toDate())}</p>
	<h6>Event End</h6>
	<p>{customDateFormat(ecaPostData.endDatetime.toDate())}</p>
	<FormGroup>
		<Button
			color="primary"
			id="login-button"
			block
			on:click={() => {
				currentPageState = PAGE_STATES.editForm;
			}}
			>Edit &nbsp;
			<Icon name="pencil-fill" />
		</Button>
	</FormGroup>
{/if}

<style>
	.image-preview {
		display: flex;
		overflow-x: auto;
		white-space: nowrap;
	}

	.image-preview img {
		max-width: 45vw;
		max-height: 15vh;
		margin-right: 0.5rem;
		cursor: pointer;
	}
</style>
