<script>
	import {
		FormGroup,
		Button,
		Form,
		Label,
		Input,
		FormText,
		ButtonGroup,
		Icon,
		Modal,
		ModalBody,
		ModalFooter,
		ModalHeader,
		ListGroup,
		ListGroupItem
	} from 'sveltestrap';
	import { app, auth, db } from '$lib/Firebase';
	import { onMount } from 'svelte';
	import { getDocs, query, collection, orderBy } from 'firebase/firestore';

	export let isOpen;
	export let selectedCategories = [];

	let ecaCategories;

	let isLoading = true;

	// For Modal
	const toggle = () => {
		// fullscreen = undefined;
		isOpen = false;
	};

	// TODO update this
	onMount(async () => {
		const q = query(collection(db, 'ecaCategory'), orderBy('name', 'asc'));
		const querySnapshot = await getDocs(q);
		ecaCategories = [];
		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			ecaCategories.push({ ...doc.data() });
		});
		// console.log(ecaCategories);

		isLoading = false;
	});

	$: console.log(selectedCategories);
</script>

<Modal {isOpen} {toggle} size="xl" scrollable>
	<ModalHeader {toggle}>Event Preferences</ModalHeader>
	<ModalBody class="py-0">
		<ListGroup flush>
			{#each ecaCategories as category}
				<ListGroupItem
					class="px-0 d-flex justify-content-between align-items-center"
					on:click={() => {
						const index = selectedCategories.findIndex((item) => item.uid === category.uid);
						if (index !== -1) {
							selectedCategories.splice(index, 1);
						} else {
							selectedCategories.push(category);
						}

						selectedCategories = selectedCategories;
					}}
				>
					{category.name}
					{#if selectedCategories.some((item) => item.uid === category.uid)}
						<Icon name="check2" class="position-absolute end-0 fs-2 text-info" />
					{/if}
				</ListGroupItem>
			{/each}
		</ListGroup>
	</ModalBody>
	<ModalFooter class="d-flex justify-content-between">
		<p class="text-muted">Total Categories Selected: {selectedCategories.length}</p>
		<Button color="primary" on:click={toggle}>Save</Button>
		<!-- <Button color="secondary" on:click={toggle}>Cancel</Button> -->
	</ModalFooter>
</Modal>
