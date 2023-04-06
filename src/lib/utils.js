import { auth, app } from './Firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { ROUTES } from '$lib/routelist';
import { goto } from '$app/navigation';
import { db } from './Firebase';

export async function getCategoryName(uid) {
	if (!uid) {
		return null;
	}

	try {
		const userDocSnap = await getDoc(doc(db, 'ecaCategory', uid));

		if (userDocSnap.exists()) {
			return userDocSnap.data().name;
		} else {
			return null;
		}
	} catch (error) {
		console.error('Error reading data from Firestore:', error);
	}
}

// Convert from Long Date JS format to app display format
// Long Date Format: Tue Apr 11 2023 04:13:00 GMT+0100 (British Summer Time)
export function customDateFormat(date) {
	const timezoneOffset = date.toString().slice(28, 31);
	// Format the date part
	const formattedDate = date.toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});

	// Format the time part
	// const formattedTime = date.toLocaleTimeString('en-GB', {
	// 	hour: '2-digit',
	// 	minute: '2-digit',
	// 	timeZoneName: 'short'
	// });

	// return formattedDate;
	return `${formattedDate} ${timezoneOffset}`;
}
