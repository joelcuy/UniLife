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

// Convert { "seconds": 1680572700, "nanoseconds": 0} to datetime input format
export function firestoreTimestampToDatetimeLocal(timestamp) {
	const date = new Date(timestamp.seconds * 1000);
	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, '0');
	const dd = String(date.getDate()).padStart(2, '0');
	const hh = String(date.getHours()).padStart(2, '0');
	const min = String(date.getMinutes()).padStart(2, '0');

	return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

export function timeAgo(datetime) {
	const currentTime = new Date().getTime();
	const postTime = new Date(datetime.seconds * 1000).getTime();
	const diff = currentTime - postTime;

	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const weeks = Math.floor(days / 7);
	const months = Math.floor(days / 30);
	const years = Math.floor(months / 12);

	if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
	if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
	if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
	if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
	if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
	if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
	return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
}
