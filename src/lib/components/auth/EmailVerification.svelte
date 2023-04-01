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

	let showAlert = false;

	//Cooldown for requesting TAC
	let isCooldown = false;
	const COOLDOWN_TIME = 10;
	/**
	 * TODO change time depending on requirements
	 */
	let cooldownCounter = 0;
	let timer;
	$: displayCooldownCounter = `(${cooldownCounter.toString()}s)`;

	// let userData;
	onMount(() => {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				if (user.emailVerified) {
					let userRole = await getUserRole(user.uid);
					switch (userRole) {
						case 'student':
							goto(ROUTES.feed);
							break;
						case 'organization':
							goto(ROUTES.orgDashboard);
							break;
					}
				}
			}
		});
	});

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

	async function resendVerificationEmail() {
		sendEmailVerification(auth.currentUser).then(() => {
			// Email verification sent!
			startCounter();
		});
	}
</script>

<!-- This page is used for logged in users but unable to access content -->
<!-- Reasons: Unverified Email -->
<div class="page-container">
	<CustomCard>
		<div class="width-limiter">
			<Alert isOpen={showAlert} color="success">A verification link has been emailed to you!</Alert>
		</div>
		<div class="header">
			<h1>Verify E-mail Address</h1>
			<br />
			<p>Please check your email and click on the verification link to continue.</p>
		</div>
		<div class="width-limiter">
			<Row>
				<Col xs="12" sm="6">
					<FormGroup>
						<Button color="primary" id="logout-button" block on:click={signout}
							>Back to Login</Button
						>
					</FormGroup>
				</Col>
				<Col xs="12" sm="6">
					<FormGroup>
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
					</FormGroup>
				</Col>
			</Row>
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
