export const domain = process.env.NODE_ENV === 'PRODUCTION' ? 'www.example.com' : 'demoDomain.com';

export const youtubeConfig = {
	apiKey: 'AIzaSyDDV9bnLsR__oHqEYQdCw6is1-jCEt7gpg',
};

export const firebaseConfig = {
	apiKey: 'AIzaSyDDV9bnLsR__oHqEYQdCw6is1-jCEt7gpg',
	authDomain: 'awesome-share-fa90c.firebaseapp.com',
	databaseURL: 'https://awesome-share-fa90c.firebaseio.com',
	storageBucket: 'awesome-share-fa90c.appspot.com',
};

export const userConfig = {
	uid: 'guest',
};

export default 'this is app config';
