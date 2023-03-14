<script>
	import { getStores } from '$app/stores';
	import { auth } from '../../Firebase';
	import { onMount } from 'svelte';
	import { signOut, onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';

	let { session } = getStores();
	onMount(() => {
		onAuthStateChanged(auth, (user) => {
			console.log('user state change');
			if (user) {
				// If logged in, redirect to home
				console.log(user);
				goto('/');
			} else {
				console.log('no current user');
			}
		});
	});
</script>

<div class="page-container">
	<div class="header">
		<h1>UniLife</h1>
		<h2>The #1 Student App</h2>
	</div>
	<div class="card-layer">
		<slot />
	</div>
</div>

<style>
	.page-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		justify-content: center;
		background-color: rgba(227, 231, 235);
	}

	.header {
		width: 100vw;
		display: flex;
		flex-direction: column;
		margin-bottom: 1rem;
		align-items: center;
	}

	.header h1,
	.header h2 {
		color: black;
	}

	.card-layer {
		display: flex;
		margin: 0 auto;
		flex-direction: column;
		row-gap: 16px;
		padding: 32px 24px;
		background-color: rgba(255, 255, 255, 0.75);
		width: 75%;
		border-radius: 10px;
	}
</style>
