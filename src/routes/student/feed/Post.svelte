<script>
	import { onMount } from 'svelte';
	import {
		Carousel,
		CarouselControl,
		CarouselIndicators,
		CarouselItem,
		Icon,
		Button
	} from 'sveltestrap';

	export let post;

	let activeIndex = 0;
	let slider;

	onMount(() => {
		// slider.addEventListener('scroll', setActiveIndex);
		// return () => slider.removeEventListener('scroll', setActiveIndex);
	});

	function setActiveIndex() {
		const activeImage = document.elementFromPoint(
			window.innerWidth / 2,
			slider.getBoundingClientRect().y + 1
		);
		const activeImageId = activeImage.id;
		activeIndex = post.images.findIndex((image) => image.URL === activeImageId);
	}
</script>

<div class="post">
	<div class="info">
		<div class="user">
			<div class="profile-pic">
				<img src={post.organizer.profilePic.URL} alt="{post.organizer.orgName}'s avatar" />
			</div>
			<p class="username">{post.organizer.orgName}</p>
		</div>
		<Icon name="three-dots-vertical" />
	</div>

	<div class="slider">
		<div class="slides" bind:this={slider} on:scroll={setActiveIndex}>
			{#each post.images as image, index}
				<img id={image.URL} src={image.URL} alt={image.URL} />
			{/each}
		</div>
		<div class="action-group">
      <div>
        <Button size="sm" color="primary">View Details</Button>
      </div>
      <div class="slider-button">
        {#each post.images as image, index}
          <!-- svelte-ignore a11y-missing-content -->
          <a
            href={`#${image.URL}`}
            class:active={activeIndex === index}
            on:click={() => (activeIndex = index)}
          />
        {/each}
      </div>
      <div>
        <Button size="sm" color="primary">View Details</Button>
      </div>
    </div>
	</div>

	<!-- <img src="img/cover 1.png" class="post-image" alt="" /> -->
	<div class="post-content">
		<p class="description">
			<span class="username">{post.title}</span>
			{post.description}
		</p>
		<p class="post-time">2 minutes ago</p>
	</div>
	<!-- <div class="comment-wrapper">
		<input type="text" class="comment-box" placeholder="Add a comment" />
		<button class="comment-btn">post</button>
	</div> -->
</div>

<style>
	p {
		margin: 0;
	}
	.slider {
		width: 100vw;
		text-align: center;
		overflow: hidden;
	}

	.slides {
		display: flex;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch;

		/* scroll-snap-points-x: repeat(300px);
		scroll-snap-type: mandatory; */
	}

	.slides::-webkit-scrollbar {
		width: 10px;
		height: 10px;
	}
	/* .slides::-webkit-scrollbar-thumb {
		background: black;
		border-radius: 10px;
	} */
	/* .slides::-webkit-scrollbar-track {
		background: transparent;
	} */
	.slides > img {
		scroll-snap-align: start;
		/* flex-shrink: 0; */
		width: 100vw;
		height: auto;
		/* margin-right: 50px; */
		/* border-radius: 10px; */
		background: #eee;
		transform-origin: center center;
		transform: scale(1);
		transition: transform 0.5s;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		/* font-size: 100px; */
	}

	.slider-button {
		display: flex;
		flex-direction: row;
		/* align-items: center;
    align-content: center; */
		justify-content: center;
		column-gap: 0.2rem;
	}
	.slider-button > a {
		width: 0.4rem;
		height: 0.4rem;
		background: var(--bs-disabled);
		text-decoration: none;
		border-radius: 50%;
		/* margin: 0 0 0.5rem 0; */
		/* position: relative; */
	}

	.slider-button > a.active {
		background-color: var(--bs-info);
	}

	/* Don't need button navigation */
	/* @supports (scroll-snap-type) {
		.slider > a {
			display: none;
		}
	} */

	.profile-pic {
		width: 10vw;
		height: 10vw;
		border-radius: 50%;
		/* overflow: hidden; */
		padding: 3px;
		background: linear-gradient(45deg, rgb(255, 230, 0), rgb(255, 0, 128) 80%);
	}

	.profile-pic img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 50%;
		border: 2px solid #fff;
	}

	.user {
		display: flex;
		align-items: center;
		column-gap: 1rem;
		/* flex-direction: row; */
	}

	.username {
		/* margin: 0; */
		margin-right: 0.5rem;
		font-weight: bold;
		color: black;
		font-size: 0.9rem;
	}

	.post {
		position: absolute;
		left: 0;
		width: 100vw;
		height: auto;
		background: #fff;
		/* border: 1px solid #dfdfdf; */
		/* margin-top: 40px; */
	}

	.info {
		/* width: 100%; */
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 0.5rem;
	}

	.post-content {
		width: 100%;
		padding: 0.5rem 0.5rem;
	}

	.description {
		font-size: 0.9rem;
		line-height: 1.2rem;
		margin-bottom: 0.5rem;
	}

	.post-time {
		color: var(--bs-disabled);
		font-size: 0.8rem;
	}
</style>
