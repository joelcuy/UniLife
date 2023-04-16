<script>
	import {
		Navbar,
		Nav,
		NavLink,
		NavbarToggler,
		NavbarBrand,
		ListGroup,
		ListGroupItem,
		Offcanvas,
		Icon
	} from 'sveltestrap';
	import { signout } from '$lib/auth.js';
	import { onMount } from 'svelte';
	import { ROUTES } from '../../routelist';
	import { page } from '$app/stores';

	let endOpen = false;
	const toggleEnd = () => (endOpen = !endOpen);

	// const routesWithBackButton = [ROUTES.];

	let showBack = false;
	function isRouteWithBackButton(url) {
		const pattern = /^\/student\/feed\/\w+$/;
		return pattern.test(url);
	}

	$: {
		showBack = isRouteWithBackButton($page.url.pathname);
	}
</script>

<Navbar color="primary" dark class="fixed-top">
	<!-- <NavbarToggler class="invisible" /> -->
	<Nav class={showBack ? '' : 'invisible'}>
		<NavLink
			class="p-0 text-light"
			on:click={() => {
				history.back();
			}}><Icon name="arrow-left" /> Back</NavLink
		>
	</Nav>
	<Offcanvas isOpen={endOpen} style="width: 70vw" toggle={toggleEnd} placement="end" header="Menu">
		<ListGroup flush>
			<!-- <ListGroupItem class="px-0" tag="button" action on:click={() => {}}
				><Icon name="exclamation-triangle-fill " class="me-3" />Report an Issue</ListGroupItem
			> -->
			<ListGroupItem class="px-0" tag="button" action on:click={signout}
				><Icon name="box-arrow-right" class="me-3" /><span class="text-danger">Sign Out</span
				></ListGroupItem
			>
		</ListGroup>
	</Offcanvas>
	<NavbarBrand class="fw-bolder">UniLife</NavbarBrand>
	<NavbarToggler on:click={toggleEnd} />
</Navbar>

<style>
</style>
