<script>
</script>

<div class="card-layer">
	<slot />
</div>

<style>
	.card-layer {
		display: flex;
		margin: 0 auto;
		flex-direction: column;
		row-gap: 16px;
		padding: 32px 24px;
		background-color: rgba(255, 255, 255, 0.75);
		width: 85%;
		border-radius: 10px;
	}
</style>
