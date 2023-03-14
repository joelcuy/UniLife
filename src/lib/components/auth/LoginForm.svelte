<script>
	import { Form, FormGroup, Input, Label, Button } from 'sveltestrap';
	import { createEventDispatcher } from 'svelte';

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
	<FormGroup>
		<Label for="email">Email</Label>
		<Input type="email" name="email" id="email" bind:value={email} />
	</FormGroup>
	<FormGroup>
		<Label for="password">Password</Label>
		<Input type="password" name="password" id="password" bind:value={password} />
	</FormGroup>
	<FormGroup>
		<Button block on:click={dispatchLoginData}>Login</Button>
	</FormGroup>
	<a href="/forgot_password">Forgotten password?</a>
	<!-- {#if loading}
                <div class="spinnerDiv">
                    <Spinner color="danger" />
                </div>
            {:else} -->

	<!-- {/if} -->
</Form>
