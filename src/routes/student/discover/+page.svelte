<script>
	import { TabContent, TabPane } from 'sveltestrap';
	import CenteredSpinner from '../../../lib/components/general/CenteredSpinner.svelte';
	import { onMount } from 'svelte';
	import { onAuthStateChanged } from 'firebase/auth';
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
	import { customDateFormat } from '$lib/utils.js';
	import { auth, db, storage } from '$lib/Firebase';
	import { collection, doc, getDocs, setDoc, Timestamp } from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import { ROUTES } from '../../../lib/routelist';

	const PAGE_STATES = Object.freeze({ details: 1, loading: 2 });

	let currentPageState = PAGE_STATES.loading;

	let registeredEvents = [];

	let studentUID;

	onMount(async () => {
		onAuthStateChanged(auth, async (user) => {
			studentUID = user.uid;

			// Get a reference to the student's user document and registeredEvents subcollection
			const studentRef = doc(db, 'users', studentUID);
			const registeredEventsRef = collection(studentRef, 'registeredEvents');

			// Query the registeredEvents subcollection
			const registeredEventsSnapshot = await getDocs(registeredEventsRef);

			// Iterate through the query results and retrieve event data
			registeredEventsSnapshot.forEach((doc) => {
				const registeredEventData = doc.data();
				registeredEvents.push(registeredEventData);
			});

			console.log(registeredEvents);
			currentPageState = PAGE_STATES.details;
		});
	});
</script>

{#if currentPageState === PAGE_STATES.loading}
	<CenteredSpinner />
{:else}
	<TabContent class="nav-fill">
		<TabPane tabId="registered" tab="Registered" active>
			{#each registeredEvents as event}
				<Card class="my-2 mx-2">
					<CardHeader class="d-flex flex-row justify-content-between">
						<CardTitle class="my-2 fs-6">{event.title}</CardTitle>
						<Nav>
							<NavLink href={`${ROUTES.feed}/${event.ecaPostUidFk}`} class="px-0"
								>View Details</NavLink
							>
						</Nav>
					</CardHeader>
					<CardBody>
						<CardText class="m-0 text-secondary"
							>{customDateFormat(event.startDatetime.toDate())}</CardText
						>
						<CardText class="text-secondary">{event.location}</CardText>
					</CardBody>
					<!-- <CardFooter class="d-flex flex-row justify-content-end">
						<Button
							class="me-2"
							color="primary"
							outline
							on:click={() => {
								goto(`${ROUTES.orgDashboard}/${event.uid}`);
							}}>Edit</Button
						>
						<Button color="primary">Delete</Button>
					</CardFooter> -->
				</Card>
			{/each}
		</TabPane>
		<TabPane tabId="search" tab="Search">search</TabPane>
	</TabContent>
{/if}
