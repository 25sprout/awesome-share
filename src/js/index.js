import $ from 'jquery';
import { uploadHtml, uploadImage } from './firebase';
import createMetaHtml from './meta';

import '../css/index/index.css';

$(document).ready(() => {
	$('#upload-html').on('click', () => {
		const newMetaBlob = createMetaHtml();

		uploadHtml(newMetaBlob).then((snapshot) => {
			/**
			 * get file url
			 */

			console.log(snapshot);
		});
	});

	$('.image-upload').on('change', () => {
		const preview = document.querySelector('img');
		const file = document.querySelector('input[type=file]').files[0];
		const reader = new FileReader();

		reader.addEventListener('load', () => {
			preview.src = reader.result;
		}, false);

		if (file) {
			reader.readAsDataURL(file);

			uploadImage(file).then((snapshot) => {
				/**
				 * get file url
				 */

				$(`[name='meta-image']`).val(snapshot.downloadURL);
			});
		}
	});

	$('.form input, .form textarea').on('change', function () {
		if ($(this).val()) {
			$('.preview .card').addClass('_show');
		}
	});
});
