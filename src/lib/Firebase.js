import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyAq4ezH95mVvhY8FnM6Cg1oZxW-EZ-_VFw',
	authDomain: 'unilife-bd39b.firebaseapp.com',
	projectId: 'unilife-bd39b',
	storageBucket: 'unilife-bd39b.appspot.com',
	messagingSenderId: '107410577059',
	appId: '1:107410577059:web:fc63dcb501e89b434dd116',
	measurementId: 'G-VR6ZQS1Y71'
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const functions = getFunctions(app);

const db = getFirestore(app);

const storage = getStorage();

export { app, auth, db, functions, storage };
