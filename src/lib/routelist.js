export const ROUTES = Object.freeze({
	root: '/',
	// Authentication
	adminLogin: '/auth/admin',
	forgotPassword: '/auth/forgot-password',
	login: '/auth/login',
	signup: '/auth/signup',
	signupOrg: '/auth/signup/organization',
	signupStudent: '/auth/signup/student',

	//Organization
	orgDashboard: '/organization/dashboard',
	// orgEventDetail: '/organization/dashboard/detail',
	orgCreateEvent: '/organization/create-event',
	orgProfile: '/organization/profile',
	orgEditProfile: '/organization/profile/edit',

	//Student
	feed: '/student/feed',
	discover: '/student/discover',
	profile: '/student/profile',
	editProfile: '/student/profile/edit',

	//Admin
	adminDashboard: '/admin'
});

export const publicRoutes = [
	ROUTES.root,
	ROUTES.adminLogin,
	ROUTES.forgotPassword,
	ROUTES.login,
	ROUTES.signup,
	ROUTES.signupOrg,
	ROUTES.signupStudent,
];
