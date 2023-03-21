<script>
	import CustomCard from '../../lib/components/CustomCard.svelte';
	import {
		Icon,
		Form,
		FormGroup,
		Input,
		Label,
		Button,
		Spinner,
		Alert,
		NavLink,
		Nav
	} from 'sveltestrap';
	import { app, auth } from '../../lib/Firebase';
	import { createEventDispatcher } from 'svelte';
	import { getFirestore, doc, setDoc, getDoc, addDoc, collection } from 'firebase/firestore';
	import { ROUTES } from '../../lib/routelist';
	import { goto } from '$app/navigation';

	// Initialize Cloud Firestore and get a reference to the service
	const db = getFirestore(app);

	let email;
	let orgName;
	let about;
	// let docRef;
	const PAGE_STATES = Object.freeze({ form: 1, loading: 2, complete: 3 });
	let currentPageState = PAGE_STATES.form;

	async function submitOrganizationRequest() {
		// Create a timestamp using the Date object
		const timestamp = new Date().toISOString();
		console.log(timestamp);
		try {
			currentPageState = PAGE_STATES.loading;
			let docRef = await addDoc(collection(db, 'organizationRequests'), {
				email: email,
				orgName: orgName,
				about: about,
				requestStatus: "Pending",
				requestDate: timestamp,
			});
			console.log('Org Request document written with ID: ', docRef.id);
			currentPageState = PAGE_STATES.complete;
			// TODO Show success
		} catch (error) {
			console.error('Error writing document to Firestore:', error);
		}
	}
</script>

<!-- TODO Check if email is duplicated with student -->
<!-- TODO Input validation-->
<Nav>
	<NavLink href={ROUTES.login}><Icon name="arrow-left" /> Back</NavLink>
</Nav>
<div class="page-container">
	<CustomCard>
		<h3>Request Organization Account</h3>
		{#if currentPageState === PAGE_STATES.form}
			<Form>
				<FormGroup>
					<Label for="orgName">Organization Name</Label>
					<Input
						type="text"
						name="orgName"
						id="orgName"
						placeholder="e.g. UoN Volleyball Club"
						bind:value={orgName}
					/>
				</FormGroup>
				<FormGroup>
					<Label for="email">Email</Label>
					<Input
						type="email"
						name="email"
						id="email"
						placeholder="Email for account creation"
						bind:value={email}
					/>
				</FormGroup>
				<FormGroup>
					<Label for="about">About</Label>
					<Input
						type="textarea"
						name="about"
						id="about"
						rows="4"
						placeholder="Write a little bit about your organization here"
						bind:value={about}
					/>
				</FormGroup>
				<FormGroup>
					<Button
						color="primary"
						disabled={currentPageState === PAGE_STATES.loading}
						block
						on:click={submitOrganizationRequest}>Submit</Button
					>
				</FormGroup>
			</Form>
		{:else if currentPageState === PAGE_STATES.loading}
			loading...
		{:else if currentPageState === PAGE_STATES.complete}
			Request submitted successfully
		{/if}
	</CustomCard>
</div>

<style>
	.page-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		justify-content: center;
	}
</style>
