const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.createUserAndSendVerificationEmail = functions.https.onCall(async (data, context) => {
	// console.log(context.auth);
	// Check if the request is made by an authenticated admin
	if (context.auth) {
		const currentUserUID = context.auth.uid;
		const { email, password } = data;

		// Get the user's isAdmin status from Firestore
		const userDoc = await admin.firestore().collection('users').doc(currentUserUID).get();

		if (userDoc.exists && userDoc.data().role === 'admin') {
			// Create the user account
			const newUser = await admin.auth().createUser({
				email,
				password
			});

			return { success: true, message: 'User created' };
		} else {
			return { success: false, message: 'Request not authorized' };
		}
	} else {
		return { success: false, message: 'Request not authenticated' };
	}
});
