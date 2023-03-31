export const ROUTES = Object.freeze({
	root: '/',
	// Authentication
	login: '/auth/login',
	signup: '/auth/signup',
	adminLogin: '/auth/admin',
	forgotPassword: '/forgot-password',

	//Student
	feed: '/student/feed',
	discover: '/student/discover',
	profile: '/student/profile',
	editProfile: '/student/profile/edit',

	//Organization
	requestOrgAccess: '/request-organization-access',
	orgDashboard: '/organization',

	//Admin
	adminDashboard: '/admin'
});
