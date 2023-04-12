<script>
	import { Carousel, CarouselControl, CarouselIndicators, CarouselItem } from 'sveltestrap';

	export let post;
	let activeIndex = 0;
</script>

<div class="post">
	<div class="user-info">
		<img src={post.organizer.profilePic.URL} alt="{post.organizer.orgName}'s avatar" />
		<span>{post.organizer.orgName}</span>
	</div>
	<Carousel items={post.images} bind:activeIndex>
		<CarouselIndicators class="" bind:activeIndex items={post.images} />

		<div class="carousel-inner">
			{#each post.images as image, index}
				<CarouselItem bind:activeIndex itemIndex={index}>
					<img src={image.URL} class="d-block w-100" alt={`${image} ${index + 1}`} />
				</CarouselItem>
			{/each}
		</div>

		<CarouselControl direction="prev" bind:activeIndex items={post.images} />
		<CarouselControl direction="next" bind:activeIndex items={post.images} />
	</Carousel>
	<!-- {#each post.images as image}
		<img class="post-image" src={image.URL} alt="Post" />
	{/each} -->
	<!-- <div class="post-actions">
		<span>{post.likes} likes</span>
		You can add more actions here, like buttons for like, comment, and share
	</div> -->
	<div class="post-description">
		<p>{post.description}</p>
	</div>
</div>

<style>
	.post {
		margin-bottom: 24px;
	}
	.user-info {
		display: flex;
		align-items: center;
		padding: 8px;
	}
	.user-info img {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		margin-right: 8px;
	}
	.post-image {
		width: 100%;
		height: auto;
	}
	.post-actions {
		padding: 8px;
	}
	.post-description {
		padding: 8px;
	}
</style>
