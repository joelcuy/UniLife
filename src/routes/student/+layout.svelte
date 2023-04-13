<script>
	import TopNav from '../../lib/components/general/TopNav.svelte';

	import BottomNav from '$lib/components/general/BottomNav.svelte';
	import { page } from '$app/stores';
	import { ROUTES } from '../../lib/routelist';
	import {
		Collapse,
		Navbar,
		NavbarToggler,
		NavbarBrand,
		Nav,
		NavItem,
		NavLink,
		ListGroup,
		ListGroupItem,
		Offcanvas,
		Icon
	} from 'sveltestrap';
	import { onMount } from 'svelte';
	import { onAuthStateChanged } from 'firebase/auth';
	import { getUserRole } from '$lib/auth';
	import { auth, db } from '../../lib/Firebase';
	import CenteredSpinner from '../../lib/components/general/CenteredSpinner.svelte';
	import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
	import EmailVerification from '$lib/components/auth/EmailVerification.svelte';
	import { signout } from '$lib/auth.js';

	let userRole;
	let isOpen = false;
	// const toggle = () => (isOpen = !isOpen);
	let endOpen = false;

	const toggleEnd = () => (endOpen = !endOpen);
	const PAGE_STATES = Object.freeze({
		loading: 1,
		unauthorized: 2,
		verifyEmail: 3,
		accessible: 4
	});
	let currentPageState = PAGE_STATES.loading;

	const navigationOptions = [
		{ path: ROUTES.feed, icon: 'house-door-fill', label: 'Home' },
		{ path: ROUTES.discover, icon: 'compass-fill', label: 'Discover' },
		{ path: ROUTES.profile, icon: 'person-fill', label: 'Profile' }
	];

	onMount(() => {
		onAuthStateChanged(auth, async (user) => {
			// TODO Can we put currentPageState = PAGE_STATES.loading; here?
			if (user) {
				try {
					const userDocSnap = await getDoc(doc(db, 'users', user.uid));

					if (userDocSnap.exists()) {
						userRole = userDocSnap.data().role;
						// console.log(userRole);
					}
				} catch (error) {
					console.error('Error reading data from Firestore:', error);
				}

				if (userRole !== 'student') {
					currentPageState = PAGE_STATES.unauthorized;
				} else if (!user.emailVerified) {
					currentPageState = PAGE_STATES.verifyEmail;
				} else {
					currentPageState = PAGE_STATES.accessible;
				}
			} else {
				currentPageState = PAGE_STATES.unauthorized;
			}
		});
	});
</script>

<!-- Only allow access if role is organization -->
{#if currentPageState === PAGE_STATES.loading}
	<CenteredSpinner />
{:else if currentPageState === PAGE_STATES.unauthorized}
	<h1>Error 403: Access Denied</h1>
	<p>You don't have permission to access this page.</p>
{:else if currentPageState === PAGE_STATES.verifyEmail}
	<EmailVerification />
{:else if currentPageState === PAGE_STATES.accessible}
	<TopNav />
	<div class="nav-compensation">
		<slot />
	</div>
	<BottomNav options={navigationOptions} activePath={$page.url.pathname} />
{/if}

<style>
	.nav-compensation {
		margin-top: 56px;
		height: calc(100vh - 56px - 46px);
		/* Compensate for top and bottom nav */
		/* max-height: calc(100vh - 56px - 46px); */
		overflow-y: auto;
	}
</style>
