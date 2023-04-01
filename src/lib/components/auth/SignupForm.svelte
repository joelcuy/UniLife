<script>
	import {
		Form,
		FormGroup,
		Input,
		Label,
		Button,
		Spinner,
		Alert,
		Icon,
		NavLink,
		Nav,
		InputGroup,
		InputGroupText
	} from 'sveltestrap';
	import { createEventDispatcher } from 'svelte';

	let dispatch = createEventDispatcher();
	let email, password, passwordConfirmation;

	function dispatchSignupData() {
		dispatch('clickSignup', {
			email,
			password,
			passwordConfirmation
		});
	}

	let passwordState = 'password';

	$: iconType = passwordState === 'text' ? 'eye-slash' : 'eye';
</script>

<Form>
	<FormGroup>
		<Label for="email">Email</Label>
		<Input type="email" name="email" id="email" placeholder="name@domain.com" bind:value={email} />
	</FormGroup>
	<FormGroup>
		<Label for="password">Password</Label>
		<InputGroup>
			<Input
				type={passwordState}
				placeholder="at least 8 characters"
				name="password"
				id="password"
				bind:value={password}
			/>
			<InputGroupText>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<span
					on:click={() => {
						if (passwordState === 'password') {
							passwordState = 'text';
						} else {
							passwordState = 'password';
						}
					}}
				>
					<Icon name={iconType} />
				</span>
			</InputGroupText>
		</InputGroup>
	</FormGroup>
	<FormGroup>
		<Label for="password2">Re-enter Password</Label>
		<InputGroup>
			<Input
				type={passwordState}
				placeholder="at least 8 characters"
				name="password2"
				id="password2"
				bind:value={passwordConfirmation}
			/>
			<InputGroupText>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<span
					on:click={() => {
						if (passwordState === 'password') {
							passwordState = 'text';
						} else {
							passwordState = 'password';
						}
					}}
				>
					<Icon name={iconType} />
				</span>
			</InputGroupText>
		</InputGroup>
	</FormGroup>
	<FormGroup>
		<Button color="primary" block on:click={dispatchSignupData}>Sign Up</Button>
	</FormGroup>
</Form>

<style>
</style>
