<script>
	import BottomNav from './BottomNav.svelte';

	import { Icon } from 'sveltestrap';
	import { page } from '$app/stores';
	import { ROUTES } from '../../lib/routelist';
	import { Navbar, NavbarBrand } from 'sveltestrap';
	import { onMount } from 'svelte';
	import { onAuthStateChanged } from 'firebase/auth';
	import { getUserRole } from '$lib/auth';
	import { auth } from '../../lib/Firebase';

	let userRole;

	const navigationOptions = [
		{ path: ROUTES.feed, icon: 'house-door-fill', label: 'Home' },
		{ path: ROUTES.discover, icon: 'search', label: 'Discover' },
		{ path: ROUTES.profile, icon: 'person-fill', label: 'Profile' }
	];

	onMount(() => {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				userRole = await getUserRole(user.uid);
			}
		});
	});
</script>

<!-- Only allow access if role is organization -->
{#if userRole === 'student'}
	<Navbar color="primary" dark class="fixed-top">
		<NavbarBrand class="mx-auto">UniLife</NavbarBrand>
		<!-- <NavbarBrand class="mx-auto" href={ROUTES.root}>UniLife</NavbarBrand> -->
	</Navbar>
	<div class="nav-compensation">
		<slot />
	</div>
	<BottomNav options={navigationOptions} activePath={$page.url.pathname} />
{:else}
	<h1>Error 403: Access Denied</h1>
	<p>You don't have permission to access this page.</p>
{/if}

<style>
	.nav-compensation {
		padding: 4rem 1rem;
	}
</style>
