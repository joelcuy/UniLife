<script>
	import { signout } from '$lib/auth';
	import {
		Button,
		Card,
		CardBody,
		CardFooter,
		CardHeader,
		CardSubtitle,
		CardText,
		CardTitle,
		Nav,
		NavLink,
		FormGroup
	} from 'sveltestrap';
	import { auth, db, storage } from '$lib/Firebase';
	import { collection, doc, addDoc, getDocs, onSnapshot, where, query } from 'firebase/firestore';
	import { onAuthStateChanged } from 'firebase/auth';
	import { onMount } from 'svelte';

	let isLoading = true;
	let ecaPosts = [];

	onMount(async () => {
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

		const q = query(collection(db, 'ecaPosts'), where('orgUidFk', '==', userUID));

		const querySnapshot = await getDocs(q);
		ecaPosts = [];
		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			console.log(doc.id, ' => ', doc.data());
			ecaPosts.push({ ...doc.data(), uid: doc.id });
		});
		isLoading = false;

		// onSnapshot(
		// 	collection(db, 'ecaPosts'),
		// 	where('orgUidFk', '==', userUID),
		// 	(collectionSnapshot) => {
		// 		ecaPosts = [];
		// 		collectionSnapshot.forEach((doc) => {
		// 			// doc.data() is never undefined for query doc snapshots
		// 			console.log(doc.id, ' => ', doc.data());
		// 			ecaPosts.push({ ...doc.data(), uid: doc.id });
		// 		});
		// 		// console.log(orgRequests);
		// 		isLoading = false;
		// 	}
		// );
	});
</script>

<h4>Your Events</h4>
{#if isLoading}
	Loading...
{:else}
	{#each ecaPosts as ecaPost}
		<Card>
			<CardHeader class="d-flex flex-row justify-content-between">
				<CardTitle class="my-2">{ecaPost.title}</CardTitle>
				<Nav>
					<NavLink href="#" class="px-0">View Details</NavLink>
				</Nav>
			</CardHeader>
			<CardBody>
				<!-- <CardSubtitle>Email</CardSubtitle>
				<CardText>{ecaPost.email}</CardText>
				<CardSubtitle>About</CardSubtitle>
				<CardText>{ecaPost.about}</CardText> -->
			</CardBody>
			<CardFooter class="d-flex flex-row justify-content-end">
				<!-- {#if ecaPost.requestStatus === 'Pending'}
					<Button class="me-2" color="primary" on:click={() => {}}>Approve</Button>
					<Button color="primary" outline>Reject</Button>
				{:else}
					{ecaPost.requestStatus.charAt(0).toUpperCase() + ecaPost.requestStatus.slice(1)}
				{/if} -->
			</CardFooter>
		</Card>
	{/each}
{/if}

<FormGroup>
	<Button color="primary" id="login-button" block on:click={signout}>SignOut</Button>
</FormGroup>
