<script>
	import {
		FormGroup,
		Button,
		Form,
		Label,
		DropdownItem,
		DropdownMenu,
		DropdownToggle,
		Dropdown,
		Input
	} from 'sveltestrap';
	import { getStores } from '$app/stores';
	import { app, auth, db } from '$lib/Firebase';
	import { onMount } from 'svelte';
	import { signOut, onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { collection, doc, addDoc, getDoc, onSnapshot, Timestamp } from 'firebase/firestore';
	import { ROUTES } from '$lib/routelist';
	import { page } from '$app/stores';

	let title;
	let selectedCategories;
	let startDatetime;
	let endDatetime;

	// let isLoading = true;
	let ecaCategories = [];

	const PAGE_STATES = Object.freeze({ form: 1, loading: 2, complete: 3 });

	let currentPageState = PAGE_STATES.loading;

	onMount(async () => {
		onSnapshot(collection(db, 'ecaCategory'), (collectionSnapshot) => {
			ecaCategories = [];
			collectionSnapshot.forEach((doc) => {
				// console.log(doc.id, ' => ', doc.data());
				ecaCategories.push({ ...doc.data() });
			});
			// console.log(ecaCategories);
			// isLoading = false;
			currentPageState = PAGE_STATES.form;
		});
	});

	async function handleCreateEvent() {
		// console.log(title);
		// console.log(selectedCategories);
		// console.log(startDatetime);
		// console.log(endDatetime);
		try {
			const timestamp = new Date().toISOString();
			startDatetime = new Date(`${startDatetime}:00.000Z`).toISOString();
			endDatetime = new Date(`${endDatetime}:00.000Z`).toISOString();
			const postRef = await addDoc(collection(db, 'ecaPosts'), {
				title: title,
				selectedCategories: selectedCategories,
				startDatetime: startDatetime,
				endDatetime: endDatetime,
				creationDate: timestamp
			});
			// await setDoc(postRef, {});
			console.log('ECA Post document wrtten with ID: ', postRef.id);
			// goto(ROUTES.profile);
		} catch (error) {
			console.error('Error appending eca post data to Firestore:', error);
		}
	}

	async function handleSelect(event) {
		selectedCategories = event.target.value; // logs the selected value
	}
</script>

{#if currentPageState === PAGE_STATES.loading}
	Loading...
{:else if currentPageState === PAGE_STATES.form}
	<h1>Create New Event</h1>
	<br />
	<Form>
		<FormGroup>
			<Label class="font-weight-bold" for="name">Title</Label>
			<Input type="text" name="name" id="name" bind:value={title} />
		</FormGroup>
		<FormGroup>
			<Label for="category">Category</Label>
			<Input type="select" name="select" id="category" on:change={handleSelect}>
				{#each ecaCategories as category}
					<option value={category.uid}>{category.name}</option>
				{/each}
			</Input>
		</FormGroup>
		<FormGroup>
			<Label for="startDatetime">Event Start</Label>
			<Input
				type="datetime-local"
				name="datetime"
				id="startDatetime"
				placeholder="datetime placeholder"
				bind:value={startDatetime}
			/>
		</FormGroup>
		<FormGroup>
			<Label for="endDatetime">Event End</Label>
			<Input
				type="datetime-local"
				name="datetime"
				id="endDatetime"
				placeholder="datetime placeholder"
				bind:value={endDatetime}
			/>
		</FormGroup>
		<FormGroup>
			<Button color="primary" id="login-button" block on:click={handleCreateEvent}>Create</Button>
		</FormGroup>
	</Form>
{:else if currentPageState === PAGE_STATES.complete}
	doneeeeeeeee
{/if}

<style>
</style>
