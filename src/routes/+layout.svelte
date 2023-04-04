<script>
	import { signOut, onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/Firebase';
	import { onMount, afterUpdate, onDestroy } from 'svelte';
	import { ROUTES, publicRoutes } from '$lib/routelist';
	import { page } from '$app/stores';
	import { getUserRole } from '$lib/auth';

	onMount(() => {
		onAuthStateChanged(auth, async (user) => {
			// console.log('user state change');
			if (user) {
				// console.log($page.url.pathname);
				console.log('there is a user');
				// console.log(publicRoutes);

				// If user logged in but is in public route, redirect
				if (publicRoutes.includes($page.url.pathname)) {
					let userRole = await getUserRole(user.uid);
					switch (userRole) {
						case 'student':
							goto(ROUTES.feed);
							break;
						case 'organization':
							goto(ROUTES.orgDashboard);
							break;
						case 'admin':
							goto(ROUTES.adminDashboard);
							break;
					}
				}
			} else {
				if (!publicRoutes.includes($page.url.pathname)) {
					// If user is not logged in and not on a public route, redirect to login
					goto(ROUTES.login);
				}
			}
		});
	});
</script>

<div class="bg-color min-vh-100">
	<slot />
</div>

<style>
	.bg-color {
		background-color: rgba(227, 231, 235);
	}
</style>
