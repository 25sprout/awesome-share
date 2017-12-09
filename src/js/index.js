import $ from 'jquery';
import firebaseDatabase, { uploadHtml, uploadImage, saveMetaData, deleteMetaData } from './firebase';
import createMetaHtml from './meta';
import getTimestamp from './time';
import { config } from './appConfig';
import { isGuest } from './common';

import '../css/index/index.css';
import '../../node_modules/font-awesome/css/font-awesome.css';

const drawRecentList = (snapshot) => {
	snapshot.forEach((childSnapshot) => {
		const metaObjectKey = childSnapshot.key;
		const metaObject = childSnapshot.val();

		const newMetaObject = $('.meta-object-template')
			.clone().removeClass('meta-object-template');

		if (isGuest()) {
			newMetaObject.find('.controls').remove();
		}

		newMetaObject.attr('data-key', metaObjectKey);
		newMetaObject.find('.cover').append(`<img src='${metaObject.image}' />`);
		newMetaObject.find('.title').text(metaObject.title);
		newMetaObject.find('.description').text(metaObject.description);
		newMetaObject.find('.link a').attr('href', metaObject.file);
		newMetaObject.find('.link a').text(metaObject.file);

		$('.recent .list').append(newMetaObject);
	});
};

const getLinkLists = () => {
	firebaseDatabase
		.ref(config.user)
		.orderByChild('update')
		.on('value', (snapshot) => {
			$('.recent .list .meta-object').not('.meta-object-template').remove();

			drawRecentList(snapshot);
		});
};

const authAction = () => {
	$('.login-wrapper > div').on('click', function () {
		$('.login-wrapper > div').removeClass('active');
		$(this).addClass('active');

		if ($(this).attr('rel') !== 'cathy') {
			config.user = 'guest';
		} else {
			config.user = 'cathy';
		}

		getLinkLists();
	});
};

const listAction = () => {
	$('body').on('click', '.meta-object .delete', function () {
		deleteMetaData(
			$(this)
				.parents('.meta-object')
				.attr('data-key'),
		);
	});
};

const formAction = () => {
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
				$('.share-link a').attr('href', '');
				$('.share-link').removeClass('_show');

				return;
			}

			$('.share-link a').attr('href', snapshot.downloadURL);
			$('.share-link a').text(snapshot.downloadURL);
			$('.share-link').addClass('_show');

			/**
			 * save to database
			 */

			metaData.file = snapshot.downloadURL;
			metaData.update = getTimestamp() * -1;

			saveMetaData(metaData).then((response) => {
				console.log(`save to databse with key ${response.key}`);
			});
		});
	});

	$('.image-upload-group > i').on('click', () => {
		$('.image-upload').trigger('click');
	});

	$('.image-upload').on('change', () => {
		$('.preview .cover').addClass('loading');

		const file = document.querySelector('input[type=file]').files[0];

		if (file) {
			$('.image-upload-group i')
				.removeClass('fa-cloud-upload')
				.addClass('fa-spinner fa-spin');

			uploadImage(file).then((snapshot) => {
				/**
				 * get file url
				 */
				$(`[name='meta-image']`).val(snapshot.downloadURL).change();

				$('.image-upload-group i')
					.addClass('fa-cloud-upload')
					.removeClass('fa-spinner fa-spin');

				$('.preview .cover').removeClass('loading');
				$('.preview .card').addClass('_show');
			});
		}
	});

	$(`[name='meta-image']`).on('change', function () {
		$('.preview .cover img').attr('src', $(this).val());
	});

	$(`[name='meta-title']`).on('keyup', function () {
		if ($(this).val()) {
			$('.preview .card').addClass('_show');
		}

		$('.card .title').text($(this).val());
	});

	$(`[name='meta-description']`).on('keyup', function () {
		if ($(this).val()) {
			$('.preview .card').addClass('_show');
		}

		$('.card .description').text($(this).val());
	});
};

$(document).ready(() => {
	getLinkLists();
	authAction();
	listAction();
	formAction();
});
