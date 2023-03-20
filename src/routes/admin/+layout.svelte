<script>
	import { onMount } from 'svelte';
	import { onAuthStateChanged } from 'firebase/auth';
	import { getUserRole } from '$lib/auth';
	import { auth } from '../../lib/Firebase';

	let userRole;

	onMount(() => {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				userRole = await getUserRole(user.uid);
			}
		});
	});
</script>

<!-- Only allow access if role is admin -->
{#if userRole === 'admin'}
	<slot />
{:else}
	<h1>Error 403: Access Denied</h1>
    <p>You don't have permission to access this page.</p>
{/if}
