<script>
	import CustomImageUpload from '../general/CustomImageUpload.svelte';
	import { FormGroup, Button, Form, Label, Alert, Input } from 'sveltestrap';
	import { db } from '$lib/Firebase';
	import { onMount } from 'svelte';
	import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
	import { createEventDispatcher } from 'svelte';
	import { checkEmptyValues } from '$lib/auth';

	const PAGE_STATES = Object.freeze({ form: 1, loading: 2, complete: 3 });

	let currentPageState = PAGE_STATES.loading;

	let ecaCategories = [];

	let isError = false;
	let errorMessage = '';

	let title = undefined;
	let selectedCategories = undefined;
	let startDatetime = undefined;
	let endDatetime = undefined;
	let postImages = [];
	let dispatch = createEventDispatcher();

	onMount(async () => {
		onSnapshot(collection(db, 'ecaCategory'), (collectionSnapshot) => {
			ecaCategories = [];
			collectionSnapshot.forEach((doc) => {
				// console.log(doc.id, ' => ', doc.data());
				ecaCategories.push({ ...doc.data() });
			});
			// console.log(ecaCategories);
			currentPageState = PAGE_STATES.form;
		});
	});

	function handleClickSave() {
		const validationResult = checkEmptyValues(
			['Title', title],
			['Event Categories', selectedCategories],
			['Start Datetime', startDatetime],
			['End Datetime', endDatetime],
			['Post Image', postImages]
		);
		if (validationResult.isError) {
			isError = true;
			errorMessage = validationResult.message;
			throw new Error(validationResult.message);
		} else {
			dispatch('save', {
				title: title,
				selectedCategories: selectedCategories,
				startDatetime: startDatetime,
				endDatetime: endDatetime,
				postImages: postImages
			});
		}
	}

	function handleSelect(event) {
		selectedCategories = event.target.value; // logs the selected value
	}

	function handleUpload(event) {
		postImages = event.detail.files; // logs the selected value
		// console.log(postImages);
	}
</script>

{#if currentPageState === PAGE_STATES.loading}
	Loading...
{:else if currentPageState === PAGE_STATES.form}
	<Alert color="danger" bind:isOpen={isError}>
		{errorMessage}
	</Alert>
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
			<Label for="imageUpload" class="custom-file-label">Image Upload</Label>
			<CustomImageUpload on:imageUpload={handleUpload} />
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
			<Button color="primary" id="login-button" block on:click={handleClickSave}>Save</Button>
		</FormGroup>
	</Form>
{/if}

<style>
</style>
