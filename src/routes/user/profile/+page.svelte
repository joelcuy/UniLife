<script>
	import { FormGroup, Button} from 'sveltestrap';
    import { goto } from '$app/navigation';
	import { ROUTES } from '../../routelist';
</script>

<!-- <div class="mask">
	<img
		alt="asdf"
		src="https://images.unsplash.com/photo-1603775020644-eb8decd79994?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXQlMjBwaG90b2dyYXBoeXxlbnwwfHwwfHw%3D&w=1000&q=80"
	/>
</div> -->
<!-- <img alt="asdf" src="https://picsum.photos/id/426/400/600.jpg" /> -->
<div class="page-container">
	<div class="profile-pic">
		<div
			class="image"
			style="background-image:url(https://images.unsplash.com/photo-1603775020644-eb8decd79994?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXQlMjBwaG90b2dyYXBoeXxlbnwwfHwwfHw%3D&w=1000&q=80)"
		/>
	</div>

	<h1>Joel Cheah</h1>
	<br />
	<h5>Education Institution</h5>
	<p>HELP University</p>
	<h5>Course of Study</h5>
	<p>BSc. Computer Science</p>
	<h5>Bio</h5>
	<p>
		Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis, iusto fugiat odio cum
		exercitationem omnis perferendis nisi eos ipsum natus! Est dicta ea eum dignissimos asperiores
		nostrum repellendus beatae sapiente.
	</p>

	<FormGroup>
		<Button
			id="login-button"
			block
			on:click={() => {
				goto(ROUTES.editProfile);
			}}
		>
			Edit Profile
		</Button>
	</FormGroup>
</div>

<style>
	.page-container {
		padding: 2rem;
	}

	h1 {
		text-align: center;
	}

	p {
		text-align: justify;
	}

	.profile-pic {
		width: 45%;
		margin: auto;
	}

	div.image {
		/* make it responsive */
		max-width: 100%;
		width: 100%;
		height: auto;
		display: block;
		/* div height to be the same as width*/
		padding-top: 100%;

		/* make it a circle */
		border-radius: 50%;

		/* Centering on image`s center*/
		background-position-y: center;
		background-position-x: center;
		background-repeat: no-repeat;

		/* it makes the clue thing, takes smaller dimension to fill div */
		background-size: cover;

		/* it is optional, for making this div centered in parent*/
		margin: 0 auto;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	/* .mask {
		-webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 50%, transparent 100%);
		mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 50%, transmask 100%);
	}

	img {
		width: 100vw;
		max-height: 300px;
		background-position: center;
	} */
</style>
