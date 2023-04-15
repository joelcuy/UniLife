<script>
	import { onMount } from 'svelte';
	import { onAuthStateChanged } from 'firebase/auth';
	import { getUserRole } from '$lib/auth';
	import { auth } from '$lib/Firebase';
	import CenteredSpinner from '$lib/components/general/CenteredSpinner.svelte';
	import TopNav from '$lib/components/general/TopNav.svelte';
	import BottomNav from '$lib/components/general/BottomNav.svelte';
	import { page } from '$app/stores';
	import { ROUTES } from '$lib/routelist';

	let userRole;

	const PAGE_STATES = Object.freeze({
		loading: 1,
		unauthorized: 2,
		accessible: 4
	});
	let currentPageState = PAGE_STATES.loading;

	onMount(() => {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				userRole = await getUserRole(user.uid);

				if (userRole !== 'admin') {
					currentPageState = PAGE_STATES.unauthorized;
				} else {
					currentPageState = PAGE_STATES.accessible;
				}
			} else {
				currentPageState = PAGE_STATES.unauthorized;
			}
		});
	});

	const navigationOptions = [
		{ path: ROUTES.adminDashboard, icon: 'inbox-fill', label: 'Requests' },
		// { path: ROUTES.adminManageOrg, icon: 'person-lines-fill', label: 'Organizations' }
	];
</script>

<!-- Only allow access if role is admin -->
{#if currentPageState === PAGE_STATES.loading}
	<CenteredSpinner />
{:else if currentPageState === PAGE_STATES.unauthorized}
	<h1>Error 403: Access Denied</h1>
	<p>You don't have permission to access this page.</p>
{:else if currentPageState === PAGE_STATES.accessible}
	<TopNav />
	<div class="nav-compensation">
		<slot />
	</div>
	<BottomNav options={navigationOptions} activePath={$page.url.pathname} />
{/if}

<style>
	.nav-compensation {
		padding: 1rem 1rem;
		margin-top: 56px;
		height: calc(100vh - 56px - 46px);
		/* Compensate for top and bottom nav */
		/* max-height: calc(100vh - 56px - 46px); */
		overflow-y: auto;
	}
</style>
