<script>
	import Post from '$lib/components/student/Post.svelte';
	import { db, auth } from '$lib/Firebase';
	import { onMount, onDestroy } from 'svelte';
	import {
		collection,
		getDocs,
		doc,
		getDoc,
		query,
		orderBy,
		limit,
		startAfter,
		where
	} from 'firebase/firestore';
	import CenteredSpinner from '$lib/components/general/CenteredSpinner.svelte';
	import { onAuthStateChanged } from 'firebase/auth';

	let isLoading = false;
	let ecaPosts = [];

	// let page = 1;
	let lastVisible = null;
	const loadCount = 3;

	let debounceTimeout;
	let noMoreEvents = false;

	let scrollContainer;

	let studentEventPreference;

	onMount(async () => {
		isLoading = true;

		studentEventPreference = await getStudentEventPreference();
		const eventsLoaded = await loadMoreEvents();
		isLoading = false;

		if (eventsLoaded === 0) {
			noMoreEvents = true;
		}
	});

	async function getStudentEventPreference() {
		return new Promise((resolve, reject) => {
			onAuthStateChanged(auth, async (user) => {
				const studentRef = doc(db, 'users', user.uid);
				const studentDoc = await getDoc(studentRef);
				const eventPreferences = studentDoc.data().eventPreferences;
				if (eventPreferences) {
					resolve(eventPreferences.map((preference) => preference.uid));
				} else {
					// Return empty array if no preferences selected
					resolve([]);
				}
			});
		});
	}

	async function loadMoreEvents() {
		if (studentEventPreference.length === 0) {
			noMoreEvents = true;
			return;
		}
		// Firestore
		const ecaPostRef = collection(db, 'ecaPosts');
		let ecaPostQuery = query(
			ecaPostRef,
			orderBy('creationDate', 'desc'),
			where('selectedCategoriesUid', 'array-contains-any', studentEventPreference),
			limit(loadCount)
		);

		if (lastVisible) {
			ecaPostQuery = query(
				ecaPostRef,
				orderBy('creationDate', 'desc'),
				where('selectedCategoriesUid', 'array-contains-any', studentEventPreference),
				startAfter(lastVisible),
				limit(loadCount)
			);
		}

		const ecaPostSnapshot = await getDocs(ecaPostQuery);

		// Create an array of promises for each document in the snapshot
		const promises = ecaPostSnapshot.docs.map(async (postDoc) => {
			const orgUID = postDoc.data().orgUidFk;
			const orgRef = doc(db, 'users', orgUID);
			const orgSnapshot = await getDoc(orgRef);
			// console.log(orgSnapshot.data());

			return { ...postDoc.data(), uid: postDoc.id, organizer: orgSnapshot.data() };
		});
		// Wait for all promises to resolve
		const newEcaPosts = await Promise.all(promises);

		if (newEcaPosts.length > 0) {
			ecaPosts = [...ecaPosts, ...newEcaPosts];
			lastVisible = ecaPostSnapshot.docs[ecaPostSnapshot.docs.length - 1];
		}
		console.log(newEcaPosts.length);
		return newEcaPosts.length;
	}

	async function onScroll(e) {
		const { scrollTop, clientHeight, scrollHeight } = e.target;

		if (scrollTop + clientHeight >= scrollHeight && !isLoading && !noMoreEvents) {
			// Clear the existing debounce timeout
			clearTimeout(debounceTimeout);

			// Set a new debounce timeout
			debounceTimeout = setTimeout(async () => {
				isLoading = true;
				const eventsLoaded = await loadMoreEvents();
				isLoading = false;
				scrollContainer.scrollTop = scrollHeight - clientHeight - 25;

				console.log(eventsLoaded);
				if (eventsLoaded === 0) {
					noMoreEvents = true;
				}
			}, 500);
		}
	}

	$: console.log(ecaPosts);
</script>

<div
	class="scroll-container"
	bind:this={scrollContainer}
	on:scroll={onScroll}
	style="height: 100%; overflow-y: auto;"
>
	{#each ecaPosts as post}
		<Post {post} />
	{/each}

	{#if isLoading}
		<CenteredSpinner isFullHeight={false} />
	{/if}

	{#if noMoreEvents}
		<p class="text-muted text-center">No more events for now....</p>
	{/if}
</div>

<style>
</style>
