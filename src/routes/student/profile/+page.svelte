<script>
	import { FormGroup, Button } from 'sveltestrap';
	import { auth, app, db } from '../../../lib/Firebase';
	import { onMount } from 'svelte';
	import { onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
	import { ROUTES } from '$lib/routelist';

	let userData = {};

	onMount(async () => {
		// console.log($currentUserData);
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				// User is signed in, read data from Firestore
				const userUID = user.uid;
				try {
					const userRef = doc(db, 'users', userUID);
					const userDocSnap = await getDoc(userRef);

					if (userDocSnap.exists()) {
						console.log('Document data:', userDocSnap.data());
						userData = userDocSnap.data();

						// Write to Svelte store for overall app use
						// currentUserData.set({ ...userData, uid: userUID });
					} else {
						// doc.data() will be undefined in this case
						console.log('No such document!');
					}
					console.log('Successful data read from Firestore');
				} catch (error) {
					console.error('Error reading user data from Firestore:', error);
				}
			} else {
				console.log('no current user');
			}
		});
	});
</script>

<!-- <div class="mask">
	<img
		alt="asdf"
		src="https://images.unsplash.com/photo-1603775020644-eb8decd79994?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cG9ydHJhaXQlMjBwaG90b2dyYXBoeXxlbnwwfHwwfHw%3D&w=1000&q=80"
	/>
</div> -->
<!-- <img alt="asdf" src="https://picsum.photos/id/426/400/600.jpg" /> -->
<div class="page-container">
	<div class="profile-pic">
		<div
			class="image"
			style="background-image:url(https://media.licdn.com/dms/image/C4E03AQHAl2fCMkjdDg/profile-displayphoto-shrink_800_800/0/1622877807288?e=2147483647&v=beta&t=LDXFI0565H0IZltUmKWo12OUTouBkCxoz3vwteQ8Zc4)"
		/>
	</div>

	<h1>{userData.name}</h1>
	<br />
	<h5>Education Institution</h5>
	<p>{userData.educationInstitution}</p>
	<h5>Course of Study</h5>
	<p>{userData.course}</p>
	<h5>Bio</h5>
	<p>{userData.bio}</p>

	<FormGroup>
		<Button
			color="primary"
			id="login-button"
			block
			on:click={() => {
				goto(ROUTES.editProfile);
			}}
		>
			Edit Profile
		</Button>
	</FormGroup>
</div>

<style>
	.page-container {
		padding: 1rem;
	}
	/* TODO Move into layout */

	h1 {
		text-align: center;
	}

	p {
		text-align: justify;
	}

	.profile-pic {
		width: 45%;
		margin: auto;
	}

	div.image {
		/* make it responsive */
		max-width: 100%;
		width: 100%;
		height: auto;
		display: block;
		/* div height to be the same as width*/
		padding-top: 100%;

		/* make it a circle */
		border-radius: 50%;

		/* Centering on image`s center*/
		background-position-y: center;
		background-position-x: center;
		background-repeat: no-repeat;

		/* it makes the clue thing, takes smaller dimension to fill div */
		background-size: cover;

		/* it is optional, for making this div centered in parent*/
		margin: 0 auto;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	/* .mask {
		-webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 50%, transparent 100%);
		mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 50%, transmask 100%);
	}

	img {
		width: 100vw;
		max-height: 300px;
		background-position: center;
	} */
</style>
