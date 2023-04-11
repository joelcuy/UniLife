<script>
	import {
		Navbar,
		NavbarToggler,
		NavbarBrand,
		ListGroup,
		ListGroupItem,
		Offcanvas,
		Icon
	} from 'sveltestrap';
	import { signout } from '$lib/auth.js';
	let endOpen = false;

	const toggleEnd = () => (endOpen = !endOpen);
</script>

<Navbar color="primary" dark class="fixed-top">
	<NavbarToggler on:click={toggleEnd} />
	<Offcanvas
		isOpen={endOpen}
		style="width: 70vw"
		toggle={toggleEnd}
		placement="start"
		header="Menu"
	>
		<ListGroup flush>
			<ListGroupItem class="px-0" tag="button" action on:click={signout}
				><Icon name="exclamation-triangle-fill " class="me-3" />Report an Issue</ListGroupItem
			>
			<ListGroupItem class="px-0" tag="button" action on:click={signout}
				><Icon name="box-arrow-right" class="me-3" /><span class="text-danger">Sign Out</span
				></ListGroupItem
			>
		</ListGroup>
	</Offcanvas>
	<NavbarBrand>UniLife</NavbarBrand>
	<NavbarToggler class="invisible" />
</Navbar>

<style>
</style>
