<script>
	import {
		Icon,
		Form,
		FormGroup,
		Input,
		Label,
		Button,
		Alert,
		NavLink,
		Nav,
		InputGroup,
		InputGroupText
	} from 'sveltestrap';
	import { authCheck, checkEmptyValues } from '$lib/auth';
	import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
	import { auth, db } from '$lib/Firebase';
	import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
	import { ROUTES } from '$lib/routelist';
	import { goto } from '$app/navigation';

	let email;
	let orgName;
	let about;
	let password;
	let passwordConfirmation;

	let passwordState = 'password';

	$: iconType = passwordState === 'text' ? 'eye-slash' : 'eye';

	// let docRef;
	const PAGE_STATES = Object.freeze({ form: 1, loading: 2, complete: 3 });
	let currentPageState = PAGE_STATES.form;
	let isError = false;
	let errorMessage;

	async function createAccount() {
		console.log(email);
		console.log(orgName);
		console.log(about);
		console.log(password);
		console.log(passwordConfirmation);

		// Value check for account creation fields
		const authResult = authCheck(email, password, passwordConfirmation);

		// Value check for organization request fields
		const validationResult = checkEmptyValues(['Organization name', orgName], ['About', about]);

		if (authResult.isError) {
			isError = true;
			errorMessage = authResult.message;
			throw new Error(authResult.message);
		} else if (validationResult.isError) {
			isError = true;
			errorMessage = validationResult.message;
			throw new Error(validationResult.message);
		} else {
			try {
				const userCredential = await createUserWithEmailAndPassword(auth, email, password);
				const userRef = doc(db, 'users', userCredential.user.uid);
				await setDoc(userRef, {
					role: 'organization',
					isActive: false
				});
				console.log('Organization data appended to Firestore');
				await sendEmailVerification(userCredential.user);

				submitOrganizationRequest(userCredential.user.uid);
				// Signed in
			} catch (error) {
				console.error('Error during submitting request:', error);
			}
		}
	}

	async function submitOrganizationRequest(userUID) {
		// Create a timestamp using the Date object
		const timestamp = new Date().toISOString();
		try {
			currentPageState = PAGE_STATES.loading;

			let docRef = await addDoc(collection(db, 'organizationRequests'), {
				userUidFk: userUID,
				email: email,
				orgName: orgName,
				about: about,
				requestStatus: 'Pending',
				requestDate: timestamp
			});
			console.log('Org Request document written with ID: ', docRef.id);
			currentPageState = PAGE_STATES.complete;
			// Go to org dashboard
			goto(ROUTES.orgDashboard);
		} catch (error) {
			console.error('Error writing document to Firestore:', error);
		}
	}
</script>

<Nav>
	<NavLink class="p-0" href={ROUTES.signup}><Icon name="arrow-left" /> Back</NavLink>
</Nav>
<h4 class="text-center">Request Organization Account</h4>
<p class="m-0 text-danger">
	Note: Organization accounts require approval from an administrator before access is granted.
</p>
<Alert color="danger" bind:isOpen={isError}>
	{errorMessage}
</Alert>
{#if currentPageState === PAGE_STATES.form}
	<Form>
		<FormGroup>
			<Label for="orgName">Organization Name</Label>
			<Input
				type="text"
				name="orgName"
				id="orgName"
				placeholder="e.g. UoN Volleyball Club"
				bind:value={orgName}
			/>
		</FormGroup>
		<FormGroup>
			<Label for="about">About</Label>
			<Input
				type="textarea"
				name="about"
				id="about"
				rows="4"
				placeholder="Write a little bit about your organization here"
				bind:value={about}
			/>
		</FormGroup>
		<FormGroup>
			<Label for="email">Email</Label>
			<Input
				type="email"
				name="email"
				id="email"
				placeholder="Email for account creation"
				bind:value={email}
			/>
		</FormGroup>
		<FormGroup>
			<Label for="password">Password</Label>
			<InputGroup>
				<Input
					type={passwordState}
					placeholder="at least 8 characters"
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
			<Label for="password2">Re-enter Password</Label>
			<InputGroup>
				<Input
					type={passwordState}
					placeholder="at least 8 characters"
					name="password2"
					id="password2"
					bind:value={passwordConfirmation}
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
			<Button
				color="primary"
				disabled={currentPageState === PAGE_STATES.loading}
				block
				on:click={createAccount}>Submit</Button
			>
		</FormGroup>
	</Form>
{:else if currentPageState === PAGE_STATES.loading}
	loading...
{:else if currentPageState === PAGE_STATES.complete}
	Request submitted successfully
{/if}

<style>
</style>
