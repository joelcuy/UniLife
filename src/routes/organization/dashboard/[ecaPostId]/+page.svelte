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
		await updateFirestoreImageReference(ecaPostId);

		const postRef = doc(db, 'ecaPosts', ecaPostId);
		const postDocSnap = await getDoc(postRef);

		if (postDocSnap.exists()) {
			// console.log('Document data:', userDocSnap.data());
			// orgRequests.push({ ...doc.data(), uid: doc.id });
			ecaPostData = { ...postDocSnap.data(), uid: postDocSnap.id };
			// userRole = userData.role;
			// console.log(userRole);
			console.log('Successful data read from Firestore');
		} else {
			console.log('No such document!');
		}
		currentPageState = PAGE_STATES.details;
		// data.images =
	});

	async function handleEditEvent(event) {
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
		await uploadImage(ecaPostData, uploadPostImages);
		if (deletePostImages.length !== 0) {
			// console.log(deletePostImages);
			await deleteImage(deletePostImages);
		}
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
	<div class="event-details">
		<div class="event-details-item">
			<h6 class="font-weight-bold">Title</h6>
			<p>{ecaPostData.title}</p>
		</div>
		<!-- <div class="d-flex justify-content-between m-0">
			<div class="">
				<h6 class="font-weight-bold">Title</h6>
				<p>{data.title}</p>
			</div>
		
			<span
				on:click={() => {
					editMode = true;
				}}
			>
				<Icon class="text-1" name="pencil-fill" />
				&nbsp; Edit
			</span>
		</div> -->
		<div class="event-detail-item">
			<h6 class="font-weight-bold">Description</h6>
			<p>{ecaPostData.description}</p>
		</div>
		<div class="event-detail-item">
			<h6 class="font-weight-bold">Location</h6>
			<p>{ecaPostData.location}</p>
		</div>
		<div class="event-detail-item">
			<h6>Category</h6>
			<p>{ecaPostData.selectedCategories.name}</p>
		</div>
		<div class="event-detail-item">
			<h6>Images</h6>
			<div class="image-preview">
				{#each ecaPostData.images as image}
					<img src={image.URL} alt="Event" />
				{/each}
			</div>
		</div>
		<div class="event-detail-item">
			<h6>Event Start</h6>
			<p>{customDateFormat(ecaPostData.startDatetime.toDate())}</p>
		</div>
		<div class="event-detail-item">
			<h6>Event End</h6>
			<p>{customDateFormat(ecaPostData.endDatetime.toDate())}</p>
		</div>
		<!-- <div class="event-detail-item">
		<button class="btn btn-primary" on:click={handleEditClick}>Edit</button>
	</div> -->
	</div>
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
	.event-detail-item {
		margin-bottom: 1rem;
	}

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
