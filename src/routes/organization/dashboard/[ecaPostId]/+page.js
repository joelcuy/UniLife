// import { auth, db, storage } from '$lib/Firebase';
// import { collection, doc, addDoc, getDoc, onSnapshot, where, query } from 'firebase/firestore';
// import { onAuthStateChanged } from 'firebase/auth';
// import { onMount } from 'svelte';

// /** @type {import('./$types').PageLoad} */
// export async function load({ params }) {
// 	const postRef = doc(db, 'ecaPosts', params.ecaPostId);

// 	const postDocSnap = await getDoc(postRef);

// 	if (postDocSnap.exists()) {
// 		// console.log('Document data:', userDocSnap.data());
// 		// orgRequests.push({ ...doc.data(), uid: doc.id });
// 		return { ...postDocSnap.data(), uid: postDocSnap.id };
// 		// userRole = userData.role;
// 		// console.log(userRole);
// 		console.log('Successful data read from Firestore');
// 	} else {
// 		console.log('No such document!');
// 	}

// 	// return params.ecaPostId;
// }

// import { error } from '@sveltejs/kit';

// /** @type {import('./$types').PageLoad} */
// export function load({ params }) {
// 	if (params.slug === 'hello-world') {
// 		return {
// 			title: 'Hello world!',
// 			content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
// 		};
// 	}

// 	throw error(404, 'Not found');
// }
