import $ from 'jquery';
import { firebaseStorage as storage } from './firebaseSetup';
import createMetaHtml from './meta';

import '../css/index/index.css';

const storageRef = storage.ref();

$(document).ready(() => {
	$('#upload-html').on('click', () => {
		const newMetaBlob = createMetaHtml();

		storageRef.child('hello.html').put(newMetaBlob).then(() => {
			console.log('Uploaded a blob or file!');
		});
	});
});
