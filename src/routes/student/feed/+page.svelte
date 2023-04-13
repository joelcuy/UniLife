<script>
	import Post from '$lib/components/student/Post.svelte';
	import { db } from '$lib/Firebase';
	import { onMount, onDestroy } from 'svelte';
	import {
		collection,
		getDocs,
		doc,
		getDoc,
		query,
		orderBy,
		limit,
		startAfter
	} from 'firebase/firestore';
	import CenteredSpinner from '$lib/components/general/CenteredSpinner.svelte';

	let isLoading = false;
	let ecaPosts = [];

	// let page = 1;
	let lastVisible = null;
	const loadCount = 3;

	onMount(async () => {
		loadMoreEvents();
	});

	async function loadMoreEvents() {
		console.log('function triggered');
		if (isLoading) return;
		isLoading = true;

		// Firestore
		const ecaPostRef = collection(db, 'ecaPosts');
		let ecaPostQuery = query(ecaPostRef, orderBy('creationDate', 'desc'), limit(loadCount)); // Replace 'createdAt' with the field you want to order by
		// const ecaPostSnapshot = await getDocs(ecaPostRef);

		if (lastVisible) {
			ecaPostQuery = query(
				ecaPostRef,
				orderBy('creationDate', 'desc'),
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
		isLoading = false;
	}

	function onScroll(e) {
		const { scrollTop, clientHeight, scrollHeight } = e.target;
		if (scrollTop + clientHeight >= scrollHeight - 10) {
			loadMoreEvents();
		}
	}
</script>

<div class="scroll-container" on:scroll={onScroll} style="height: 100%; overflow-y: auto;">
	{#each ecaPosts as post}
		<Post {post} />
	{/each}

	{#if isLoading}
		<CenteredSpinner />
	{:else}
		<p class="text-center text-muted">No more posts</p>
	{/if}
</div>

<style>
</style>
