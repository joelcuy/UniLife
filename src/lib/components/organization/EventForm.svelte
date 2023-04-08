<script>
	import CustomImageUpload from '../general/CustomImageUpload.svelte';
	import { FormGroup, FormText, Button, Form, Label, Alert, Input } from 'sveltestrap';
	import { db } from '$lib/Firebase';
	import { onMount } from 'svelte';
	import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
	import { createEventDispatcher } from 'svelte';
	import { checkEmptyValues } from '$lib/auth';
	import CenteredSpinner from '../general/CenteredSpinner.svelte';

	const PAGE_STATES = Object.freeze({ form: 1, loading: 2, complete: 3 });

	let currentPageState = PAGE_STATES.loading;

	export let isEditing = false;
	export let formData;

	let ecaCategories = [];

	let isError = false;
	let errorMessage = '';

	let title = undefined;
	let description = undefined;
	let location = undefined;
	let selectedCategories = undefined;
	let startDatetime = undefined;
	let endDatetime = undefined;
	let existingImages = [];
	let uploadPostImages = [];
	let deletePostImages = [];
	let dispatch = createEventDispatcher();

	onMount(async () => {
		if (formData) {
			// console.log(formData);
			title = formData.title;
			description = formData.description;
			location = formData.location;
			existingImages = formData.images;
		}
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
			['Description', description],
			['Location', location],
			['Event Categories', selectedCategories],
			// ['Post Image', uploadPostImage],
			['Start Datetime', startDatetime],
			['End Datetime', endDatetime]
		);
		if (validationResult.isError) {
			isError = true;
			errorMessage = validationResult.message;
			throw new Error(validationResult.message);
		} else {
			dispatch('save', {
				title: title,
				description: description,
				location: location,
				selectedCategories: selectedCategories,
				uploadPostImages: uploadPostImages,
				deletePostImages: deletePostImages,
				startDatetime: startDatetime,
				endDatetime: endDatetime
			});
		}
	}

	function handleCancel() {
		dispatch('cancel');
	}

	function handleSelect(event) {
		const selectElement = event.target;
		const selectedOption = selectElement.options[selectElement.selectedIndex];
		const selectedValue = selectedOption.value;
		const selectedLabel = selectedOption.textContent;
		// console.log('Selected value:', selectedValue);
		// console.log('Selected label:', selectedLabel);
		selectedCategories = { uid: selectedValue, name: selectedLabel }; // logs the selected value
	}

	function imageSelect(event) {
		uploadPostImages = event.detail.imagesToUpload; // logs the selected value
		deletePostImages = event.detail.imagesToDelete;
		console.log(deletePostImages);
		// console.log(postImages);
	}

	// $: console.log(selectedCategoryId);
	// $: console.log(formData.selectedCategories.uid);
</script>

{#if currentPageState === PAGE_STATES.loading}
	<CenteredSpinner />
{:else if currentPageState === PAGE_STATES.form}
	<Alert color="danger" bind:isOpen={isError}>
		{errorMessage}
	</Alert>
	<Form>
		<FormGroup>
			<Label class="font-weight-bold" for="name">Title</Label>
			<Input
				type="text"
				name="name"
				id="name"
				placeholder="Be clear and descriptive"
				bind:value={title}
			/>
		</FormGroup>
		<FormGroup>
			<Label class="font-weight-bold" for="description">Description</Label>
			<Input
				type="textarea"
				name="description"
				id="description"
				placeholder="Additional details about your event"
				bind:value={description}
			/>
		</FormGroup>
		<FormGroup>
			<Label class="font-weight-bold" for="location">Location</Label>
			<Input
				type="text"
				name="location"
				id="location"
				placeholder="Eg: Online"
				bind:value={location}
			/>
		</FormGroup>
		<FormGroup>
			<Label for="category">Category</Label>
			<Input type="select" name="select" id="category" on:change={handleSelect}>
				{#each ecaCategories as category}
					<option value={category.uid}>{category.name}</option>
				{/each}
				<!-- <option>qwer</option>
				<option selected>qwtwert</option>
				<option>xcbvxcvb</option> -->
			</Input>
			<FormText color="muted">Categories help us improve discoverability of your event</FormText>
		</FormGroup>
		<FormGroup>
			<Label for="imageUpload" class="custom-file-label">Images (Maximum 5 Images)</Label>
			<CustomImageUpload {existingImages} on:imageSelect={imageSelect} />
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
		<!-- <div class={isEditing ? 'd-flex justify-content-between align-items-center' : ''}> -->
		<FormGroup
			class={isEditing ? 'd-flex justify-content-between align-items-center w-100 mt-4' : ''}
		>
			{#if isEditing}
				<Button class="me-4" outline block color="primary" on:click={handleCancel}>Cancel</Button>
			{/if}
			<Button color="primary" id="login-button" block on:click={handleClickSave}>Save</Button>
		</FormGroup>
		<!-- </div> -->
	</Form>
{/if}

<style>
</style>
