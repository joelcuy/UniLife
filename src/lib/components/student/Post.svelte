<script>
	import CustomImageCarousel from '$lib/components/student/CustomImageCarousel.svelte';

	import { onMount } from 'svelte';
	import {
		Carousel,
		CarouselControl,
		CarouselIndicators,
		CarouselItem,
		Icon,
		Button
	} from 'sveltestrap';
	import { timeAgo } from '../../../lib/utils';
	import { goto } from '$app/navigation';
	import { ROUTES } from '../../../lib/routelist';

	export let post;
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

	<CustomImageCarousel images={post.images} />
	<div class="action-group">
		<div>
			<span class="title">{post.title}</span>
		</div>
		<div>
			<Button
				size="sm"
				color="primary"
				on:click={() => {
					goto(`${ROUTES.feed}/${post.uid}`);
				}}>View Details</Button
			>
		</div>
	</div>

	<!-- <img src="img/cover 1.png" class="post-image" alt="" /> -->
	<div class="post-content">
		<p class="description">{post.description}</p>
		<p class="post-time">{timeAgo(post.creationDate)}</p>
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

	.action-group {
		display: flex;
		justify-content: space-between;
		align-items: end;
		padding: 0rem 0.5rem;
	}

	.profile-pic {
		width: 10vw;
		height: 10vw;
		border-radius: 50%;
		/* overflow: hidden; */
		padding: 3px;
		background: linear-gradient(45deg, var(--bs-primary), var(--bs-secondary) 80%);
	}

	.profile-pic img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 50%;
		border: 2px solid var(--bs-light);
	}

	.user {
		display: flex;
		align-items: center;
		column-gap: 1rem;
		/* flex-direction: row; */
	}

	.username {
		/* margin: 0; */
		/* margin-right: 0.5rem; */
		font-weight: bold;
		color: var(--bs-dark);
		font-size: 0.9rem;
	}

	.title {
		font-weight: bold;
		color: var(--bs-dark);
		font-size: 1rem;
	}

	.post {
		/* position: absolute;
		left: 0; */
		width: 100vw;
		height: auto;
		padding-bottom: 1rem;
		background: var(--bs-light);
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
		text-align: justify;
		overflow-wrap: break-word;
		/* text-justify: inter-word; */
	}

	.post-time {
		color: var(--bs-disabled);
		font-size: 0.8rem;
	}
</style>
