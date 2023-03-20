<script>
	import { Form, FormGroup, Input, Label, Button } from 'sveltestrap';
	import { createEventDispatcher } from 'svelte';
	import { ROUTES } from '../../routelist';

	let dispatch = createEventDispatcher();
	let email, password;

	function dispatchLoginData() {
		dispatch('clickLogin', {
			email,
			password
		});
	}
</script>

<Form>
	<!-- <Alert color="danger">test</Alert> -->
	<FormGroup floating label="Email">
		<!-- <Label for="email">Email</Label> -->
		<Input type="email" placeholder="." bind:value={email} />
	</FormGroup>
	<FormGroup floating label="Password">
		<!-- <Label for="password">Password</Label> -->
		<Input type="password" placeholder="." name="password" id="password" bind:value={password} />
	</FormGroup>
	<FormGroup>
		<a href={ROUTES.forgotPassword}>Forgotten password?</a>
	</FormGroup>
	<FormGroup>
		<Button color="primary" block on:click={dispatchLoginData}>Login</Button>
	</FormGroup>
	<!-- {#if loading}
                <div class="spinnerDiv">
                    <Spinner color="danger" />
                </div>
            {:else} -->

	<!-- {/if} -->
</Form>

<style>
	a {
		display: block;
		text-align: center;
	}
</style>
