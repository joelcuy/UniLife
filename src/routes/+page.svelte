<script>
	import { signOut, onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { auth } from '../lib/Firebase';
	import {
		createUserWithEmailAndPassword,
		updateProfile,
		sendEmailVerification
	} from 'firebase/auth';
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
	import { ROUTES } from '../lib/routelist';
	import { Col, Container, Row } from 'sveltestrap';
	import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
	import { currentUserData } from '../lib/stores';

	// Initialize Cloud Firestore and get a reference to the service
	// const db = getFirestore(app);

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

	let userData;
	onMount(() => {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				if (user.emailVerified) {
					switch ($currentUserData.role) {
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
	<div class="card-layer">
		<div class="width-limiter">
			<!-- TODO when firebase email got error handle it -->
			<Alert isOpen={showAlert} color="success">A verification link has been emailed to you!</Alert>
		</div>
		<div class="header">
			<h1>Verify E-mail Address</h1>
			<p>Please check your email and click on the verification link to continue.</p>
		</div>
		<div class="width-limiter">
			<Row>
				<Col xs="12" md="6">
					<FormGroup>
						<Button color="primary" id="logout-button" block on:click={signout}
							>Back to Login</Button
						>
					</FormGroup>
				</Col>
				<Col xs="12" md="6">
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
			<!-- TODO consider text and anchor tag design for login link -->
		</div>
	</div>
</div>

<style>
	.page-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		justify-content: center;
		background-color: rgba(227, 231, 235);
	}

	.header {
		text-align: center;
	}

	.width-limiter {
		width: 75%;
	}

	.card-layer {
		display: flex;
		margin: 0 auto;
		flex-direction: column;
		row-gap: 16px;
		padding: 32px 24px;
		background-color: rgba(255, 255, 255, 0.75);
		width: 75%;
		border-radius: 10px;
		align-items: center;
	}
</style>
