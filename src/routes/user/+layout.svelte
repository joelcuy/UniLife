<script>
	import { Icon } from 'sveltestrap';
	import { page } from '$app/stores';
	import { ROUTES } from '../routelist';
	import { Navbar, NavbarBrand } from 'sveltestrap';
</script>

<Navbar
	color={'primary'}
	dark
>
	<NavbarBrand class= "mx-auto" href="/">UniLife</NavbarBrand>
</Navbar>
<slot />
<nav class="nav">
	<a href="/user/feed" class="nav-link" class:nav-link-active={$page.url.pathname === ROUTES.feed}>
		<Icon name="house-door-fill" />
		<span class="nav-text"> Home </span>
	</a>
	<a
		href="/user/discover"
		class="nav-link"
		class:nav-link-active={$page.url.pathname === ROUTES.discover}
	>
		<Icon name="search" />
		<span class="nav-text"> Discover </span>
	</a>
	<a
		href="/user/profile"
		class="nav-link"
		class:nav-link-active={$page.url.pathname === ROUTES.profile}
	>
		<Icon name="person-fill" />
		<span class="nav-text"> Profile </span>
	</a>
</nav>

<style lang="scss">
	.nav {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 3rem;
		/* box-shadow: 0 0 3px rgba(0, 0, 0, 0.2); */
		/* background-color: #eb1a1a; */
		display: flex;
		overflow-x: auto;
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
		font-size: 0.8rem;
		color: black;
		/* text-decoration: none; */
		/* -webkit-tap-highlight-color: transparent; */
		/* transition: background-color 0.1s ease-in-out; */
	}

	.nav-link:hover {
		background-color: #eeeeee;
	}

	.nav-link-active {
		color: #009578;
	}
</style>
