import $ from 'jquery';
import firebaseDatabase, { uploadHtml, uploadImage, saveMetaData } from './firebase';
import createMetaHtml from './meta';

import '../css/index/index.css';
import '../../node_modules/font-awesome/css/font-awesome.css';

const drawRecentList = (snapshot) => {
	snapshot.forEach((childSnapshot) => {
		const metaObjectKey = childSnapshot.key;
		const metaObject = childSnapshot.val();

		console.log(metaObjectKey);
		console.log(metaObject);

		const newMetaObject = $('.meta-object-template')
			.clone().removeClass('meta-object-template');

		newMetaObject.find('.cover').append(`<img src='${metaObject.image}' />`);
		newMetaObject.find('.title').text(metaObject.title);
		newMetaObject.find('.link a').attr('href', metaObject.file);
		newMetaObject.find('.link a').text(metaObject.file);

		$('.recent .list').append(newMetaObject);
	});
};

const getLinkLists = () => (
	firebaseDatabase
		.ref('meta')
		.on('value', (snapshot) => {
			drawRecentList(snapshot);
		})
);

$(document).ready(() => {
	getLinkLists();

	$('#upload-html').on('click', () => {
		if ($('#upload-html').hasClass('loading')) {
			return;
		}

		const metaData = {
			title: $(`[name='meta-title']`).val(),
			description: $(`[name='meta-description']`).val(),
			image: $(`[name='meta-image']`).val(),
			url: $(`[name='meta-url']`).val(),
		};

		if (!metaData.title) {
			return;
		}

		if (!metaData.description) {
			return;
		}

		if (!metaData.image) {
			return;
		}

		/**
		 * set loading status
		 */
		$('#upload-html').addClass('loading');

		/**
		 * upload html
		 */
		uploadHtml(createMetaHtml(metaData)).then((snapshot) => {
			/**
			 * get file url
			 */
			$('#upload-html').removeClass('loading');

			if (!snapshot.downloadURL) {
				$('.preview .link a').attr('href', '');
				$('.preview .link').removeClass('_show');

				return;
			}

			$('.preview .link a').attr('href', snapshot.downloadURL);
			$('.preview .link a').text(snapshot.downloadURL);
			$('.preview .link').addClass('_show');

			/**
			 * save to database
			 */

			metaData.file = snapshot.downloadURL;

			saveMetaData(metaData).then((response) => {
				console.log(`save to databse with key ${response.key}`);
			});
		});
	});

	$('.image-upload').on('change', () => {
		$('.preview .cover').addClass('loading');

		const file = document.querySelector('input[type=file]').files[0];

		if (file) {
			uploadImage(file).then((snapshot) => {
				/**
				 * get file url
				 */
				$(`[name='meta-image']`).val(snapshot.downloadURL).change();

				$('.preview .cover').removeClass('loading');
				$('.preview .card').addClass('_show');
			});
		}
	});

	$(`[name='meta-image']`).on('change', function () {
		$('.preview .cover img').attr('src', $(this).val());
	});

	$(`[name='meta-title']`).on('keydown', function () {
		if ($(this).val()) {
			$('.preview .card').addClass('_show');
		}

		$('.card .title').text($(this).val());
	});

	$(`[name='meta-description']`).on('keydown', function () {
		if ($(this).val()) {
			$('.preview .card').addClass('_show');
		}

		$('.card .description').text($(this).val());
	});
});
