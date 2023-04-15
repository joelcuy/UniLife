<script>
	import { Card, CardBody } from 'sveltestrap';
</script>

<div class="bg-color d-flex flex-column justify-content-center min-vh-100 py-4">
	<div class="text-center mb-3 text-light">
		<h1 class="fw-bolder">UniLife</h1>
		<h2>The #1 Student App</h2>
	</div>
	<Card class="col-10 col-sm-8 col-md-6 col-lg-4 mx-auto">
		<CardBody class="my-1 d-flex flex-column gap-3 ">
			<slot />
		</CardBody>
	</Card>
</div>

<style>
	.bg-color {
		/* background-color: var(--bs-primary); */
		/* background: linear-gradient(45deg, var(--bs-primary), var(--bs-secondary) 80%); */
		background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
			url('../../lib/assets/backgroundImage.jpg'); /* Replace with the actual path to your image */
		background-position: top center;
		background-repeat: no-repeat;
		background-size: cover;
	}
</style>
