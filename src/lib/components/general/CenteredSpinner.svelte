<script>
	import { Spinner } from 'sveltestrap';

	export let isFullHeight = true;
</script>

<div class="d-flex justify-content-center align-items-center py-3" class:min-vh-100={isFullHeight}>
	<Spinner color="primary" />
</div>
