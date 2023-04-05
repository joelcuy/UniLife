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

	let dispatch = createEventDispatcher();

	let files = [];
	function handleFileUpload(event) {
		const newFiles = Array.from(event.target.files);
		// Ensure files are not overwritten but appended
		files = [...files, ...newFiles];
	}

	function removeImage(index) {
		files.splice(index, 1);
		files = [...files];
	}

	$: if (files) {
		dispatch('imageUpload', {
			files
		});
	}
</script>

<Input
	type="file"
	name="file"
	id="imageUpload"
	multiple
	accept="image/*"
	on:change={handleFileUpload}
	class="custom-file-input"
/>
<FormText color="muted">
	Total files selected: {files.length}
</FormText>
<div class="image-preview">
	{#each files as file, index}
		<div class="image-container">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<img src={URL.createObjectURL(file)} alt={file.name} title="Click to remove" />
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<span class="remove-icon" on:click={() => removeImage(index)}>
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
		max-width: 40vw;
		max-height: 10vh;
		/* margin-right: 0.5rem; */
		cursor: pointer;
	}
</style>
