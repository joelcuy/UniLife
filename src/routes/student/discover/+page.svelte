<script>
	import { Input, Label, TabContent, TabPane } from 'sveltestrap';
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
	import { collection, doc, getDocs, query, orderBy, where } from 'firebase/firestore';
	import { goto } from '$app/navigation';
	import { ROUTES } from '../../../lib/routelist';

	const PAGE_STATES = Object.freeze({ details: 1, loading: 2 });

	let currentPageState = PAGE_STATES.loading;

	let registeredEvents = [];
	let studentUID;

	let ecaPostSnapshot;
	let searchTerm = '';
	let eventSearchResults = [];

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

			// console.log(registeredEvents);
			const ecaPostRef = collection(db, 'ecaPosts');
			ecaPostSnapshot = await getDocs(ecaPostRef);

			currentPageState = PAGE_STATES.details;
		});
	});

	function containsSearchTerm(str, searchTerm) {
		return str.toLowerCase().includes(searchTerm.toLowerCase());
	}

	async function searchEvents() {
		if (searchTerm.trim() !== '') {
			console.log(ecaPostSnapshot.docs);
			// Filter documents client-side to match the case-insensitive searchTerm
			const filteredDocs = ecaPostSnapshot.docs.filter((doc) =>
				containsSearchTerm(doc.data().title, searchTerm)
			);

			console.log(filteredDocs);

			eventSearchResults = filteredDocs.map((doc) => doc.data());

			// ... proceed with the rest of your logic, using filteredDocs instead of ecaPostSnapshot.docs
		} else {
			eventSearchResults = [];
		}
	}

	$: searchEvents(searchTerm);
</script>

<div class="px-3 pt-3">
	{#if currentPageState === PAGE_STATES.loading}
		<CenteredSpinner />
	{:else}
		<TabContent class="nav-fill">
			<TabPane tabId="registered" active>
				<span slot="tab">
					<Icon name="calendar-check" /> Registered
				</span>
				{#each registeredEvents as event}
					<Card class="my-2">
						<CardHeader class="d-flex flex-row justify-content-between">
							<CardTitle class="my-2 fs-6">{event.title}</CardTitle>
							<Nav>
								<NavLink href={`${ROUTES.feed}/${event.ecaPostUidFk}`} class="px-0"
									>View Details</NavLink
								>
							</Nav>
						</CardHeader>
						<CardBody>
							<CardText class="m-0 text-muted"
								>{customDateFormat(event.startDatetime.toDate())}</CardText
							>
							<CardText class="text-muted">{event.location}</CardText>
						</CardBody>
					</Card>
				{/each}
				{#if registeredEvents.length === 0}
					<p class="text-muted text-center mt-3">No Events to Display</p>
				{/if}
			</TabPane>
			<TabPane tabId="search">
				<span slot="tab">
					<Icon name="search" /> Search
				</span>
				<FormGroup class="mt-2">
					<Input
						type="text"
						name="search"
						id="search"
						placeholder="Search for events..."
						bind:value={searchTerm}
					/>
				</FormGroup>
				<div class="search-results">
					{#each eventSearchResults as event}
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
								<CardText class="m-0 text-muted"
									>{customDateFormat(event.startDatetime.toDate())}</CardText
								>
								<CardText class="text-muted">{event.location}</CardText>
							</CardBody>
						</Card>
					{/each}
					{#if eventSearchResults.length === 0}
						<p class="text-muted text-center">No Events to Display</p>
					{/if}
				</div>
			</TabPane>
		</TabContent>
	{/if}
</div>
