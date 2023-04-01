<script>
	import {
		Button,
		Card,
		CardBody,
		CardFooter,
		CardHeader,
		CardSubtitle,
		CardText,
		CardTitle
	} from 'sveltestrap';
</script>

<div class="d-flex flex-column justify-content-center min-vh-100 py-4">
	<div class="header">
		<h1>UniLife</h1>
		<h2>The #1 Student App</h2>
	</div>
	<div class="col-10 col-sm-8 col-md-6 col-lg-4 mx-auto">
		<Card class="mx-auto">
			<CardBody class="my-1 d-flex flex-column gap-3 ">
				<slot />
			</CardBody>
		</Card>
	</div>
</div>

<style>
	.header {
		text-align: center;
		margin-bottom: 1rem;
	}
</style>
