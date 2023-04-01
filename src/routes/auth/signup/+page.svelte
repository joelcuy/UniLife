<script>
	import { ROUTES } from '$lib/routelist';
	import AccountTypeRadio from '../../../lib/components/auth/AccountTypeRadio.svelte';
	import { Form, FormGroup, Input, Label, Button, Icon } from 'sveltestrap';
	import { goto } from '$app/navigation';

	let selectedRole = 'student';

	function nextPage() {
		if (selectedRole === 'student') {
			goto(ROUTES.signupStudent);
		} else if (selectedRole === 'organization') {
			goto(ROUTES.signupOrg);
		}
	}
</script>

<svelte:head>
	<title>Sign Up</title>
</svelte:head>

<div class="center">
	<h3>Sign Up</h3>
	<p>Already a member? <a href={ROUTES.login}>Log in</a></p>
</div>
<AccountTypeRadio
	{selectedRole}
	on:selectRole={(event) => (selectedRole = event.detail.selectedRole)}
/>
<div class="center">
	<h6>Choose Account Type</h6>
	{#if selectedRole === 'student'}
		<p>
			Discover and join extracurricular activities and stay updated on events related to your
			interests.
		</p>
	{:else if selectedRole === 'organization'}
		<p>
			Promote and manage extracurricular activities for students. Connect with your target audience
			and foster a sense of community while tracking attendance and engagement.
		</p>
	{/if}
</div>
<Button color="primary" block on:click={nextPage}>Next</Button>

<style>
	.center {
		display: block;
		text-align: center;
	}
</style>
