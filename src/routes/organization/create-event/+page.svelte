<script>
	import EventForm from '../../../lib/components/organization/EventForm.svelte';
	import { auth, db, storage } from '$lib/Firebase';
	import { collection, doc, addDoc, setDoc, Timestamp } from 'firebase/firestore';
	import { onAuthStateChanged } from 'firebase/auth';
	import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
	import CenteredSpinner from '../../../lib/components/general/CenteredSpinner.svelte';

	const PAGE_STATES = Object.freeze({ form: 1, loading: 2, complete: 3 });

	let currentPageState = PAGE_STATES.form;

	async function handleCreateEvent(event) {
		currentPageState = PAGE_STATES.loading;

		// Get data from component dispatcher
		const title = event.detail.title;
		const description = event.detail.description;
		const location = event.detail.location;
		const selectedCategories = event.detail.selectedCategories;
		let startDatetime = event.detail.startDatetime;
		let endDatetime = event.detail.endDatetime;
		let postImages = event.detail.postImages;
		// console.log(title);
		// console.log(selectedCategories);
		// console.log(startDatetime);
		// console.log(endDatetime);
		// console.log(postImages);
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
			const postRef = await addDoc(collection(db, 'ecaPosts'), {
				title: title,
				description: description,
				location: location,
				selectedCategories: selectedCategories,
				startDatetime: Timestamp.fromDate(new Date(`${startDatetime}:00.000Z`)),
				endDatetime: Timestamp.fromDate(new Date(`${endDatetime}:00.000Z`)),
				creationDate: Timestamp.fromDate(new Date()),
				orgUidFk: userUID
			});
			// await setDoc(postRef, {});
			console.log('ECA Post document wrtten with ID: ', postRef.id);

			const imageUrls = await uploadImage(postRef, postImages);
			// Save the image URLs to the Firestore document
			await setDoc(doc(db, 'ecaPosts', postRef.id), { imageUrls: imageUrls }, { merge: true });
		} catch (error) {
			console.error('Error appending eca post data to Firestore:', error);
		}
		currentPageState = PAGE_STATES.complete;
	}

	async function uploadImage(postRef, postImages) {
		// const storage = getStorage();
		const imageUrls = [];

		// Upload images to Firebase Storage
		for (const [index, file] of postImages.entries()) {
			const filePath = `ecaPosts/${postRef.id}/${index}_${file.name}`;
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
						const downloadUrl = await getDownloadURL(fileRef);
						imageUrls.push(downloadUrl);
						resolve();
					}
				);
			});
		}

		return imageUrls;
	}
</script>

{#if currentPageState === PAGE_STATES.loading}
	<CenteredSpinner />
{:else if currentPageState === PAGE_STATES.form}
	<h4>Create New Event</h4>
	<EventForm on:save={handleCreateEvent} />
{:else if currentPageState === PAGE_STATES.complete}
	doneeeeeeeee
{/if}

<style>
</style>
