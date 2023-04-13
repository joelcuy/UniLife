<script>
	import { onMount, tick } from 'svelte';

	export let images;

	let activeIndex = 0;
	let slider;

	function setActiveIndex() {
		const activeImage = document.elementFromPoint(
			window.innerWidth / 2,
			slider.getBoundingClientRect().y + 1
		);
		const activeImageId = activeImage.id;
		activeIndex = images.findIndex((image) => image.URL === activeImageId);
	}
</script>

<div class="slider">
	<div class="slides" bind:this={slider} on:scroll={setActiveIndex}>
		{#each images as image, index}
			<img id={image.URL} src={image.URL} alt={image.URL} />
		{/each}
	</div>
</div>
<div class="slider-button">
	{#each images as image, index}
		<!-- svelte-ignore a11y-missing-content
		href={`#${image.URL}`} -->
		<a href={`#`} class:active={activeIndex === index} on:click={() => (activeIndex = index)} />
	{/each}
</div>

<!-- <div class="slider">
	<div class="slides" bind:this={slider} on:scroll={setActiveIndex}>
		{#each images as image, index}
			<img id={image.URL} src={image.URL} alt={image.URL} />
		{/each}
	</div>
	<div class="slider-button">
		{#each images as image, index}
			svelte-ignore a11y-missing-content
			<a
				href={`#${image.URL}`}
				class:active={activeIndex === index}
				on:click={() => (activeIndex = index)}
			/>
		{/each}
	</div>
</div> -->
<style>
	.slider {
		width: 100vw;
		/* overflow: hidden; */
	}

	.slides {
		display: flex;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch;
	}

	.slides::-webkit-scrollbar {
		width: 10px;
		height: 10px;
	}

	.slides > img {
		scroll-snap-align: start;
		flex-shrink: 0;
		width: 100vw;
		height: auto;
		/* height: 100vw; */
		background: #eee;
		transform-origin: center center;
		transform: scale(1);
		transition: transform 0.5s;
		position: relative;
	}

	/* img {
		object-fit: cover;
		width: 100%;
		height: 100%;
	} */

	.slider-button {
		display: flex;
		flex-direction: row;
		justify-content: center;
		column-gap: 0.2rem;
	}

	.slider-button > a {
		/* display: inline-flex; */
		width: 0.4rem;
		height: 0.4rem;
		background: var(--bs-disabled);
		text-decoration: none;
		/* align-items: center;
		justify-content: center; */
		border-radius: 50%;
		/* margin: 0 0 0.5rem 0; */
		/* position: relative; */
	}
	.slider-button > a.active {
		/* top: 1px; */
		background-color: var(--bs-info);
	}
	/* .slider > a:focus {
		background: #000;
	} */
</style>
