<script>
	import { signOut, onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { auth } from '../lib/Firebase';
	import { onMount, afterUpdate, onDestroy } from 'svelte';
	import { ROUTES } from '../lib/routelist';

	
	// onMount(() => {
	// 	onAuthStateChanged(auth, async (user) => {
	// 		console.log('user state change');
	// 		if (user) {
				
	// 		} else {
	// 			// If not logged in, redirect to login
	// 			console.log('no current user');
	// 			goto(ROUTES.login);
	// 		}
	// 	});
	// });
</script>

<slot />
