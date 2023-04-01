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
	import {signout} from "$lib/auth.js"
</script>

<div class="d-flex flex-column justify-content-center min-vh-100 py-4">
	<Card class="col-10 col-sm-8 col-md-6 col-xxl-4 mx-auto">
		<CardBody class="my-1 d-flex flex-column gap-3 ">
			<div class="text-center">
				<h1>Account is Pending Approval</h1>
				<br />
				<p>
					Your account is currently pending approval from our admin team. We appreciate your
					patience and ask that you check back later to see if your account has been approved.
				</p>
			</div>
			<Button color="primary" id="logout-button" block on:click={signout}>Back to Login</Button>
		</CardBody>
	</Card>
</div>

<style>
</style>
