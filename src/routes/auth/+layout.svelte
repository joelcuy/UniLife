<script>
	import CustomCard from '../../lib/components/CustomCard.svelte';
</script>

<div class="page-container">
	<div class="header">
		<h1>UniLife</h1>
		<h2>The #1 Student App</h2>
	</div>
	<CustomCard>
		<slot />
	</CustomCard>
</div>

<style>
	.page-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		justify-content: center;
		/* background-color: rgba(227, 231, 235); */
	}

	.header {
		width: 100vw;
		display: flex;
		flex-direction: column;
		margin-bottom: 2rem;
		align-items: center;
	}

	.header h1,
	.header h2 {
		color: black;
	}
</style>
