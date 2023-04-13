<script>
	import Post from './Post.svelte';
	import { auth, app, db } from '$lib/Firebase';
	import { onMount, afterUpdate, onDestroy } from 'svelte';
	import {
		getFirestore,
		collection,
		query,
		where,
		getDocs,
		doc,
		setDoc,
		getDoc,
		onSnapshot
	} from 'firebase/firestore';
	import CenteredSpinner from '../../../lib/components/general/CenteredSpinner.svelte';

	let isLoading = true;
	let ecaPosts = [];
	onMount(async () => {
		const ecaPostRef = collection(db, 'ecaPosts');

		const ecaPostSnapshot = await getDocs(ecaPostRef);

		// Create an array of promises for each document in the snapshot
		const promises = ecaPostSnapshot.docs.map(async (postDoc) => {
			const orgUID = postDoc.data().orgUidFk;
			const orgRef = doc(db, 'users', orgUID);
			const orgSnapshot = await getDoc(orgRef);
			// console.log(orgSnapshot.data());

			return { ...postDoc.data(), uid: postDoc.id, organizer: orgSnapshot.data() };
		});

		// Wait for all promises to resolve
		ecaPosts = await Promise.all(promises);

		console.log(ecaPosts);
		isLoading = false;

		// ecaPostSnapshot.forEach(async (postDoc) => {
		// 	const orgUID = postDoc.data().orgUidFk;
		// 	const orgRef = doc(db, 'users', orgUID);
		// 	const orgSnapshot = await getDoc(orgRef);
		// 	// console.log(orgSnapshot.data());

		// 	ecaPosts.push({ ...postDoc.data(), uid: postDoc.id, organizer: orgSnapshot.data() });
		// });

		// console.log(ecaPosts);
		// isLoading = false;
	});
</script>

{#if isLoading}
	<CenteredSpinner />
{:else}
	{#each ecaPosts as post}
		<Post {post} />
	{/each}
{/if}

<style>
</style>
