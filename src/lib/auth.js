import { auth, app } from './Firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

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

export function authCheck(email, password, passwordConfirmation) {
	if (email.length == 0 && password.length == 0) {
		return { isError: true, message: 'Please enter email address and password' };
	} else if (email.length == 0) {
		return { isError: true, message: 'Please enter email address' };
	} else if (!email.match(validRegex)) {
		return { isError: true, message: 'Please enter a valid email address' };
	} else if (password == '') {
		return { isError: true, message: 'Please enter password' };
	} else if (password.length < 8) {
		return { isError: true, message: 'Password must be more than 8 characters' };
	} else if (password !== passwordConfirmation) {
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

// auth check

// Password generator

// regex check
