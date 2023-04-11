<script>
	import {
		Navbar,
		NavbarToggler,
		NavbarBrand,
		ListGroup,
		ListGroupItem,
		Offcanvas,
		Icon
	} from 'sveltestrap';
	import blankProfilePic from '$lib/assets/blankProfilePic.png';
	import { createEventDispatcher } from 'svelte';

	let dispatch = createEventDispatcher();
	let bottomOpen = false;
	const toggleBottom = () => (bottomOpen = !bottomOpen);
	let fileInputElement = null;

	export let currentImage;

	function handleRemove() {
		currentImage = undefined;
		toggleBottom();
		dispatch('remove', { image: undefined });
	}

	function handleClickFileInput() {
		// Trigger click event on file input
		fileInputElement.click();
	}

	function handleFileUpload(event) {
		// Handle file input change event
		currentImage = event.target.files[0];
		toggleBottom();
		dispatch('upload', {
			image: currentImage
		});
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="circle-mask" on:click={toggleBottom}>
	{#if typeof currentImage === 'string'}
		<div class="image" style="background-image:url({currentImage})" />
	{:else if typeof currentImage === 'object'}
		<div class="image" style="background-image:url({URL.createObjectURL(currentImage)})" />
	{:else if !currentImage}
		<div class="image" style="background-image:url({blankProfilePic})" />
	{/if}
	<div class="camera-icon"><i class="fa-solid fa-camera" /></div>
</div>

<Offcanvas
	isOpen={bottomOpen}
	toggle={toggleBottom}
	placement="bottom"
	header="Profile Picture"
	style="height: fit-content"
>
	<ListGroup flush>
		<ListGroupItem class="px-0" tag="button" action on:click={handleClickFileInput}
			><Icon name="images" class="me-3" />Choose from library</ListGroupItem
		>
		<!-- Input element for file selection, hidden with display: none -->
		<input bind:this={fileInputElement} type="file" class="d-none" on:change={handleFileUpload} />
		<ListGroupItem class="px-0" tag="button" action on:click={handleRemove}
			><Icon name="trash-fill" class="me-3" /><span class="text-danger">Remove current picture</span
			></ListGroupItem
		>
	</ListGroup>
</Offcanvas>

<style>
	.circle-mask {
		margin: auto;
		width: 45vw;
		height: 45vw;
		position: relative;
		padding: 0;
		overflow: hidden;
		border-radius: 50%;
	}

	.image {
		width: 100%;
		height: 100%;
		/* Centering on image`s center*/
		background-position-y: center;
		background-position-x: center;
		background-repeat: no-repeat;

		/* it makes the clue thing, takes smaller dimension to fill div */
		background-size: cover;
	}

	.camera-icon {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 30%; /* Set the height to 20% to cover the bottom 20% of the profile picture */
		background-color: rgba(0, 0, 0, 0.5); /* Set the background color to semi-transparent black */
	}

	i {
		font-size: 1.5rem;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		color: white;
	}
</style>
