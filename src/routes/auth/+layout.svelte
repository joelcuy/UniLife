<script>
	import { Card, CardBody } from 'sveltestrap';
	import { onAuthStateChanged } from 'firebase/auth';
	import { auth } from '$lib/Firebase';
	import { onMount } from 'svelte';
	import { getUserRole } from '$lib/auth';

	onMount(() => {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
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
			} else {
				// If not logged in, redirect to login
				console.log('no current user');
				goto(ROUTES.login);
			}
		});
	});
</script>

<div class="d-flex flex-column justify-content-center min-vh-100 py-4">
	<div class="text-center mb-3">
		<h1>UniLife</h1>
		<h2>The #1 Student App</h2>
	</div>
	<Card class="col-10 col-sm-8 col-md-6 col-lg-4 mx-auto">
		<CardBody class="my-1 d-flex flex-column gap-3 ">
			<slot />
		</CardBody>
	</Card>
</div>

<style>
	/* .header {
		text-align: center;
		margin-bottom: 1rem;
	} */
</style>
