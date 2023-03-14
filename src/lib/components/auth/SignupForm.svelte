<script>
	import { Form, FormGroup, Input, Label, Button, Spinner, Alert } from 'sveltestrap';
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
</script>

<Form>
	<FormGroup>
		<Label for="email">Email</Label>
		<Input type="email" name="email" id="email" placeholder="name@domain.com" bind:value={email} />
	</FormGroup>
	<FormGroup>
		<Label for="password1">Password</Label>
		<Input
			type="password"
			name="password"
			id="password1"
			placeholder="at least 8 characters"
			bind:value={password}
		/>
	</FormGroup>
	<FormGroup>
		<Label for="password2">Re-enter Password</Label>
		<Input
			type="password"
			name="password"
			id="password2"
			placeholder="at least 8 characters"
			bind:value={passwordConfirmation}
		/>
	</FormGroup>
	<FormGroup>
		<Button block on:click={dispatchSignupData}>Sign Up</Button>
	</FormGroup>
</Form>

<style>
</style>
