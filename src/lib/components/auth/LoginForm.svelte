<script>
	import { Form, FormGroup, Input, Label, Button, Icon } from 'sveltestrap';
	import { createEventDispatcher } from 'svelte';
	import { ROUTES } from '../../routelist';
	import { InputGroup, InputGroupText } from 'sveltestrap';

	let dispatch = createEventDispatcher();
	let email, password;

	let passwordState = 'password';

	function dispatchLoginData() {
		dispatch('clickLogin', {
			email,
			password
		});
	}

	$: iconType = passwordState === 'text' ? 'eye-slash' : 'eye';
</script>

<Form>
	<FormGroup>
		<Input type="email" placeholder="Email" bind:value={email} />
	</FormGroup>
	<FormGroup>
		<InputGroup>
			<Input
				type={passwordState}
				placeholder="Password"
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
		<div>
			<a href={ROUTES.forgotPassword}>Forgot password?</a>
		</div>
	</FormGroup>
	<Button color="primary" block on:click={dispatchLoginData}>Login</Button>
	<!-- {#if loading}
                <div class="spinnerDiv">
                    <Spinner color="danger" />
                </div>
            {:else} -->

	<!-- {/if} -->
</Form>

<style>
	div {
		text-align: right;
	}
</style>
