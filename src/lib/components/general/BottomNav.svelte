<script>
	import { Icon } from 'sveltestrap';

	export let options;
	export let activePath;
</script>

<nav class="nav">
	{#each options as option}
		<a href={option.path} class="nav-link" class:nav-link-active={activePath === option.path}>
			<Icon name={option.icon} />
			<!-- <span class="nav-text">{option.label}</span> -->
		</a>
	{/each}
</nav>

<style>
	.nav {
		position: fixed;
		bottom: 0;
		width: 100%;
		box-shadow: 0px 0px 8px var(--bs-dark);
		background-color: var(--bs-light);
		display: flex;
	}

	.nav-link {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex-grow: 1;
		min-width: 50px;
		overflow: hidden;
		white-space: nowrap;
		font-family: sans-serif;
		font-size: 1.5rem;
		color: var(--bs-dark);
		padding: 0.3rem;
		/* text-decoration: none; */
		/* -webkit-tap-highlight-color: transparent; */
		/* transition: background-color 0.1s ease-in-out; */
	}

	.nav-link:hover {
		background-color: var(--bs-disabled);
	}

	.nav-link-active {
		color: var(--bs-primary);
	}
</style>
