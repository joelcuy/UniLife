import { auth, app } from './Firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { ROUTES } from '$lib/routelist';
import { goto } from '$app/navigation';
import { db } from './Firebase';

export async function getUserRole(uid) {
	if (!uid) {
		return null;
	}

	try {
		const userDocSnap = await getDoc(doc(db, 'users', uid));

		if (userDocSnap.exists()) {
			return userDocSnap.data().role;
		} else {
			return null;
		}
	} catch (error) {
		console.error('Error reading data from Firestore:', error);
	}
}

let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export function authCheck(email, password, passwordConfirmation = undefined) {
	if (email.length == 0 && password.length == 0) {
		return { isError: true, message: 'Please enter email address and password' };
	} else if (email.length == 0) {
		return { isError: true, message: 'Please enter email address' };
	} else if (!email.match(validRegex)) {
		return { isError: true, message: 'Please enter a valid email address' };
	} else if (password == '') {
		return { isError: true, message: 'Please enter password' };
	} else if (passwordConfirmation !== undefined && password.length < 8) {
		return { isError: true, message: 'Password must be more than 8 characters' };
	} else if (passwordConfirmation !== undefined && password !== passwordConfirmation) {
		return { isError: true, message: 'Passwords do not match' };
	}

	return { isError: false };
}

export function checkEmptyValues(...args) {
	for (const [key, value] of Object.entries(Object.fromEntries(args))) {
		if (!value) {
			return { isError: true, message: `Please provide an input for ${key}` };
		}
	}
	return { isError: false };
}

export async function signout() {
	goto(ROUTES.login);
	signOut(auth)
		.then(() => {
			// Sign-out successful.
			console.log('signed out');
		})
		.catch((error) => {
			// An error happened.
		});
}
