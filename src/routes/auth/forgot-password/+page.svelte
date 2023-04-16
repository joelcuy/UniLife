<script>
	import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
	import { auth } from '../../../lib/Firebase';
	import { goto } from '$app/navigation';
	import { onMount, afterUpdate, onDestroy } from 'svelte';
	import {
		FormGroup,
		Input,
		Label,
		Button,
		InputGroup,
		Nav,
		NavLink,
		Icon,
		Alert,
		Collapse
	} from 'sveltestrap';
	import { ROUTES } from '../../../lib/routelist';
	import { getFriendlyErrorMessage } from '../../../lib/utils';

	let email;

	let isResetClicked;
	let isLinkError;
	let errorMessage;

	//Cooldown for requesting reset link
	let isCooldown = false;
	const COOLDOWN_TIME = 30;
	/**
	 * TODO change time depending on requirements
	 */
	let cooldownCounter = 0;
	let timer;
	$: displayCooldownCounter = `(${cooldownCounter.toString()})`;

	afterUpdate(() => {
		if (cooldownCounter === 0) {
			if (timer) {
				clearInterval(timer);
				timer = null;
				isCooldown = false;
				// isResetLinkSent = false;
			}
		}
	});

	onDestroy(() => {
		if (timer) {
			clearInterval(timer);
		}
	});

	function startCounter() {
		cooldownCounter = COOLDOWN_TIME;
		timer = setInterval(() => {
			cooldownCounter -= 1;
		}, 1000);
	}

	async function handlePasswordReset() {
		sendPasswordResetEmail(auth, email)
			.then(() => {
				startCounter();
				isLinkError = false;
				isCooldown = true;
				isResetClicked = true;
				// Password reset email sent!
				// ..
			})
			.catch((error) => {
				isLinkError = true;
				isResetClicked = true;

				errorMessage = getFriendlyErrorMessage(error.code);

				// ..
			});
	}
</script>

<Nav>
	<NavLink
		class="p-0"
		on:click={() => {
			goto(ROUTES.login);
		}}
	>
		<Icon name="arrow-left" />
		Back
	</NavLink>
</Nav>
<h3>Forgot Password?</h3>
<p>
	No worries! Enter the email associated with your account. We’ll send you a secure link to reset
	your password.
</p>
<FormGroup>
	<Label for="emailVerification">Email</Label>
	<InputGroup>
		<Input
			type="email"
			id="emailVerification"
			placeholder="example@domain.com"
			rows={3}
			bind:value={email}
		/>
		<Button disabled={isCooldown} color="primary" on:click={handlePasswordReset}>
			Get Link {isCooldown ? displayCooldownCounter : ''}
		</Button>
	</InputGroup>
</FormGroup>

<Collapse isOpen={isResetClicked}>
	<Alert open color={isLinkError ? 'danger' : 'success'}
		>{isLinkError ? errorMessage : 'Link has been successfully sent'}</Alert
	>
	{#if !isLinkError}
		<Button
			block
			color="primary"
			on:click={() => {
				goto(ROUTES.login);
			}}
		>
			Back to Login
		</Button>
	{/if}
</Collapse>
