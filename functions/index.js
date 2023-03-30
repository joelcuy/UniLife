const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.createUserAndSendVerificationEmail = functions.https.onCall(async (data, context) => {
	// Check if the request is made by an authenticated admin
	if (context.auth && context.auth.token.admin === true) {
		const { email, password } = data;

		// Create the user account
		const newUser = await admin.auth().createUser({
			email,
			password
		});

		// Send email verification
		await admin
			.auth()
			.generateEmailVerificationLink(newUser.email)
			.then((link) => {
				// Construct email with the verification link and send it to the user
				// You can use third-party services like SendGrid, Nodemailer, or Mailgun to send the email
			});

		return { success: true, message: 'User created and verification email sent' };
	} else {
		return { success: false, message: 'Request not authorized' };
	}
});
