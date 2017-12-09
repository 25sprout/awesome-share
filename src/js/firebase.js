import * as firebase from 'firebase';
import { userConfig, firebaseConfig } from './appConfig';
import { isGuest } from './login';

firebase.initializeApp(firebaseConfig);

const firebaseDatabase = firebase.database();

export const firebaseStorage = firebase.storage();

export const uploadImage = (imageBlob) => {
	const timestamp = new Date().getTime();

	return firebase.storage()
		.ref(userConfig.uid)
		.child(`cover-${timestamp}.jpg`)
		.put(imageBlob);
};

export const uploadHtml = (metaBlob) => {
	const timestamp = new Date().getTime();

	return firebase.storage()
		.ref(userConfig.uid)
		.child(`meta-${timestamp}.html`)
		.put(metaBlob);
};

export const saveMetaData = (metaData) => (
	firebase.database()
		.ref(userConfig.uid)
		.push(metaData)
);

export const deleteMetaData = (dataKey) => {
	if (isGuest()) {
		return;
	}

	firebase.database()
		.ref(userConfig.uid)
		.child(dataKey)
		.remove();
};

export default firebaseDatabase;
