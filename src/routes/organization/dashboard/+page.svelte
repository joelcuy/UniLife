<script>
	import { signout } from '$lib/auth';
	import {
		Button,
		Card,
		CardBody,
		CardFooter,
		CardHeader,
		CardSubtitle,
		CardText,
		CardTitle,
		Nav,
		NavLink,
		FormGroup,
	} from 'sveltestrap';

	let isLoading = true;
	let orgRequests = [];
</script>

<h4>Your Events</h4>
{#if isLoading}
	Loading...
{:else}
	{#each orgRequests as orgRequest}
		<Card class="mb-2 mx-2">
			<CardHeader class="d-flex flex-row justify-content-between">
				<CardTitle class="my-2">{orgRequest.orgName}</CardTitle>
				<Nav>
					<NavLink href="#" class="px-0">View Details</NavLink>
				</Nav>
			</CardHeader>
			<CardBody>
				<CardSubtitle>Email</CardSubtitle>
				<CardText>{orgRequest.email}</CardText>
				<CardSubtitle>About</CardSubtitle>
				<CardText>{orgRequest.about}</CardText>
			</CardBody>
			<CardFooter class="d-flex flex-row justify-content-end">
				{#if orgRequest.requestStatus === 'Pending'}
					<Button class="me-2" color="primary" on:click={() => {}}>Approve</Button>
					<Button color="primary" outline>Reject</Button>
				{:else}
					{orgRequest.requestStatus.charAt(0).toUpperCase() + orgRequest.requestStatus.slice(1)}
				{/if}
			</CardFooter>
		</Card>
	{/each}
{/if}

<FormGroup>
	<Button color="primary" id="login-button" block on:click={signout}>SignOut</Button>
</FormGroup>
