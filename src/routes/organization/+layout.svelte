<script>
	import { onMount } from 'svelte';
	import { onAuthStateChanged } from 'firebase/auth';
	import { auth, app, db } from '$lib/Firebase';
	import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
	import EmailVerification from '$lib/components/auth/EmailVerification.svelte';
	import AccountInactive from '$lib/components/auth/AccountInactive.svelte';
	import { Navbar, NavbarBrand, Spinner, Container } from 'sveltestrap';
	import BottomNav from '$lib/components/general/BottomNav.svelte';
	import { page } from '$app/stores';
	import { ROUTES } from '$lib/routelist';
	import CenteredSpinner from '../../lib/components/general/CenteredSpinner.svelte';
	import TopNav from '../../lib/components/general/TopNav.svelte';

	let userEmail;
	
	const PAGE_STATES = Object.freeze({
		loading: 1,
		unauthorized: 2,
		verifyEmail: 3,
		pendingActivation: 4,
		accessible: 5
	});
	let currentPageState = PAGE_STATES.loading;

	let userRole;
	let isUserActive;

	const navigationOptions = [
		{ path: ROUTES.orgDashboard, icon: 'clipboard2-data', label: 'Dashboard' },
		{ path: ROUTES.orgCreateEvent, icon: 'plus-square', label: 'Create Event' },
		{ path: ROUTES.orgProfile, icon: 'person-fill', label: 'Profile' }
	];

	onMount(() => {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				userEmail = user.email;
				try {
					const userDocSnap = await getDoc(doc(db, 'users', user.uid));

					if (userDocSnap.exists()) {
						userRole = userDocSnap.data().role;
						isUserActive = userDocSnap.data().isActive;
					}
				} catch (error) {
					console.error('Error reading data from Firestore:', error);
				}

				if (userRole !== 'organization') {
					currentPageState = PAGE_STATES.unauthorized;
				} else if (!user.emailVerified) {
					currentPageState = PAGE_STATES.verifyEmail;
				} else if (!isUserActive) {
					currentPageState = PAGE_STATES.pendingActivation;
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
{:else if currentPageState === PAGE_STATES.pendingActivation}
	<AccountInactive />
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
