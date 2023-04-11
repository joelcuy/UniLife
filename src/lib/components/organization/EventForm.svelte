<script>
	import CustomImageUpload from '../general/CustomImageUpload.svelte';
	import { FormGroup, FormText, Button, Form, Label, Alert, Input } from 'sveltestrap';
	import { db } from '$lib/Firebase';
	import { onMount } from 'svelte';
	import {
		collection,
		getFirestore,
		doc,
		setDoc,
		getDocs,
		getDoc,
		query,
		orderBy
	} from 'firebase/firestore';
	import { createEventDispatcher } from 'svelte';
	import { checkEmptyValues } from '$lib/auth';
	import CenteredSpinner from '../general/CenteredSpinner.svelte';
	import { firestoreTimestampToDatetimeLocal } from '../../utils';
	import EventCategoryModal from '$lib/components/general/EventCategoryModal.svelte';

	// Controls page states
	const PAGE_STATES = Object.freeze({ form: 1, loading: 2, complete: 3 });
	let currentPageState = PAGE_STATES.loading;

	export let isEditing = false;
	export let formData;

	// For alert
	let isError = false;
	let errorMessage = '';

	// For Modal
	let open = false;
	const toggleAlways = () => {
		open = true;
	};

	let title = undefined;
	let description = undefined;
	let location = undefined;
	let selectedCategories = [];
	let startDatetime = undefined;
	let endDatetime = undefined;

	let existingImages = []; //Images already in cloud
	let uploadPostImages = []; //Images to post to cloud
	let deletePostImages = []; //Images to delete from cloud

	let dispatch = createEventDispatcher();

	onMount(async () => {
		if (formData) {
			// console.log(formData);
			title = formData.title;
			description = formData.description;
			location = formData.location;
			selectedCategories = formData.selectedCategories;
			startDatetime = firestoreTimestampToDatetimeLocal(formData.startDatetime);
			endDatetime = firestoreTimestampToDatetimeLocal(formData.endDatetime);
			// Initialize images that were previously uploaded
			existingImages = formData.images;
		}
		currentPageState = PAGE_STATES.form;
	});

	function handleClickSave() {
		console.log(startDatetime);
		const validationResult = checkEmptyValues(
			['Title', title],
			['Description', description],
			['Location', location],
			['Event Categories', selectedCategories],
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
				startDatetime: startDatetime,
				endDatetime: endDatetime,
				uploadPostImages: uploadPostImages,
				deletePostImages: deletePostImages
			});
		}
	}

	function handleCancel() {
		dispatch('cancel');
	}

	function imageSelect(event) {
		uploadPostImages = event.detail.imagesToUpload;
		deletePostImages = event.detail.imagesToDelete;
		console.log(uploadPostImages);
		console.log(deletePostImages);
	}
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
			<div class="mb-2">
				{#if selectedCategories.length === 0}
					<p class="text-muted">None selected</p>
				{/if}
				{#each selectedCategories as category}
					<!-- <Badge color="secondary">{category.name}</Badge> -->
					<Button disabled size="sm" class="me-2 mb-2">{category.name}</Button>
				{/each}
			</div>
			<Button outline block color="primary" on:click={toggleAlways}>Edit</Button>
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

<EventCategoryModal bind:isOpen={open} bind:selectedCategories />

<style>
</style>
