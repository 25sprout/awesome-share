export default {
	NODE_ENV: process.env.NODE_ENV && JSON.stringify(process.env.NODE_ENV.toUpperCase()),
	DEV: JSON.stringify(process.env.NODE_ENV === 'dev'),
	DEMO: JSON.stringify(process.env.NODE_ENV === 'demo'),
	PRODUCTION: JSON.stringify(process.env.NODE_ENV === 'production'),
};
