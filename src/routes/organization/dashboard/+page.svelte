<script>
	import { signout } from '$lib/auth';
	import { customDateFormat } from '../../../lib/utils';
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
		Icon,
		FormGroup,
		Dropdown,
		DropdownItem,
		DropdownMenu,
		DropdownToggle
	} from 'sveltestrap';
	import { auth, db, storage } from '$lib/Firebase';
	import { collection, doc, addDoc, getDocs, onSnapshot, where, query } from 'firebase/firestore';
	import { onAuthStateChanged } from 'firebase/auth';
	import { onMount } from 'svelte';
	import { ROUTES } from '../../../lib/routelist';
	import CenteredSpinner from '../../../lib/components/general/CenteredSpinner.svelte';
	import { goto } from '$app/navigation';

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
	});

	// function handleDropdownToggleClick(event) {
	// 	event.preventDefault();
	// }
</script>

<h4>Your Events</h4>
{#if isLoading}
	<CenteredSpinner />
{:else}
	{#each ecaPosts as ecaPost}
		<Card class="mb-2">
			<CardHeader class="d-flex flex-row justify-content-between">
				<CardTitle class="my-2 fs-6">{ecaPost.title}</CardTitle>
				<!-- <Dropdown>
					<DropdownToggle color="none" class="px-0">
						<Icon name="three-dots-vertical" />
					</DropdownToggle>
					<DropdownMenu end>
						<DropdownItem href={`${ROUTES.orgDashboard}/${ecaPost.uid}`}>View Details</DropdownItem>
						<DropdownItem class="text-danger">Delete</DropdownItem>
					</DropdownMenu>
				</Dropdown> -->
			</CardHeader>
			<CardBody>
				<CardText class="m-0 text-muted"
					>{customDateFormat(ecaPost.startDatetime.toDate())}</CardText
				>
				<CardText class="text-muted">{ecaPost.location}</CardText>
			</CardBody>
			<CardFooter class="d-flex flex-row justify-content-end">
				<Button
					class="me-2"
					color="primary"
					outline
					on:click={() => {
						goto(`${ROUTES.orgDashboard}/${ecaPost.uid}`);
					}}>Edit</Button
				>
				<Button color="primary">Delete</Button>
			</CardFooter>
		</Card>
	{/each}
{/if}
