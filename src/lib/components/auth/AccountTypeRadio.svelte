<script>
	import {
		Icon,
	} from 'sveltestrap';

	let dispatch = createEventDispatcher();
	import { createEventDispatcher } from 'svelte';
	export let selectedRole;

	$: if (selectedRole) {
		dispatch('selectRole', {
			selectedRole
		});
	}
</script>

<section>
	<div>
		<input
			type="radio"
			id="student"
			name="select"
			value="student"
			checked
			bind:group={selectedRole}
		/>
		<label for="student">
			<Icon name="mortarboard-fill" />
			<p>Student</p>
		</label>
	</div>
	<div>
		<input
			type="radio"
			id="organization"
			name="select"
			value="organization"
			bind:group={selectedRole}
		/>
		<label for="organization">
			<Icon name="building" />
			<p>Organization</p>
		</label>
	</div>
</section>

<style>
	p {
		font-size: 1rem;
		margin: 0;
	}

	section {
		display: flex;
		column-gap: 10px;
	}
	section > div {
		flex: 1;
	}
	input[type='radio'] {
		display: none;
	}
	input[type='radio']:not(:disabled) ~ label {
		cursor: pointer;
		color: var(--bs-disabled);
	}
	label {
		display: block;
		border: 1.5px solid var(--bs-disabled);
		border-radius: 10px;
		text-align: center;
		position: relative;
		font-size: 2rem;
	}
	input[type='radio']:checked + label {
		border: 1.5px solid var(--bs-primary);
		background: var(--bs-primary);
		color: var(--bs-light);
	}
	input[type='radio']:checked + label::after {
		color: var(--bs-primary);
		font-family: FontAwesome;
		border: 1.5px solid var(--bs-primary);
		content: '\f00c';
		font-size: 1.25rem;
		position: absolute;
		top: -15px;
		right: -10px;
		/* transform: translateX(110%); */
		height: 2rem;
		width: 2rem;
		line-height: 2rem;
		border-radius: 50%;
		background: var(--bs-light);
	}
</style>
