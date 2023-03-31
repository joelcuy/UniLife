<script>
	import { signOut, onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/Firebase';
	import { sendEmailVerification } from 'firebase/auth';
	import {
		Form,
		FormGroup,
		Input,
		Label,
		Button,
		Spinner,
		Alert,
		Card,
		CardBody
	} from 'sveltestrap';
	import { onMount, afterUpdate, onDestroy } from 'svelte';
	import { ROUTES } from '$lib/routelist';
	import { Col, Container, Row } from 'sveltestrap';
	import CustomCard from '$lib/components/CustomCard.svelte';
	import { getUserRole } from '$lib/auth';

	async function signout() {
		signOut(auth)
			.then(() => {
				// Sign-out successful.
				goto(ROUTES.login);
				console.log('signed out');
			})
			.catch((error) => {
				// An error happened.
			});
	}
</script>

<div class="page-container">
	<CustomCard>
		<div class="header">
			<h1>Account is Pending Approval</h1>
			<br />
			<p>
				Your account is currently pending approval from our admin team. We appreciate your patience
				and ask that you check back later to see if your account has been approved.
			</p>
		</div>
		<div class="width-limiter">
			<FormGroup>
				<Button color="primary" id="logout-button" block on:click={signout}>Back to Login</Button>
			</FormGroup>
		</div>
	</CustomCard>
</div>

<style>
	.page-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		justify-content: center;
		/* background-color: rgba(227, 231, 235); */
	}

	.header {
		text-align: center;
	}
</style>
