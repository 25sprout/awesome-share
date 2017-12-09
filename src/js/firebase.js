import * as firebase from 'firebase';
import { config, firebaseConfig } from './appConfig';

firebase.initializeApp(firebaseConfig);

const firebaseDatabase = firebase.database();

export const firebaseStorage = firebase.storage();

export const uploadImage = (imageBlob) => {
	const timestamp = new Date().getTime();

	return firebase.storage()
		.ref(config.user)
		.child(`cover-${timestamp}.jpg`)
		.put(imageBlob);
};

export const uploadHtml = (metaBlob) => {
	const timestamp = new Date().getTime();

	return firebase.storage()
		.ref(config.user)
		.child(`meta-${timestamp}.html`)
		.put(metaBlob);
};

export const saveMetaData = (metaData) => (
	firebase.database()
		.ref(config.user)
		.push(metaData)
);

export default firebaseDatabase;
