<script>
	import { Icon } from 'sveltestrap';
	import { page } from '$app/stores';
	import { ROUTES } from '../../lib/routelist';
	import { Navbar, NavbarBrand } from 'sveltestrap';
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

<!-- Only allow access if role is organization -->
{#if userRole === 'student'}
	<Navbar color={'primary'} dark>
		<NavbarBrand class="mx-auto" href={ROUTES.root}>UniLife</NavbarBrand>
	</Navbar>
	<slot />
	<nav class="nav">
		<a
			href={ROUTES.feed}
			class="nav-link"
			class:nav-link-active={$page.url.pathname === ROUTES.feed}
		>
			<Icon name="house-door-fill" />
			<span class="nav-text"> Home </span>
		</a>
		<a
			href={ROUTES.discover}
			class="nav-link"
			class:nav-link-active={$page.url.pathname === ROUTES.discover}
		>
			<Icon name="search" />
			<span class="nav-text"> Discover </span>
		</a>
		<a
			href={ROUTES.profile}
			class="nav-link"
			class:nav-link-active={$page.url.pathname === ROUTES.profile}
		>
			<Icon name="person-fill" />
			<span class="nav-text"> Profile </span>
		</a>
	</nav>
{:else}
	<h1>Error 403: Access Denied</h1>
	<p>You don't have permission to access this page.</p>
{/if}

<style>
	.nav {
		position: fixed;
		bottom: 0;
		width: 100%;
		box-shadow: 0px 0px 8px rgba(0, 0, 0);
		background-color: #ffffff;
		display: flex;
	}

	.nav-link {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex-grow: 1;
		min-width: 50px;
		overflow: hidden;
		white-space: nowrap;
		font-family: sans-serif;
		font-size: 1rem;
		color: black;
		/* text-decoration: none; */
		/* -webkit-tap-highlight-color: transparent; */
		/* transition: background-color 0.1s ease-in-out; */
	}

	.nav-link:hover {
		background-color: #eeeeee;
	}

	.nav-link-active {
		color: var(--bs-primary);
	}
</style>
