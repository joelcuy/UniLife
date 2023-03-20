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
