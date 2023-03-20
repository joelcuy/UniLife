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
		NavLink
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
	let docRef;
	let isLoading = false;

	async function submitOrganizerRequest() {
		try {
			docRef = await addDoc(collection(db, 'organizerRequests'), {
				email: email,
				orgName: orgName,
				about: about,
				approved: false
			});
			console.log('Org Request document written with ID: ', docRef.id);
			// TODO Show success
		} catch (error) {
			console.error('Error writing document to Firestore:', error);
		}
	}
</script>

<!-- TODO Send user to success page -->
<!-- TODO Check if email is duplicated with student -->
<!-- TODO Input validation-->
<Button
	outline
	color="primary"
	on:click={() => {
		goto(ROUTES.signup);
	}}
>
	<Icon name="arrow-left" />
	Back
</Button>
<div class="page-container">
	<CustomCard>
		<h3>Request Organization Account</h3>
		{#if !docRef}
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
						placeholder="This will be the email tied to this organization account"
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
					<Button color="primary" disabled={isLoading} block on:click={submitOrganizerRequest}
						>Submit</Button
					>
				</FormGroup>
			</Form>
		{:else}
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
