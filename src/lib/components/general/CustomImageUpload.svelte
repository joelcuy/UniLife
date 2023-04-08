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
		FormText,
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
	import { createEventDispatcher } from 'svelte';

	export let existingImages = [];
	let imagesToDelete = [];

	let imagesToUpload = [];
	let dispatch = createEventDispatcher();

	function handleFileSelection(event) {
		const newSelectionImages = Array.from(event.target.files);
		// Ensure files are not overwritten but appended
		imagesToUpload = [...imagesToUpload, ...newSelectionImages];
		imagesToUpload.splice(5, imagesToUpload.length - 5);
	}

	function removeImage(index, isNew) {
		if (isNew) {
			imagesToUpload.splice(index, 1);
			imagesToUpload = [...imagesToUpload];
		} else {
			console.log('Remove:', existingImages[index]);
			imagesToDelete.push(existingImages[index]);
			imagesToDelete = [...imagesToDelete];
			existingImages.splice(index, 1);
			existingImages = [...existingImages];
			// imagesToDelete.push(existingImages[index]);
		}
	}

	$: {
		dispatch('imageSelect', {
			imagesToUpload: imagesToUpload,
			imagesToDelete: imagesToDelete
		});
	}
</script>

<Input
	type="file"
	name="file"
	id="imageUpload"
	multiple
	disabled={imagesToUpload.length + existingImages.length >= 5 ? true : false}
	accept="image/*"
	on:change={handleFileSelection}
	class="custom-file-input"
/>
<FormText color="muted">
	Total files selected: {imagesToUpload.length + existingImages.length}
</FormText>
<div class="image-preview">
	{#each existingImages as image, index}
		<div class="image-container">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<img src={image.URL} alt={image.filePath} title="Click to remove" />
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<span class="remove-icon" on:click={() => removeImage(index, false)}>
				<i class="fas fa-times" />
			</span>
		</div>
	{/each}
	{#each imagesToUpload as image, index}
		<div class="image-container">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<img src={URL.createObjectURL(image)} alt={image.name} title="Click to remove" />
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<span class="remove-icon" on:click={() => removeImage(index, true)}>
				<i class="fas fa-times" />
			</span>
		</div>
	{/each}
</div>

<style>
	.remove-icon {
		font-size: 1.5rem;
		color: white;
		position: absolute;
		top: 0;
		right: 0.5rem;
		cursor: pointer;
	}

	.image-container {
		position: relative;
		display: inline-block;
		margin-right: 0.5rem;
	}

	.image-preview {
		display: flex;
		overflow-x: auto;
		white-space: nowrap;
	}

	.image-preview img {
		max-width: 45vw;
		max-height: 15vh;
		/* margin-right: 0.5rem; */
		cursor: pointer;
	}
</style>
