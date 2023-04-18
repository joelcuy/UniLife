<script>
	import { signout } from '$lib/auth';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/Firebase';
	import { sendEmailVerification } from 'firebase/auth';
	import { Col, Row, Button, Alert, Card, CardBody } from 'sveltestrap';
	import { afterUpdate, onDestroy } from 'svelte';
	import { ROUTES } from '$lib/routelist';

	let showAlert = false;
	export let userEmail;

	//Cooldown for requesting TAC
	let isCooldown = false;
	const COOLDOWN_TIME = 30;
	/**
	 * TODO change time depending on requirements
	 */
	let cooldownCounter = 0;
	let timer;
	$: displayCooldownCounter = `(${cooldownCounter.toString()}s)`;

	afterUpdate(() => {
		// When counter reaches 0, clear interval
		if (cooldownCounter === 0) {
			if (timer) {
				clearInterval(timer);
				timer = null;
				isCooldown = false;
				showAlert = false;
			}
		}
	});

	onDestroy(() => {
		// When component not in use clear interval
		if (timer) {
			clearInterval(timer);
		}
	});

	/**
	 * Starts the counter
	 */
	function startCounter() {
		showAlert = true;
		isCooldown = true;
		cooldownCounter = COOLDOWN_TIME;
		timer = setInterval(() => {
			cooldownCounter -= 1;
		}, 1000);
	}

	async function resendVerificationEmail() {
		sendEmailVerification(auth.currentUser).then(() => {
			// Email verification sent!
			startCounter();
		});
	}
</script>

<!-- This page is used for logged in users but unable to access content -->
<div class="d-flex flex-column justify-content-center min-vh-100 py-4">
	<Card class="col-10 col-sm-8 col-md-6 col-xxl-4 mx-auto">
		<CardBody class="my-1 d-flex flex-column gap-3 ">
			<Alert isOpen={showAlert} color="success">A verification link has been emailed to you!</Alert>
			<div class="text-center">
				<h1>Verify E-mail Address</h1>
				<br />
				<p>
					Please check your inbox at {userEmail} and click on the verification link to continue. Click
					<!-- svelte-ignore a11y-invalid-attribute -->
					<a
						href="javascript:void(0)"
						on:click={() => {
							location.reload();
						}}
					>
						here
					</a> if you're not redirected automatically.
				</p>
			</div>
			<Row>
				<Col sm="12" lg="6" class="mb-2">
					<Button color="primary" id="logout-button" block on:click={signout}>Back to Login</Button>
				</Col>
				<Col sm="12" lg="6">
					<Button
						color="primary"
						disabled={isCooldown}
						id="login-button"
						block
						on:click={resendVerificationEmail}
					>
						Resend Verification Email
						{isCooldown ? displayCooldownCounter : ''}
					</Button>
				</Col>
			</Row>
		</CardBody>
	</Card>
</div>

<style>
</style>
