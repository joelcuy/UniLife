<script>
	import { onMount } from 'svelte';
	import { onAuthStateChanged } from 'firebase/auth';
	import { auth, app, db } from '$lib/Firebase';
	import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
	import EmailVerification from '$lib/components/auth/EmailVerification.svelte';
	import AccountInactive from '$lib/components/auth/AccountInactive.svelte';

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

	onMount(() => {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
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
	loading...
{:else if currentPageState === PAGE_STATES.unauthorized}
	<h1>Error 403: Access Denied</h1>
	<p>You don't have permission to access this page.</p>
{:else if currentPageState === PAGE_STATES.verifyEmail}
	<EmailVerification />
{:else if currentPageState === PAGE_STATES.pendingActivation}
	<AccountInactive />
{:else if currentPageState === PAGE_STATES.accessible}
	<slot />
{/if}
