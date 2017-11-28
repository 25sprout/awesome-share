import * as firebase from 'firebase';
import { firebaseConfig } from './appConfig';

firebase.initializeApp(firebaseConfig);

const firebaseDatabase = firebase.database();

export const firebaseStorage = firebase.storage();

export const uploadImage = (imageBlob) => {
	const timestamp = new Date().getTime();

	return firebase.storage()
		.ref()
		.child(`cover-${timestamp}.jpg`)
		.put(imageBlob);
};

export const uploadHtml = (metaBlob) => {
	const timestamp = new Date().getTime();

	return firebase.storage()
		.ref()
		.child(`meta-${timestamp}.html`)
		.put(metaBlob);
};

export const saveMetaData = (metaData) => (
	firebase.database()
		.ref('meta')
		.push(metaData)
);

export default firebaseDatabase;
