<script>
	import { FormGroup, Button } from 'sveltestrap';
	import { auth, app, db } from '../../../lib/Firebase';
	import { onMount } from 'svelte';
	import { onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { getFirestore, doc, onSnapshot, getDoc } from 'firebase/firestore';
	import { ROUTES } from '$lib/routelist';
	import blankProfilePic from '$lib/assets/blankProfilePic.png';
	import CenteredSpinner from '../../../lib/components/general/CenteredSpinner.svelte';

	export let profilePic;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="circle-mask">
	{#if profilePic}
		<div class="image" style="background-image:url({profilePic.URL})" />
	{:else}
		<div class="image" style="background-image:url({blankProfilePic})" />
	{/if}
</div>

<style>
	.circle-mask {
		margin: auto;
		margin-bottom: 1rem;
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
</style>
